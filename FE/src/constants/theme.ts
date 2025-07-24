// src/constants/theme.ts
import { StyleSheet, ViewStyle, TextStyle } from "react-native";

export const COLORS = {
  primaryEater: "#53A3DA",
  primaryMaker: "#38CCA2",
  inactive: "#999",
  text: "#333",
  white: "#fff",
  shadow: "rgba(0,0,0,0.1)",
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
};

export const RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
};

export const SHADOW: ViewStyle = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
};

export const textStyles = StyleSheet.create({
  logo: {
    fontFamily: "AlfaSlabOne",
    color: COLORS.text,
  },
});

export const imageStyles = StyleSheet.create({
  full: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
});
