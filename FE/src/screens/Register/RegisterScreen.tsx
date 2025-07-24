// src/screens/Register/RegisterScreen.tsx
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import StepIndicator from "../../components/StepIndicator";
import AuthForm, { AuthField } from "../../components/AuthForm";
import { COLORS, textStyles } from "../../constants/theme";

type Props = {
  role: "eater" | "maker";
  onBack: () => void;
  onComplete: () => void;
};

// 냠냠이 회원가입 필드
const eaterFields: AuthField[] = [
  {
    key: "nickname",
    label: "닉네임",
    placeholder: "닉네임을 입력해주세요",
  },
  {
    key: "email",
    label: "이메일",
    placeholder: "이메일을 입력해주세요",
    keyboardType: "email-address",
  },
  {
    key: "password",
    label: "비밀번호",
    placeholder: "비밀번호를 입력해주세요",
    secureTextEntry: true,
  },
  {
    key: "passwordConfirm",
    label: "비밀번호 확인",
    placeholder: "비밀번호를 다시 입력해주세요",
    secureTextEntry: true,
  },
];

// 사장님 1단계 필드
const makerStep1Fields: AuthField[] = [
  {
    key: "email",
    label: "이메일",
    placeholder: "이메일을 입력해주세요",
    keyboardType: "email-address",
  },
  {
    key: "password",
    label: "비밀번호",
    placeholder: "비밀번호를 입력해주세요",
    secureTextEntry: true,
  },
  {
    key: "passwordConfirm",
    label: "비밀번호 확인",
    placeholder: "비밀번호를 다시 입력해주세요",
    secureTextEntry: true,
  },
];

// 사장님 2단계 필드
const makerStep2Fields: AuthField[] = [
  {
    key: "storeName",
    label: "가게 이름",
    placeholder: "가게 이름을 입력해주세요",
  },
  {
    key: "storeLocation",
    label: "가게 위치",
    placeholder: "가게 위치를 입력해주세요",
  },
];

export default function RegisterScreen({ role, onBack, onComplete }: Props) {
  const { width, height } = useWindowDimensions();
  const [currentStep, setCurrentStep] = useState(1);

  const isEater = role === "eater";
  const totalSteps = isEater ? 1 : 3;
  const primaryColor = isEater ? COLORS.primaryEater : COLORS.primaryMaker;

  const getCurrentFields = () => {
    if (isEater) return eaterFields;
    if (currentStep === 1) return makerStep1Fields;
    if (currentStep === 2) return makerStep2Fields;
    return [];
  };

  const getCurrentTitle = () => {
    if (isEater) return "냠냠이 회원가입";
    if (currentStep === 1) return "기본 정보";
    if (currentStep === 2) return "가게 정보";
    if (currentStep === 3) return "사업자 등록";
    return "";
  };

  const getButtonText = () => {
    if (isEater) return "가입하기";
    if (currentStep < totalSteps) return "다음 단계";
    return "가입하기";
  };

  const handleSubmit = () => {
    if (isEater || currentStep === totalSteps) {
      onComplete();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      onBack();
    }
  };

  const renderStep3Content = () => (
    <View style={styles.step3Container}>
      <Text style={[styles.step3Title, { fontSize: width * 0.05 }]}>
        사업자 등록증을 첨부해주세요
      </Text>
      <Text style={[styles.step3Subtitle, { fontSize: width * 0.035 }]}>
        사업자 등록증 이미지를 업로드하시면{"\n"}빠른 심사 후 승인해드립니다
      </Text>

      <TouchableOpacity
        style={[
          styles.uploadArea,
          { height: height * 0.2, marginBottom: height * 0.03 },
        ]}
      >
        <Text style={styles.uploadIcon}>📄</Text>
        <Text style={[styles.uploadText, { fontSize: width * 0.04 }]}>
          파일을 선택하거나 여기에 드롭하세요
        </Text>
        <Text style={[styles.uploadSubtext, { fontSize: width * 0.03 }]}>
          JPG, PNG 파일만 업로드 가능합니다
        </Text>
      </TouchableOpacity>

      {/* 가입하기 버튼 */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          {
            backgroundColor: primaryColor,
            height: height * 0.055,
          },
        ]}
        onPress={handleSubmit}
      >
        <Text style={[styles.submitButtonText, { fontSize: width * 0.04 }]}>
          가입하기
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/white-background.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.content}>
          {/* 헤더 */}
          <View style={[styles.header, { paddingTop: height * 0.02 }]}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Text style={[styles.backArrow, { fontSize: width * 0.06 }]}>
                ←
              </Text>
            </TouchableOpacity>
            <Text style={[textStyles.logo, { fontSize: width * 0.06 }]}>
              Create{" "}
              <Text style={{ color: primaryColor }}>{isEater ? "E" : "M"}</Text>
              at
              <Text
                style={{
                  color: isEater ? COLORS.primaryMaker : COLORS.primaryEater,
                }}
              >
                {isEater ? "D" : "er"}
              </Text>
              a!
            </Text>
            <View style={styles.placeholder} />
          </View>

          {/* 단계 표시기 (사장님만) */}
          {!isEater && (
            <StepIndicator
              currentStep={currentStep}
              totalSteps={totalSteps}
              activeColor={primaryColor}
            />
          )}

          {/* 타이틀 */}
          <Text
            style={[
              styles.title,
              { fontSize: width * 0.05, color: primaryColor },
            ]}
          >
            {getCurrentTitle()}
          </Text>

          {/* 콘텐츠 */}
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
          >
            {currentStep === 3 ? (
              renderStep3Content()
            ) : (
              <AuthForm
                role={role}
                fields={getCurrentFields()}
                onSubmit={handleSubmit}
                submitButtonText={getButtonText()}
                showLinks={false}
              />
            )}
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
  },
  backButton: {
    padding: 5,
  },
  backArrow: {
    color: COLORS.text,
    fontWeight: "bold",
  },
  placeholder: {
    width: 30,
  },
  title: {
    textAlign: "center",
    fontWeight: "700",
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  step3Container: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  step3Title: {
    fontWeight: "700",
    color: COLORS.text,
    textAlign: "center",
    marginBottom: 10,
  },
  step3Subtitle: {
    color: COLORS.inactive,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30,
  },
  uploadArea: {
    borderWidth: 2,
    borderColor: COLORS.inactive + "50",
    borderStyle: "dashed",
    borderRadius: 12,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 10,
  },
  uploadText: {
    color: COLORS.text,
    fontWeight: "600",
    marginBottom: 5,
  },
  uploadSubtext: {
    color: COLORS.inactive,
  },
  submitButton: {
    width: "100%",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
});
