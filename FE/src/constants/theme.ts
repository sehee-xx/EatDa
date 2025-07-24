// src/constants/theme.ts
import { StyleSheet, ViewStyle, TextStyle } from "react-native";

export const COLORS = {
  // 메인 역할 컬러
  primaryEater: "#53a3da", // 소비자-2 (블루)
  primaryMaker: "#38cca2", // 사장님-2 (그린)

  // 서브 컬러 (밝은 버전)
  secondaryEater: "#fc6fae", // 소비자-1 (핑크)
  secondaryMaker: "#fec566", // 사장님-1 (옐로우)

  // 그레이스케일
  gray100: "#ffffff", // Grey Scale 100
  gray200: "#f7f8f9", // Grey Scale 200
  gray300: "#e4e4e6", // Grey Scale 300
  gray400: "#c6c6c6", // Grey Scale 400
  gray500: "#868688", // Grey Scale 500
  gray600: "#333333", // Grey Scale 600

  // 서브 컬러
  green: "#13bd7f", // Green-1
  red: "#f24147", // Red-1

  // 기본 컬러 (기존 호환성)
  inactive: "#868688",
  text: "#333333",
  white: "#ffffff",
  shadow: "rgba(0,0,0,0.1)",

  // 배경 컬러
  background: {
    primary: "#ffffff",
    secondary: "#f7f8f9",
    disabled: "#e4e4e6",
  },

  // 텍스트 컬러
  textColors: {
    primary: "#333333",
    secondary: "#868688",
    disabled: "#c6c6c6",
    inverse: "#ffffff",
  },

  // 상태 컬러
  status: {
    success: "#13bd7f",
    error: "#f24147",
    warning: "#fec566",
    info: "#53a3da",
  },
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const RADIUS = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  round: 999,
};

export const SHADOW: ViewStyle = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
};

export const SHADOWS = {
  small: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  } as ViewStyle,

  medium: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  } as ViewStyle,

  large: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  } as ViewStyle,

  xlarge: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  } as ViewStyle,
};

export const TYPOGRAPHY = {
  fontSize: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    xxxl: 24,
  },

  fontWeight: {
    light: "300" as const,
    regular: "400" as const,
    medium: "500" as const,
    semibold: "600" as const,
    bold: "700" as const,
    extrabold: "800" as const,
    black: "900" as const,
  },

  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.8,
  },
};

export const textStyles = StyleSheet.create({
  logo: {
    fontFamily: "AlfaSlabOne",
    color: COLORS.text,
  },

  // 헤딩 스타일
  h1: {
    fontSize: TYPOGRAPHY.fontSize.xxxl,
    fontWeight: TYPOGRAPHY.fontWeight.black,
    color: COLORS.textColors.primary,
    lineHeight: TYPOGRAPHY.fontSize.xxxl * TYPOGRAPHY.lineHeight.tight,
  },

  h2: {
    fontSize: TYPOGRAPHY.fontSize.xxl,
    fontWeight: TYPOGRAPHY.fontWeight.extrabold,
    color: COLORS.textColors.primary,
    lineHeight: TYPOGRAPHY.fontSize.xxl * TYPOGRAPHY.lineHeight.tight,
  },

  h3: {
    fontSize: TYPOGRAPHY.fontSize.xl,
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    color: COLORS.textColors.primary,
    lineHeight: TYPOGRAPHY.fontSize.xl * TYPOGRAPHY.lineHeight.normal,
  },

  // 본문 스타일
  body: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    color: COLORS.textColors.primary,
    lineHeight: TYPOGRAPHY.fontSize.md * TYPOGRAPHY.lineHeight.normal,
  },

  bodyLarge: {
    fontSize: TYPOGRAPHY.fontSize.lg,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    color: COLORS.textColors.primary,
    lineHeight: TYPOGRAPHY.fontSize.lg * TYPOGRAPHY.lineHeight.normal,
  },

  bodySmall: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.regular,
    color: COLORS.textColors.secondary,
    lineHeight: TYPOGRAPHY.fontSize.sm * TYPOGRAPHY.lineHeight.normal,
  },

  // 캡션 스타일
  caption: {
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.textColors.secondary,
    lineHeight: TYPOGRAPHY.fontSize.xs * TYPOGRAPHY.lineHeight.normal,
  },

  // 버튼 스타일
  buttonText: {
    fontSize: TYPOGRAPHY.fontSize.md,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textColors.inverse,
  },

  buttonTextSmall: {
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.textColors.inverse,
  },
});

export const imageStyles = StyleSheet.create({
  full: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  cover: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  contain: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
});

// 테마별 컬러 조합
export const THEME_COLORS = {
  eater: {
    primary: COLORS.primaryEater,
    secondary: COLORS.secondaryEater,
    background: `${COLORS.primaryEater}10`, // 10% opacity
    light: `${COLORS.primaryEater}20`, // 20% opacity
  },

  maker: {
    primary: COLORS.primaryMaker,
    secondary: COLORS.secondaryMaker,
    background: `${COLORS.primaryMaker}10`, // 10% opacity
    light: `${COLORS.primaryMaker}20`, // 20% opacity
  },
};
