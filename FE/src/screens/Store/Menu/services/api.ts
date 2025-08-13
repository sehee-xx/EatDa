import { getTokens } from "../../../Login/services/tokenStorage";
const BASE_URL = "https://i13a609.p.ssafy.io/test";

export type StoreMenuItem = {
  menuId: number;
  name: string;
  price: number;
  imageUrl?: string;
};

export interface ApiResponse<T> {
  code: string;
  message: string;
  status: number;
  data: T;
  timestamp: string;
}

// 가게 메뉴 조회 API (로그 포함)
export async function getStoreMenu(storeId: number): Promise<StoreMenuItem[]> {
  const { accessToken } = await getTokens();
  if (!accessToken)
    throw new Error("인증 정보가 없습니다. 다시 로그인해주세요.");

  const url = `${BASE_URL}/api/menu/${encodeURIComponent(String(storeId))}`;

  // ── 요청 로그
  console.log(`[MENU][REQ] GET ${url}`);
  console.log(
    `[MENU][REQ] Authorization: Bearer ****(len=${accessToken.length})`
  );

  const started = Date.now();
  const res = await fetch(url, {
    method: "GET",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const ms = Date.now() - started;

  const status = res.status;
  const raw = await res.text();

  // JSON 파싱 (비JSON 대비)
  let json: ApiResponse<StoreMenuItem[]> | null = null;
  try {
    json = raw ? JSON.parse(raw) : null;
  } catch {
    // no-op
  }

  // ── 응답 로그
  if (json) {
    console.log(
      `[MENU][RES ${status}] (${ms}ms) → JSON:\n${JSON.stringify(
        json,
        null,
        2
      )}`
    );
  } else {
    const preview =
      typeof raw === "string" && raw.length > 1000
        ? raw.slice(0, 1000) + `… (truncated ${raw.length - 1000} chars)`
        : raw || "(empty)";
    console.log(`[MENU][RES ${status}] (${ms}ms) → non-JSON body:\n${preview}`);
  }

  if (!res.ok) {
    throw new Error((json && json.message) || raw || `HTTP ${status}`);
  }

  return json?.data ?? [];
}

// 메뉴 포스터 asset 생성 요청 API

// 메뉴 포스터 상태 조회 API

// 메뉴 포스터 생성 상태 조회 API

// 메뉴 포스터 최종 등록 API

// 메뉴 포스터 선물 API

// 선물 받은 메뉴 포스터 채택 API

// 채택한 메뉴 포스터 해제 API

// 채택한 메뉴 포스터 순서 변경 API
