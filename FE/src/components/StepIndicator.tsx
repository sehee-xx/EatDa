// src/components/StepIndicator.tsx
import React from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { COLORS } from "../constants/theme";

type Props = {
  currentStep: number;
  totalSteps: number;
  activeColor?: string;
};

export default function StepIndicator({
  currentStep,
  totalSteps,
  activeColor = COLORS.primaryMaker,
}: Props) {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.container, { marginVertical: width * 0.05 }]}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber <= currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <React.Fragment key={stepNumber}>
            <View
              style={[
                styles.step,
                {
                  backgroundColor: isActive
                    ? activeColor
                    : COLORS.inactive + "30",
                  borderColor: isActive ? activeColor : COLORS.inactive,
                  width: width * 0.1,
                  height: width * 0.1,
                },
              ]}
            >
              <Text
                style={[
                  styles.stepText,
                  {
                    color: isActive ? "#fff" : COLORS.inactive,
                    fontSize: width * 0.04,
                  },
                ]}
              >
                {isCompleted ? "✓" : stepNumber}
              </Text>
            </View>
            {stepNumber < totalSteps && (
              <View
                style={[
                  styles.connector,
                  {
                    backgroundColor:
                      stepNumber < currentStep
                        ? activeColor
                        : COLORS.inactive + "30",
                    width: width * 0.15,
                  },
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  step: {
    borderRadius: 50,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  stepText: {
    fontWeight: "600",
  },
  connector: {
    height: 3,
    borderRadius: 1.5,
  },
});
