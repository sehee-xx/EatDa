import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { SPACING } from "../constants/theme";

// 프로필 이미지 import
const EaterProfileIcon = require("../../assets/eater-profile.svg");
const MakerProfileIcon = require("../../assets/maker-profile.svg");

interface MypageProfileProps {
  userRole: "eater" | "maker";
  nickname: string; // 사용자 닉네임
}

export default function MypageProfile({ userRole, nickname }: MypageProfileProps) {
  const profileIcon = userRole === "eater" ? EaterProfileIcon : MakerProfileIcon;
  const userTypeText = userRole === "eater" ? "Eater" : "Maker";

  return (
    <View style={styles.profileInfo}>
      {/* 흰색 동그란 배경 + 프로필 아이콘 */}
      <View style={styles.profileImageContainer}>
        <Image source={profileIcon} style={styles.profileImage} />
      </View>
      
      {/* 텍스트 영역 */}
      <View style={styles.profileText}>
        <Text style={styles.greeting}>Hello, {nickname}!</Text>
        <Text style={styles.userType}>{userTypeText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff", // 흰색 동그란 배경
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.md,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileImage: {
    width: 50,
    height: 50,
  },
  profileText: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: SPACING.xs,
  },
  userType: {
    fontSize: 14,
    color: "#666",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
}); 