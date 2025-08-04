// src/screens/Mypage/MypageScreen.tsx
import React from "react";
import EaterMypage from "./EaterMypage";
import MakerMypage from "./MakerMypage";

interface MypageScreenProps {
  userRole?: "eater" | "maker";
  onLogout: () => void;
}

export default function MypageScreen({ userRole = "eater", onLogout }: MypageScreenProps) {
  // LoginScreen처럼 조건부 렌더링
  if (userRole === "eater") {
    return <EaterMypage onLogout={onLogout} />;
  } else {
    return <MakerMypage onLogout={onLogout} />;
  }
} 