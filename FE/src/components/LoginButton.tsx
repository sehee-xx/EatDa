// src/components/LoginButton.tsx
import React from "react";
import {
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Shadow } from "react-native-shadow-2";

interface Props {
  title: string;
  onPress: () => void;
  role?: "eater" | "maker";
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: any;
  iconStyle?: any;
}

export default function LoginButton({
  title,
  onPress,
  role = "eater",
  style,
  textStyle,
  icon,
  iconStyle,
}: Props) {
  const backgroundColor = role === "maker" ? "#38CCA2" : "#53A3DA";

  return (
    <Shadow
      offset={[0, 2]}
      distance={4}
      startColor="rgba(0,0,0,0.1)"
      style={styles.shadowContainer}
    >
      <TouchableOpacity
        style={[styles.button, { backgroundColor }, style]}
        onPress={onPress}
      >
        {icon && <Image source={icon} style={[styles.icon, iconStyle]} />}
        <Text style={[styles.text, textStyle]}>{title}</Text>
      </TouchableOpacity>
    </Shadow>
  );
}

const styles = StyleSheet.create({
  shadowContainer: {
    width: "100%",
    borderRadius: 8,
    paddingBottom: 3,
    overflow: "visible",
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: 38,
    borderRadius: 8,
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 12,
    textAlign: "center", // 가로 중앙 정렬
    textAlignVertical: "center", // Android용 세로 정렬
    includeFontPadding: false, // Android 폰트 패딩 제거
    lineHeight: 16, // 명시적 line height 설정
  },
});
