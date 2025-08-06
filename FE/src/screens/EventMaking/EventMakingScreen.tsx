import React, { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import GenerateStep from "./GenerateStep";
import WriteStep from "./WriteStep";

type Step = "gen" | "write";

type Props = NativeStackScreenProps<AuthStackParamList, "EventMakingScreen">;

export default function EventMakingScreen({ navigation }: Props) {
  const [step, setStep] = useState<Step>("gen");

  // 이벤트 관련 state들
  const [eventName, setEventName] = useState("");
  const [imgs, setImgs] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");

  // AI 생성 관련 state들
  const [genLoading, setGenLoading] = useState(false);
  const [aiOk, setAiOk] = useState(false);
  const [text, setText] = useState("");

  // 화면 닫기 핸들러
  const handleClose = () => {
    navigation.goBack();
  };

  // GenerateStep에서 WriteStep으로 이동
  const nextGen = () => {
    setGenLoading(true); // AI 생성 시작
    setAiOk(false); // 초기화
    setStep("write"); // WriteStep으로 이동

    // 5초 후 AI 생성 완료 시뮬레이션
    setTimeout(() => {
      setAiOk(true); // AI 생성 완료
      setGenLoading(false); // 로딩 종료
    }, 5000);
  };

  // WriteStep에서 완료 후 이벤트 페이지로 이동
  const handleWriteComplete = () => {
    console.log("이벤트 포스터 생성 완료 - 이벤트 페이지로 이동");

    try {
      // ActiveEventScreen으로 이동
      navigation.navigate("ActiveEventScreen");
    } catch (error) {
      console.error("네비게이션 오류:", error);
      navigation.goBack();
    }
  };

  const handleModalCancel = () => {
    console.log("다시 만들기 - 게시판으로 돌아가기");
    navigation.navigate("ActiveEventScreen");
  };

  const handleModalConfirm = () => {
    console.log("이벤트 포스터 업로드 완료");
    navigation.navigate("ActiveEventScreen");
  };

  // 이미지 추가 함수
  const handleAddImage = (imageUrl: string) => {
    setImgs((prev) => [...prev, imageUrl]);
  };

  // 이미지 제거 함수
  const handleRemoveImage = (index: number) => {
    setImgs((prev) => prev.filter((_, idx) => idx !== index));
  };

  // 날짜 선택 함수
  const handleDateSelect = (start: string | null, end: string | null) => {
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <SafeAreaView style={styles.container}>
      {step === "gen" && (
        <GenerateStep
          eventName={eventName}
          uploadedImages={imgs}
          startDate={startDate}
          endDate={endDate}
          prompt={prompt}
          onEventName={setEventName}
          onAdd={handleAddImage}
          onRemove={handleRemoveImage}
          onDateSelect={handleDateSelect}
          onPrompt={setPrompt}
          onNext={nextGen}
          onBack={() => navigation.goBack()}
        />
      )}

      {step === "write" && (
        <WriteStep
          isGenerating={genLoading}
          aiDone={aiOk}
          text={text}
          onChange={setText}
          onNext={handleWriteComplete}
          onBack={() => {
            // WriteStep에서 뒤로가기 시 AI 상태 초기화
            setGenLoading(false);
            setAiOk(false);
            setStep("gen");
          }}
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
