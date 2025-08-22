"""
Mock Redis Stream Consumer (리뷰 자산 생성 시뮬레이션)

- AI 모델 호출 대신 90초 대기 (asyncio.sleep)
- 성공/실패 랜덤 발생
- 결과는 Spring Callback API로 전달
- Prometheus 지표 노출 (/metrics)
"""

import asyncio
import json
import os
import socket
import random
import logging
import time
from typing import Any, Dict
from datetime import datetime

from redis import asyncio as redis
from models.review_generate_models import GenerateRequest
from services.review_generate_callback import review_generate_callback

# === Prometheus metrics ===
from prometheus_client import Counter, Histogram, generate_latest, CONTENT_TYPE_LATEST
from fastapi import FastAPI
from fastapi.responses import Response

# 처리 건수
MESSAGES_PROCESSED = Counter(
    "review_consumer_messages_processed_total",
    "총 처리된 메시지 수",
    ["stream"]
)

# 실패 건수
MESSAGES_FAILED = Counter(
    "review_consumer_messages_failed_total",
    "처리 실패한 메시지 수",
    ["stream"]
)

# DLQ 건수
MESSAGES_DLQ = Counter(
    "review_consumer_messages_dlq_total",
    "DLQ로 보낸 메시지 수",
    ["stream"]
)

# 처리 지연
MESSAGE_LATENCY = Histogram(
    "review_consumer_message_latency_seconds",
    "메시지 처리 지연 시간 (초)",
    ["stream"],
    buckets=[1, 5, 10, 30, 60, 90, 120, 180]
)

class MockReviewGenerateConsumer:
    def __init__(self) -> None:
        self.logger = logging.getLogger(__name__)
        self.redis_url: str = os.getenv("REDIS_URL", "redis://redis:6379/0")

        # Redis Consumer Group
        self.group: str = os.getenv("REDIS_GROUP", "ai-consumers")

        default_consumer = f"mock-ai-{socket.gethostname()}-{os.getpid()}"
        self.consumer_id: str = os.getenv("REDIS_CONSUMER_ID", default_consumer)
        self.stream_key: str = os.getenv("REVIEW_ASSET_STREAM_KEY", "review.asset.generate")
        self.dead_stream: str = os.getenv("REVIEW_ASSET_DEAD_STREAM", "review.asset.dead")

        self.client: redis.Redis = redis.from_url(self.redis_url, decode_responses=True)

    async def ensure_consumer_group(self) -> None:
        try:
            await self.client.xgroup_create(self.stream_key, self.group, id="$", mkstream=True)
            self.logger.info(f"[MockConsumer] 컨슈머 그룹 생성: stream={self.stream_key}, group={self.group}")
        except redis.ResponseError as e:
            if "BUSYGROUP" not in str(e):
                raise
            self.logger.debug(f"[MockConsumer] 컨슈머 그룹 이미 존재")

    @staticmethod
    def _deserialize_fields(fields: Dict[str, str]) -> Dict[str, Any]:
        if "payload" in fields:
            data = json.loads(fields["payload"])
        else:
            data = dict(fields)

        # menu, referenceImages가 문자열로 들어오면 JSON decode 시도
        if isinstance(data.get("menu"), str):
            try:
                data["menu"] = json.loads(data["menu"])
            except Exception:
                pass

        if isinstance(data.get("referenceImages"), str):
            try:
                data["referenceImages"] = json.loads(data["referenceImages"])
            except Exception:
                pass

        return data

    @classmethod
    def parse_message(cls, fields: Dict[str, str]) -> GenerateRequest:
        data = cls._deserialize_fields(fields)
        return GenerateRequest.model_validate(data)

    async def handle_message(self, message_id: str, fields: Dict[str, str]) -> None:
        start_time = time.time()

        try:
            req = self.parse_message(fields)
            self.logger.info(f"[MockConsumer] 메시지 수신: id={message_id}, reviewAssetId={req.reviewAssetId}")

            # --- AI 처리 시뮬레이션 (90초 대기) ---
            await asyncio.sleep(90)

            # 성공/실패 9:1 확률
            if random.random() < 0.1:
                result, url = "FAIL", None
            else:
                result, url = "SUCCESS", f"https://i.imgur.com/VrTNlTl.png"

            # Callback 전송
            await review_generate_callback.send_callback_to_spring({
                "reviewAssetId": req.reviewAssetId,
                "result": result,
                "assetUrl": url,
                "type": req.type,
            })

            # 메시지 ACK
            await self.client.xack(self.stream_key, self.group, message_id)

            # 지표 기록
            elapsed = time.time() - start_time
            MESSAGES_PROCESSED.labels(stream=self.stream_key).inc()
            MESSAGE_LATENCY.labels(stream=self.stream_key).observe(elapsed)

            self.logger.info(f"[MockConsumer] 메시지 처리 완료: id={message_id}, result={result}, url={url}")

        except Exception as e:
            self.logger.exception(f"[MockConsumer] 메시지 처리 중 오류: {e}")
            await self.client.xack(self.stream_key, self.group, message_id)
            payload = json.dumps({"error": str(e), "fields": fields})
            await self.client.xadd(self.dead_stream, {"payload": payload})

            # 지표 기록
            MESSAGES_FAILED.labels(stream=self.stream_key).inc()
            MESSAGES_DLQ.labels(stream=self.dead_stream).inc()

    async def run_forever(self) -> None:
        self.logger.info(f"[MockConsumer] 시작: url={self.redis_url}, group={self.group}, consumer={self.consumer_id}, stream={self.stream_key}")

        # 컨슈머 그룹 보장
        await self.ensure_consumer_group()

        while True:
            try:
                result = await self.client.xreadgroup(
                    groupname=self.group,
                    consumername=self.consumer_id,
                    streams={self.stream_key: ">"},
                    count=5,
                    block=5000,
                )
                if not result:
                    continue

                for _, messages in result:
                    for message_id, fields in messages:
                        # 메시지를 병렬로 처리
                        asyncio.create_task(self.handle_message(message_id, fields))

            except Exception as loop_err:
                self.logger.exception(f"[MockConsumer] 루프 오류: {loop_err}")
                await asyncio.sleep(2)


# === 엔트리포인트 ===
async def main() -> None:
    consumer = MockReviewGenerateConsumer()
    await consumer.run_forever()
    