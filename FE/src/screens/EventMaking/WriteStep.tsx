import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  useWindowDimensions,
  Image, 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import CompleteModal from "./CompleteModal";

interface WriteProps {
  isGenerating: boolean;
  aiDone: boolean;
  text: string;
  onChange: (t: string) => void;
  onNext: () => void;
  onBack: () => void;
  onClose: () => void;
  generatedImageUrl: string | null; // AI가 생성한 이미지 URL
}

export default function WriteStep({
  isGenerating,
  aiDone,
  text,
  onChange,
  onNext,
  onBack,
  onClose,
  generatedImageUrl,
}: WriteProps) {
  const { width } = useWindowDimensions();
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  // AI 생성 완료 & 텍스트 리뷰 작성 완료 체크
  const canComplete = aiDone && text.trim().length > 0;

  const handleComplete = () => {
    if (canComplete) {
      setShowCompleteModal(true);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={width * 0.06} color="#333" />
        </TouchableOpacity>
        <Text style={styles.title}>햄찌네 피자</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={width * 0.06} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* AI 생성 상태 섹션 */}
        <View style={styles.aiSection}>
          <Text style={styles.sectionTitle}>AI 포스터 생성</Text>

          {isGenerating && (
            <View style={styles.loadingContainer}>
              <LottieView
                source={require("../../../assets/AI-loading.json")}
                autoPlay
                loop
                style={styles.lottie}
              />
              <Text style={styles.loadingText}>
                AI 포스터를 생성중입니다...
              </Text>
              <Text style={styles.loadingSubText}>
                약간의 시간이 소요됩니다
              </Text>
            </View>
          )}

          {/* 생성 완료 후 완성된 이미지 보여주기 */}
          {aiDone && generatedImageUrl && (
            <View style={styles.aiCompleteContainer}>
              <Image
                source={{ uri: generatedImageUrl }}
                style={styles.generatedImage}
              />
              <Text style={styles.aiCompleteText}>
                AI 포스터 생성이 완료되었습니다!
              </Text>
              <Text style={styles.aiCompleteSubText}>
                아래에 이벤트 설명을 작성해주세요
              </Text>
            </View>
          )}
        </View>

        {/* 텍스트 리뷰 작성 섹션 */}
        <View style={styles.textSection}>
          <Text style={styles.sectionTitle}>이벤트 설명 작성</Text>
          <TextInput
            style={styles.textInput}
            multiline
            placeholder={`현재 진행하는 이벤트에 대해서 자유롭게 설명해주세요`}
            placeholderTextColor="#999999"
            textAlignVertical="top"
            value={text}
            onChangeText={onChange}
            maxLength={500}
          />
          <View style={styles.textCounter}>
            <Text style={styles.counterText}>{text.length}/500</Text>
          </View>
        </View>
      </ScrollView>

      {/* 하단 완료 버튼 */}
      <View style={styles.bottom}>
        <TouchableOpacity
          style={[
            styles.completeButton,
            !canComplete && styles.completeButtonDisabled,
          ]}
          onPress={handleComplete}
          disabled={!canComplete}
          activeOpacity={canComplete ? 0.7 : 1}
        >
          <Text style={styles.completeButtonText}>
            {!aiDone
              ? "AI 포스터 생성 중..."
              : !text.trim()
              ? "이벤트 설명을 작성해주세요"
              : "완료"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 완료 모달 */}
      <CompleteModal
        visible={showCompleteModal}
        onClose={() => setShowCompleteModal(false)}
        generatedContent={generatedImageUrl} // 모달에 실제 이미지 URL 전달
        onCancel={() => {
          setShowCompleteModal(false);
          onBack();
        }}
        onConfirm={() => {
          setShowCompleteModal(false);
          onNext();
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingTop: 60,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    backgroundColor: "#F7F8F9",
  },
  aiSection: {
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 20, // 간격 추가
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  lottie: {
    width: 150, // 크기 살짝 줄임
    height: 150,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  loadingSubText: {
    fontSize: 14,
    color: "#666666",
  },
  aiCompleteContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  // ✨ 추가: 생성된 이미지를 보여줄 스타일, 보면서 수정해야...
  generatedImage: {
    width: "100%",
    height: 300, // 이미지 높이 조절
    borderRadius: 12,
    marginBottom: 24,
    backgroundColor: "#F0F0F0",
  },
  aiCompleteText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  aiCompleteSubText: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
  },
  textSection: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 24,
    marginBottom: 100,
  },
  textInput: {
    minHeight: 150, // 높이 조절
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 12,
    padding: 16,
    backgroundColor: "#fff",
    color: "#333",
    fontSize: 14, // 폰트 크기 키움
    lineHeight: 22,
    textAlignVertical: "top",
  },
  textCounter: {
    alignItems: "flex-end",
    marginTop: 8,
  },
  counterText: {
    fontSize: 12,
    color: "#999999",
  },
  bottom: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 34,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  completeButton: {
    backgroundColor: "#fec566",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    shadowColor: "#fec566",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  completeButtonDisabled: {
    backgroundColor: "#D1D5DB",
    shadowOpacity: 0,
    elevation: 0,
  },
  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
