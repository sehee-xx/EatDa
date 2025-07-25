// src/components/InputGroup.tsx
import React from "react";
import {
  View,
  Text,
  useWindowDimensions,
  StyleSheet,
  TextInputProps,
} from "react-native";
import CustomInput from "./CustomInput";
import { COLORS } from "../constants/theme";

interface Props extends TextInputProps {
  label: string;
}

export default function InputGroup({ label, ...inputProps }: Props) {
  const { width, height } = useWindowDimensions();

  return (
    <View style={{ marginBottom: height * 0.02 }}>
      <Text
        style={[
          styles.label,
          {
            fontSize: width * 0.035,
            marginBottom: height * 0.015,
          },
        ]}
      >
        {label}
      </Text>
      <CustomInput
        {...inputProps}
        style={[
          {
            height: height * 0.065,
            paddingHorizontal: width * 0.04,
          },
          inputProps.style,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: COLORS.text,
    fontWeight: "500",
  },
});
