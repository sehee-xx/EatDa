import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { COLORS, SPACING } from "../constants/theme";

interface CategoryCardProps {
  icon: any; // 아이콘 파일
  title: string; // 제목 (예: "내가 남긴 리뷰")
  count: number; // 개수
  onPress?: () => void;
}

export default function CategoryCard({ icon, title, count, onPress }: CategoryCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.iconContainer}>
        <Image source={icon} style={styles.icon} resizeMode="contain" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.count}>{count}개</Text>
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
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.textColors.primary,
    marginBottom: SPACING.xs,
  },
  count: {
    fontSize: 12,
    color: COLORS.textColors.secondary,
  },
}); 