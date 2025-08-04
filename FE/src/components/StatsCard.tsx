import React from "react";
import { Text, StyleSheet, TouchableOpacity} from "react-native";
import { SPACING } from "../constants/theme";

interface StatsCardProps {
  type: "리뷰" | "스크랩" | "메뉴판"; // 타입 (리뷰, 스크랩, 메뉴판)
  count: number; // 개수
}

export default function StatsCard({ type, count }: StatsCardProps) {
  return (
    <TouchableOpacity style={styles.card}>
      <Text style={styles.count}>{count}</Text>
      <Text style={styles.label}>{type}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "rgba(80, 62, 80, 0.25)", // 연보라색 배경
    borderRadius: 16,
    padding: SPACING.xs,
    alignItems: "center",
    justifyContent: "center", 
    minHeight: 80,
    flex: 1,
    marginHorizontal: SPACING.xs,
  },
  count: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: SPACING.xs,
  },
  label: {
    fontSize: 12,
    color: "#fff",
    textAlign: "center",
    fontWeight: "500",
  },
}); 