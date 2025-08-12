import React, { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../../navigation/AuthNavigator"; // 경로 수정 필요
import OCRStep from "./OCRStep";
import MenuSelectStep from "./MenuSelectStep";
import GenerateStep from "./GenerateStep";
import WriteStep from "./WriteStep";

// GenerateStep과 동일한 타입으로 맞춤
type ContentType = "image" | "shorts_ray2" | "shorts_gen4" | null;
type Step = "ocr" | "menu" | "gen" | "write";

// Navigation Props 타입 정의
type Props = NativeStackScreenProps<AuthStackParamList, "ReviewWriteScreen">;

export default function ReviewWriteScreen({ navigation }: Props) {
  const [step, setStep] = useState<Step>("ocr");
  const [selected, setSelected] = useState<string[]>([]);
  const [type, setType] = useState<ContentType>(null);
  const [imgs, setImgs] = useState<string[]>([]);
  const [prompt, setPrompt] = useState("");
  const [genLoading, setGenLoading] = useState(false);
  const [aiOk, setAiOk] = useState(false);
  const [text, setText] = useState("");
  
  // 영수증 이미지 URI 저장
  const [receiptImageUri, setReceiptImageUri] = useState<string>("");

  // 화면 닫기 핸들러
  const handleClose = () => {
    navigation.goBack();
  };

  // OCR 성공 핸들러 - 다음 단계로 이동
  const handleOCRSuccess = (imageUri: string) => {
    console.log("영수증 인증 완료:", imageUri);
    setReceiptImageUri(imageUri); // 영수증 이미지 저장
    setStep("menu"); // 메뉴 선택 단계로 이동
  };

  // OCR 실패 핸들러
  const handleOCRFailure = () => {
    console.log("영수증 인증 실패");
    // 실패 시 특별한 처리가 필요하면 여기에 추가
  };

  const nextGen = () => {
    setGenLoading(true); // AI 생성 시작
    setAiOk(false); // 초기화
    setStep("write"); // WriteStep으로 이동

    // 3초 후 AI 생성 완료 시뮬레이션
    setTimeout(() => {
      setAiOk(true); // AI 생성 완료
      setGenLoading(false); // 로딩 종료
    }, 3000);
  };

  // WriteStep에서 완료 후 리뷰 페이지로 이동하는 핸들러
  const handleWriteComplete = () => {
    console.log("리뷰 작성 완료 - 리뷰 페이지로 이동");

    try {
      // ReviewTabScreen으로 이동 (AuthStackParamList에 있는 화면으로)
      navigation.navigate("ReviewTabScreen");
    } catch (error) {
      console.error("네비게이션 오류:", error);
      // 실패시 이전 화면으로 돌아가기
      navigation.goBack();
    }
  };

  const nextMenu = () => {
    if (selected.length) setStep("gen");
  };

  // 각 단계별 뒤로가기 핸들러
  const handleOCRBack = () => {
    navigation.goBack(); // 화면 닫기
  };

  const handleMenuBack = () => {
    setStep("ocr"); // OCR 단계로 돌아가기
  };

  const handleGenBack = () => {
    setStep("menu"); // 메뉴 선택 단계로 돌아가기
  };

  const handleWriteBack = () => {
    // WriteStep에서 뒤로가기 시 AI 상태 초기화
    setGenLoading(false);
    setAiOk(false);
    setStep("gen"); // 생성 단계로 돌아가기
  };

  // 이미지 추가 함수
  const handleAddImage = (imageUrl: string) => {
    setImgs((prev) => [...prev, imageUrl]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {step === "ocr" && (
        <OCRStep
          onSuccess={handleOCRSuccess} // 수정: 다음 단계로 이동
          onFailure={handleOCRFailure}
          onBack={handleOCRBack}
        />
      )}

      {step === "menu" && (
        <MenuSelectStep
          selected={selected}
          onToggle={(id) =>
            setSelected((p) =>
              p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
            )
          }
          onBack={handleMenuBack}
          onNext={nextMenu}
        />
      )}

      {step === "gen" && (
        <GenerateStep
          contentType={type}
          uploadedImages={imgs}
          prompt={prompt}
          onType={setType}
          onAdd={handleAddImage}
          onRemove={(i) => setImgs((p) => p.filter((_, idx) => idx !== i))}
          onPrompt={setPrompt}
          onNext={nextGen}
          onBack={handleGenBack} // 수정: 명확한 핸들러 사용
        />
      )}

      {step === "write" && (
        <WriteStep
          isGenerating={genLoading} // AI 생성 중 상태
          aiDone={aiOk} // AI 생성 완료 상태
          text={text}
          onChange={setText}
          onNext={handleWriteComplete} // 리뷰 페이지로 직접 이동
          onBack={handleWriteBack} // 수정: 명확한 핸들러 사용
          onClose={handleClose}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
});