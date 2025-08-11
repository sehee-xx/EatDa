import * as FileSystem from "expo-file-system";

// 파일 이름으로 MIME 타입을 추측하는 함수
function guessMime(name: string) {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  return "application/octet-stream"; // 알 수 없는 경우 기본값
}

// 이미지를 업로드 가능한 형태로 변환하고 검사하는 함수
export async function normalizeImageForUpload(
  img: { uri: string; type?: string; name?: string },
  idx: number
) {
  let uri = img.uri;

  // 안드로이드의 content:// 경로를 실제 파일 경로인 file:// 로 복사
  if (uri.startsWith("content://")) {
    const dest = `${FileSystem.cacheDirectory}upload_${Date.now()}_${idx}.jpg`;
    await FileSystem.copyAsync({ from: uri, to: dest });
    uri = dest;
  }

  // 파일이 실제로 존재하고, 크기가 0이 아닌지 확인
  const info = await FileSystem.getInfoAsync(uri);
  if (!info.exists || (info.size ?? 0) === 0) {
    throw new Error(`업로드 파일이 없거나 비어있습니다: ${uri}`);
  }

  // 파일 이름과 타입을 최종적으로 결정
  const name = img.name || `image_${idx + 1}.jpg`;
  const type = img.type && img.type.includes("/") ? img.type : guessMime(name);

  return { uri, name, type };
}
