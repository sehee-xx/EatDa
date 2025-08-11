import { getTokens } from "../../Login/services/tokenStorage";
import { normalizeImageForUpload } from "../../../utils/normalizeImage";

const BASE_URL = "https://i13a609.p.ssafy.io/test";

// API에 보낼 데이터의 타입을 미리 정의합니다.
export interface EventAssetRequestData {
  storeId: number;
  title: string;
  startDate: string;
  endDate: string;
  prompt: string;
  type: string;
  images?: {
    uri: string;
    type: string;
    name: string;
  }[];
}

// 이벤트 생성을 요청하는 API 함수
export const requestEventAsset = async (data: EventAssetRequestData) => {
  const { accessToken } = await getTokens();
  if (!accessToken)
    throw new Error("인증 정보가 없습니다. 다시 로그인해주세요");

  const fd = new FormData();
  fd.append("storeId", String(data.storeId));
  fd.append("title", data.title);
  fd.append("type", "IMAGE"); // 타입은 IMAGE로 고정
  fd.append("startDate", data.startDate);
  fd.append("endDate", data.endDate);
  fd.append("prompt", data.prompt);

  // 이미지가 있는 경우, normalizeImage 함수로 처리한 뒤 FormData에 추가
  if (data.images && data.images.length > 0) {
    const normed = await Promise.all(
      data.images.map((img, i) => normalizeImageForUpload(img, i))
    );
    normed.forEach((img) => {
      fd.append("image", {
        uri: img.uri,
        type: img.type,
        name: img.name,
      } as any);
    });
  }

  // 서버로 보내기 직전의 데이터 내용을 확인하기 위한 로그
  console.log("🚀 API 요청 전송 직전 데이터 확인");
  console.log(JSON.stringify((fd as any)._parts, null, 2));

  // fetch를 사용하여 API 호출
  const res = await fetch(`${BASE_URL}/api/events/assets/request`, {
    method: "POST",
    headers: { Authorization: `Bearer ${accessToken}` },
    body: fd,
  });

  const status = res.status;
  const raw = await res.text(); // 응답을 텍스트로 먼저 받음
  let json: any = null;
  try {
    json = JSON.parse(raw); // 텍스트를 JSON으로 파싱 시도
  } catch {}

  // 응답이 성공(2xx)이 아닌 경우 에러 처리
  if (!res.ok) {
    console.error("EVENT ASSET ERROR", { status, raw });
    throw new Error(
      (json && (json.message || json.error)) || raw || `HTTP ${status}`
    );
  }

  // 성공 시 data 객체 반환
  return json?.data;
};

// 이벤트 asset 결과 조회 API
export const getEventAssetResult = async (eventAssetId: number) => {
  const { accessToken } = await getTokens();
  if (!accessToken)
    throw new Error("인증 정보가 없습니다. 다시 로그인해주세요");

  const res = await fetch(
    `${BASE_URL}/api/events/assets/${eventAssetId}/result`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  const status = res.status;
  const raw = await res.text();
  let json: any = null;
  try {
    json = JSON.parse(raw);
  } catch {}

  if (!res.ok) {
    console.error("GET ASSET RESULT ERROR", { status, raw });
    throw new Error(
      (json && (json.message || json.error)) || raw || `HTTP ${status}`
    );
  }

  return json;
};

// 사장님별 이벤트 조회 api
export const getMyEvents = async (lastEventId?: number) => {
  const { accessToken } = await getTokens();
  if (!accessToken)
    throw new Error("인증 정보가 없습니다. 다시 로그인해주세요");

  // lastEventId가 있으면 URL에 쿼리 파라미터로 추가
  const url = lastEventId
    ? `${BASE_URL}/api/events/my?lastEventId=${lastEventId}`
    : `${BASE_URL}/api/events/my`;

  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  const status = res.status;
  const raw = await res.text();
  let json: any = null;
  try {
    json = JSON.parse(raw);
  } catch {}

  if (!res.ok) {
    console.error("GET MY EVENTS ERROR", { status, raw });
    throw new Error(
      (json && (json.message || json.error)) || raw || `HTTP ${status}`
    );
  }

  // 성공 시, data 배열 반환
  return json?.data;
};
