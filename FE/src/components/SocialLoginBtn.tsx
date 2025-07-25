// src/components/SocialLoginBtn.tsx
import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  useWindowDimensions,
  ViewStyle,
} from "react-native";
import { SvgProps } from "react-native-svg";
import { Shadow } from "react-native-shadow-2";
import { COLORS, SPACING, RADIUS } from "../constants/theme";

interface Props {
  title: string;
  IconComponent: React.FC<SvgProps>;
  onPress: () => void;
  style?: ViewStyle;
  iconStyle?: { width: number; height: number };
}

export default function SocialLoginBtn({
  title,
  onPress,
  IconComponent,
  style,
  iconStyle,
}: Props) {
  const { height } = useWindowDimensions();
  const btnHeight = height * 0.055; // 0.065에서 0.055로 줄임

  return (
    <Shadow
      offset={[0, 2]}
      distance={4}
      startColor="rgba(0,0,0,0.1)"
      style={styles.shadowContainer}
    >
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={[styles.button, { height: btnHeight }, style]}
      >
        <IconComponent
          width={iconStyle?.width || 18} // 20에서 18로 줄임
          height={iconStyle?.height || 18} // 20에서 18로 줄임
          style={styles.icon}
        />
        <Text
          style={[styles.text, title.includes("카카오") && { color: "#333" }]}
        >
          {title}
        </Text>
      </TouchableOpacity>
    </Shadow>
  );
}

const styles = StyleSheet.create({
  shadowContainer: {
    width: "100%",
    borderRadius: RADIUS.md,
    marginBottom: SPACING.xs,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingHorizontal: SPACING.md,
    borderRadius: RADIUS.md,
    width: "100%",
  },
  icon: {
    marginRight: SPACING.sm,
  },
  text: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "center", // 명시적 중앙 정렬
  },
});
