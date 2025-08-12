// src/screens/Review/services/api.ts
import * as FileSystem from "expo-file-system";

/* =========================
   서버 경로 설정
   ========================= */
const BASE_HOST = "https://i13a609.p.ssafy.io";
const BASE_PREFIX = "/test"; // 필요 없으면 "" 로!
const BASE_AI_URL = `${BASE_HOST}/ai/api`;

/* =========================================================
   1) 영수증 OCR 요청 (FastAPI)
   - POST /ai/api/reviews/ocr-verification
   - 필드명: file
   - 성공: { code:"RECEIPT_REQUESTED", assetId:number, ... }
   ========================================================= */
export const requestReceiptOCR = async (
  imageUri: string
): Promise<{ assetId: number }> => {
  const fd = new FormData();
  fd.append("file", {
    uri: imageUri,
    name: "receipt.jpg",
    type: "image/jpeg",
  } as any);

  const url = `${BASE_AI_URL}/reviews/ocr-verification`;
  console.log("[requestReceiptOCR] POST", url);

  const res = await fetch(url, { method: "POST", body: fd });
  const text = await res.text().catch(() => "");

  if (!res.ok) {
    console.log("[requestReceiptOCR] status:", res.status, "payload:", text);
    throw new Error(text || "영수증 OCR 요청 실패");
  }

  let json: any = {};
  try {
    json = JSON.parse(text || "{}");
  } catch {}

  const assetId =
    typeof json.assetId === "number"
      ? json.assetId
      : typeof json?.data?.assetId === "number"
      ? json.data.assetId
      : null;

  if (typeof assetId !== "number") {
    console.log("[requestReceiptOCR] unexpected response:", json);
    throw new Error("잘못된 영수증 OCR 응답 형식입니다.(assetId 누락)");
  }

  return { assetId };
};

/* =========================================================
   2) 영수증 OCR 결과 조회 (FastAPI 폴링)
   - GET /ai/api/reviews/ocr-verification/{assetId}/result
   - 코드: RECEIPT_PENDING | RECEIPT_SUCCESS | RECEIPT_FAILED
   ========================================================= */
export const getReceiptOCRResult = async (
  assetId: number
): Promise<{
  status: "PENDING" | "SUCCESS" | "FAILED";
}> => {
  const url = `${BASE_AI_URL}/reviews/ocr-verification/${assetId}/result`;
  const res = await fetch(url);
  const text = await res.text().catch(() => "");

  if (!res.ok) {
    console.log("[getReceiptOCRResult] status:", res.status, "payload:", text);
    throw new Error("영수증 OCR 결과 조회 실패");
  }

  let result: any = {};
  try {
    result = JSON.parse(text || "{}");
  } catch {}

  if (result.code === "RECEIPT_PENDING") {
    return { status: "PENDING" };
  }
  if (result.code === "RECEIPT_SUCCESS") {
    return { status: "SUCCESS" };
  }
  if (result.code === "RECEIPT_FAILED") {
    return { status: "FAILED" };
  }

  // result 필드로도 확인
  if (["PENDING", "SUCCESS", "FAIL"].includes(result?.result)) {
    return { 
      status: result.result === "FAIL" ? "FAILED" : result.result 
    };
  }

  return { status: "PENDING" };
};

/* =========================================================
   3) OCR 폴링 유틸리티 함수
   ========================================================= */
export const pollReceiptOCR = async (
  assetId: number,
  onProgress?: (attempt: number) => void
): Promise<"SUCCESS" | "FAILED"> => {
  let attempts = 0;
  const maxAttempts = 30; // 최대 30번 (30초)
  
  while (attempts < maxAttempts) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1초 대기
      attempts++;
      
      if (onProgress) {
        onProgress(attempts);
      }
      
      const result = await getReceiptOCRResult(assetId);
      
      if (result.status === "SUCCESS") {
        return "SUCCESS";
      } else if (result.status === "FAILED") {
        return "FAILED";
      }
      // PENDING인 경우 계속 반복
      
    } catch (error) {
      console.error("OCR polling error:", error);
      // 에러가 나도 계속 시도
    }
  }
  
  // 타임아웃
  throw new Error("영수증 처리 시간이 초과되었습니다");
};

/* =========================================================
   4) 영수증 OCR 원샷 함수 (요청 + 폴링)
   ========================================================= */
export const processReceiptOCR = async (
  imageUri: string,
  onProgress?: (attempt: number) => void
): Promise<"SUCCESS" | "FAILED"> => {
  try {
    console.log("[processReceiptOCR] Starting receipt OCR for:", imageUri);
    
    // 1. OCR 요청
    const { assetId } = await requestReceiptOCR(imageUri);
    console.log("[processReceiptOCR] OCR request successful, assetId:", assetId);
    
    // 2. 폴링 시작
    const result = await pollReceiptOCR(assetId, onProgress);
    console.log("[processReceiptOCR] OCR completed with result:", result);
    
    return result;
    
  } catch (error) {
    console.error("[processReceiptOCR] OCR processing error:", error);
    throw error;
  }
};