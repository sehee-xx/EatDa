// src/screens/Register/RegisterScreen.tsx
import React from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../navigation/AuthNavigator";
import EaterRegisterScreen from "./EaterRegisterScreen";
import MakerRegisterScreen from "./MakerRegisterScreen";

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "RegisterScreen"
>;

// Props를 optional로 변경
type Props = {
  role?: "eater" | "maker";
  onBack?: () => void;
  onComplete?: () => void;
};

export default function RegisterScreen(props?: Props) {
  const navigation = useNavigation<NavigationProp>();

  // 내장 네비게이션 함수들
  const handleBack = () => {
    navigation.goBack();
  };

  const handleComplete = () => {
    navigation.navigate("Login");
  };

  // props가 있으면 props 함수 사용, 없으면 내장 함수 사용
  const role = props?.role || "eater"; // 기본값은 eater
  const goBack = props?.onBack || handleBack;
  const complete = props?.onComplete || handleComplete;

  if (role === "eater") {
    return <EaterRegisterScreen onBack={goBack} onComplete={complete} />;
  }

  return <MakerRegisterScreen onBack={goBack} onComplete={complete} />;
}
