// src/components/LoginForm.tsx

import React from "react";
import { View, Text, useWindowDimensions, StyleSheet } from "react-native";
import CustomInput from "./CustomInput";
import LoginButton from "./LoginButton";
import { SPACING, COLORS } from "../constants/theme";

type Props = {
  role: "eater" | "maker";
  onLogin: () => void;
  children?: React.ReactNode;
};

export default function LoginForm({ role, onLogin, children }: Props) {
  const { width, height } = useWindowDimensions();
  const btnHeight = height * 0.065;

  return (
    <View style={[styles.box, { paddingHorizontal: width * 0.05 }]}>
      {/* 이메일 / 비밀번호 */}
      <Text style={{ marginBottom: height * 0.015, fontSize: width * 0.035 }}>
        이메일
      </Text>
      <CustomInput
        placeholder="이메일을 입력해주세요"
        style={{
          height: btnHeight,
          paddingHorizontal: width * 0.04,
          marginBottom: height * 0.02,
        }}
        keyboardType="email-address"
      />

      <Text style={{ marginBottom: height * 0.015, fontSize: width * 0.035 }}>
        비밀번호
      </Text>
      <CustomInput
        placeholder="비밀번호를 입력해주세요"
        secureTextEntry
        style={{
          height: btnHeight,
          paddingHorizontal: width * 0.04,
          marginBottom: height * 0.02,
        }}
      />

      {/* 링크 */}
      <View style={styles.linkRow}>
        {["아이디 찾기", "비밀번호 찾기", "회원가입"].map((txt, i) => (
          <React.Fragment key={txt}>
            {i > 0 && <Text style={styles.sep}>|</Text>}
            <Text style={styles.link}>{txt}</Text>
          </React.Fragment>
        ))}
      </View>

      {/* 메인 로그인 버튼 */}
      <LoginButton
        title="로그인"
        role={role}
        onPress={onLogin}
        style={{
          height: btnHeight,
          borderRadius: width * 0.02,
          marginBottom: height * 0.025,
        }}
        textStyle={{ fontSize: width * 0.04 }}
      />

      {/* 소셜 로그인 버튼들 */}
      <View style={[styles.socialRow]}>
        {React.Children.toArray(children).map((child, idx, arr) => (
          <View
            key={idx}
            style={[
              styles.socialCell,
              { marginRight: idx === arr.length - 1 ? 0 : width * 0.02 },
            ]}
          >
            {child}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    width: "100%",
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: SPACING.md,
  },
  sep: {
    marginHorizontal: SPACING.sm,
    color: COLORS.inactive,
  },
  link: {
    fontSize: 12,
    color: COLORS.inactive,
  },
  socialRow: {
    flexDirection: "row",
  },
  socialCell: {
    flex: 1,
  },
});
