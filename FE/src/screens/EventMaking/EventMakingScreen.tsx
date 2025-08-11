import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Alert,
  Modal,
  View,
  ActivityIndicator,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import GenerateStep from "./GenerateStep";
import WriteStep from "./WriteStep";

// API
import { requestEventAsset } from "./services/api";

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

  // 로딩상태, 완료 후 ID저장값
  const [isLoading, setIsLoading] = useState(false);
  const [eventAssetId, setEventAssetId] = useState<number | null>(null);

  // AI 생성 관련 state들 (WriteStep으로 전달)
  const [genLoading, setGenLoading] = useState(false);
  const [aiOk, setAiOk] = useState(false);
  const [text, setText] = useState("");

  // 화면 닫기 핸들러
  const handleClose = () => {
    navigation.goBack();
  };

  // 이벤트 asset 생성 요청
  const handleGenerateRequest = async () => {
    // 유효성 검사
    if (!startDate || !endDate) {
      Alert.alert("오류", "이벤트 기간을 설정해주세요.");
      return;
    }

    setIsLoading(true); // API 요청 시작 -> 로딩 UI 표시

    try {
      // API에 보낼 데이터 
      const eventRequestData = {
        storeId: 1, // 임시 storeId값
        title: eventName,
        type: "IMAGE",
        startDate: startDate,
        endDate: endDate,
        prompt: prompt,
        images: imgs.map((uri) => {
          const filename = uri.split("/").pop() || "image.jpg";
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : `image`;
          return { uri, type, name: filename };
        }),
      };

      // API 호출
      const result = await requestEventAsset(eventRequestData);

      // 성공 시, 받은 ID를 state에 저장
      setEventAssetId(result.eventAssetId);

      // API 요청이 성공했으니, 다음 단계인 'WriteStep'으로 이동
      setStep("write");

      // AI 생성 시뮬레이션 시작
      setGenLoading(true);
      setAiOk(false);
      setTimeout(() => {
        setAiOk(true);
        setGenLoading(false);
      }, 5000);
    } catch (error: any) {
      Alert.alert("오류", error.message || "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoading(false); // API 요청 종료 -> 로딩 UI 숨김
    }
  };

  // WriteStep에서 "완료" 후 이벤트 페이지로 이동하는 함수
  const handleWriteComplete = () => {
    console.log("이벤트 포스터 생성 완료 - 이벤트 페이지로 이동");
    navigation.navigate("ActiveEventScreen");
  };

  // 이미지 추가/제거, 날짜 선택 함수
  const handleAddImage = (imageUrl: string) => {
    setImgs((prev) => [...prev, imageUrl]);
  };
  const handleRemoveImage = (index: number) => {
    setImgs((prev) => prev.filter((_, idx) => idx !== index));
  };
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
          onNext={handleGenerateRequest} // API 호출 함수 연결
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
            setGenLoading(false);
            setAiOk(false);
            setStep("gen");
          }}
          onClose={handleClose}
        />
      )}

      {/* API 요청 중일 때 보여줄 전체 화면 로딩 모달 */}
      <Modal visible={isLoading} transparent={true} animationType="fade">
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fec566" />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});
