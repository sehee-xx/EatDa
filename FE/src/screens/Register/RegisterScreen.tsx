// src/screens/Register/RegisterScreen.tsx
import React from "react";
import EaterRegisterScreen from "./EaterRegisterScreen";
import MakerRegisterScreen from "./MakerRegisterScreen";

type Props = {
  role: "eater" | "maker";
  onBack: () => void;
  onComplete: () => void;
};

export default function RegisterScreen({ role, onBack, onComplete }: Props) {
  if (role === "eater") {
    return <EaterRegisterScreen onBack={onBack} onComplete={onComplete} />;
  }

  return <MakerRegisterScreen onBack={onBack} onComplete={onComplete} />;
}
