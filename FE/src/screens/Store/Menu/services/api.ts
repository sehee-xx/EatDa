// src/screens/Store/Menu/services/api.ts

import { getTokens } from "../../../Login/services/tokenStorage";
const BASE_URL = "https://i13a609.p.ssafy.io/test";

export type StoreMenuItem = {
  name: string;
  price: number;
  description?: string;
  imageUrl?: string;
};

export interface ApiResponse<T> {
  code: string;
  message: string;
  status: number;
  data: T;
  timestamp: string;
}

// 가게 메뉴 조회 API
export async function getStoreMenu(storeId: number): Promise<StoreMenuItem[]> {
  const { accessToken } = await getTokens();
  if (!accessToken) throw new Error("인증이 필요합니다.");

  const url = `${BASE_URL}/api/menu/${encodeURIComponent(String(storeId))}`;

  const started = Date.now();
  console.log(`[MENU][REQ] GET ${url}`);

  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  const elapsed = Date.now() - started;
  const raw = await res.text();
  console.log(
    `[MENU][RES] ${res.status} (${elapsed}ms) raw: ${raw.slice(0, 300)}${
      raw.length > 300 ? "..." : ""
    }`
  );

  let json: ApiResponse<StoreMenuItem[]> | null = null;
  try {
    json = raw ? (JSON.parse(raw) as ApiResponse<StoreMenuItem[]>) : null;
  } catch {
    // 서버가 JSON이 아니면 그대로 처리 (명세 우선)
  }

  if (!res.ok) {
    // 명세서: 401 인증 실패
    if (res.status === 401) {
      throw new Error(json?.message || "인증이 필요합니다.");
    }
    // 나머지는 서버가 내려준 메시지 그대로(500 포함)
    throw new Error(json?.message || `HTTP ${res.status}`);
  }

  if (!json || !Array.isArray(json.data)) {
    throw new Error("응답 형식이 올바르지 않습니다.");
  }

  return json.data;
}

// 메뉴 포스터 asset 생성 요청 API

// 메뉴 포스터 상태 조회 API

// 메뉴 포스터 생성 상태 조회 API

// 메뉴 포스터 최종 등록 API

// 메뉴 포스터 선물 API

// 선물 받은 메뉴 포스터 채택 API

// 채택한 메뉴 포스터 해제 API

// 채택한 메뉴 포스터 순서 변경 API
