// src/components/Hamburger.tsx

import React, { useState } from "react";
import {
  Animated,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Text,
  Modal,
} from "react-native";

//

// 사이드바에 사용될 숟가락, 포크 이미지
import Sidebar from "./Sidebar";

export interface Props {
  userRole: "eater" | "maker";
  onLogout: () => void;
  activePage: string;
  onMypage?: () => void;
  onReview?: () => void;
}

export default function HamburgerButton({
  userRole,
  onLogout,
  activePage,
  onMypage,
  onReview,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // 사이드바 열고 닫기 관리
    <>
      <TouchableOpacity onPress={() => setIsOpen(true)}>
        <Text style={styles.icon}>☰</Text>
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="none">
        <Sidebar
          isOpen={true}
          onClose={() => setIsOpen(false)}
          userRole={userRole}
          onLogout={onLogout}
          onMypage={onMypage || (() => {})}
          onReview={onReview || (() => {})}
          activePage={activePage}
        />
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  icon: {
    fontSize: 18,
    paddingHorizontal: 20,
    paddingTop: 4,
    marginTop: 3,
  },
});
