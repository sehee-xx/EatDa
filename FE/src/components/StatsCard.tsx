import React from "react";
import { Text, StyleSheet, TouchableOpacity} from "react-native";

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
    backgroundColor: "rgba(80, 62, 80, 0.25)", 
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center", 
    width: 90,
    height: 60,
  },
  count: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#fff",
  },
}); 