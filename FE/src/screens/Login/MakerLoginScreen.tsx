// src/screens/Login/MakerLoginScreen.tsx
import React from "react";
import AuthForm, { AuthField } from "../../components/AuthForm";

const loginFields: AuthField[] = [
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
];

const linkItems = ["아이디 찾기", "비밀번호 찾기", "회원가입"];

type Props = {
  onNavigateToRegister?: () => void;
};

export default function MakerLoginScreen({ onNavigateToRegister }: Props) {
  const handleLinkPress = (item: string) => {
    console.log(`${item} 클릭됨`);
    if (item === "회원가입" && onNavigateToRegister) {
      onNavigateToRegister();
    } else if (item === "아이디 찾기") {
      // 아이디 찾기 로직
      console.log("아이디 찾기 화면으로 이동");
    } else if (item === "비밀번호 찾기") {
      // 비밀번호 찾기 로직
      console.log("비밀번호 찾기 화면으로 이동");
    }
  };

  const handleLogin = () => {
    console.log("사장님 로그인 처리");
    // 로그인 로직 구현
  };

  return (
    <AuthForm
      role="maker"
      fields={loginFields}
      onSubmit={handleLogin}
      submitButtonText="로그인"
      linkItems={linkItems}
      onLinkPress={handleLinkPress}
      showLinks={true}
    />
  );
}
