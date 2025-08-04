import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { COLORS, SPACING } from "../constants/theme";

interface ActivityCardProps {
  icon: any; // 아이콘 파일
  text: string; // 활동 내용 텍스트
  time: string; // 시간 (예: "2시간 전")
  onPress?: () => void;
}

export default function ActivityCard({ icon, text, time, onPress }: ActivityCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Image source={icon} style={styles.icon} resizeMode="contain" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{text}</Text>
        <Text style={styles.time}>{time}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: SPACING.md,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: SPACING.sm,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  iconContainer: {
    marginRight: SPACING.md,
  },
  icon: {
    width: 32,
    height: 32,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 14,
    color: COLORS.textColors.primary,
    marginBottom: SPACING.xs,
  },
  time: {
    fontSize: 12,
    color: COLORS.textColors.secondary,
  },
}); 