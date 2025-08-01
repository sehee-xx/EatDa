package com.global.redis.publisher;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StreamOperations;

class RedisStreamPublisherTest {

    @Test
    void 정상적으로_스트림에_발행된다() {
        RedisTemplate<String, Object> redisTemplate = mock(RedisTemplate.class);
        ObjectMapper objectMapper = new ObjectMapper();

        StreamOperations<String, Object, Object> streamOps = mock(StreamOperations.class);
        when(redisTemplate.opsForStream()).thenReturn(streamOps);

        DummyPublisher publisher = new DummyPublisher(redisTemplate, objectMapper);
        DummyPayload payload = new DummyPayload("abc", 123);

        publisher.publish("test-stream", payload);

        verify(streamOps).add(eq("test-stream"), any(Map.class));
    }

    @Test
    void 직렬화_실패시_RuntimeException_발생한다() {
        RedisTemplate<String, Object> redisTemplate = mock(RedisTemplate.class);
        ObjectMapper objectMapper = mock(ObjectMapper.class);

        DummyPublisher publisher = new DummyPublisher(redisTemplate, objectMapper);
        DummyPayload payload = new DummyPayload("bad", 0);

        when(objectMapper.convertValue(any(), any(TypeReference.class)))
                .thenThrow(new IllegalArgumentException("fail"));

        assertThrows(RuntimeException.class, () -> publisher.publish("test", payload));
    }

    record DummyPayload(String name, int value) {
    }

    static class DummyPublisher extends RedisStreamPublisher<DummyPayload> {
        DummyPublisher(RedisTemplate<String, Object> redisTemplate, ObjectMapper objectMapper) {
            super(redisTemplate, objectMapper);
        }

        void publish(String key, DummyPayload payload) {
            publishToStream(key, payload);
        }
    }
}
