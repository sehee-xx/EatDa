// src/components/CustomInput.tsx
import React from "react";
import { TextInput, StyleSheet, TextInputProps } from "react-native";
import { Shadow } from "react-native-shadow-2";

interface Props extends TextInputProps {
  style?: any;
}

export default function CustomInput({ style, ...props }: Props) {
  return (
    <Shadow
      offset={[0, 2]}
      distance={4}
      startColor="rgba(0,0,0,0.1)"
      style={styles.shadowContainer}
    >
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor="#aaa"
        {...props}
      />
    </Shadow>
  );
}

const styles = StyleSheet.create({
  shadowContainer: {
    width: "100%",
    borderRadius: 8,
    paddingBottom: 3, // 4에서 3으로 줄임
    overflow: "visible",
  },
  input: {
    width: "100%",
    height: 38, // 42에서 38로 줄임
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    fontSize: 14, // 폰트 크기 명시
  },
});
