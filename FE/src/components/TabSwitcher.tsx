// src/components/TabSwitcher.tsx
import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
} from "react-native";

export type Tab = { key: string; label: string };

type Props = {
  tabs: Tab[];
  activeKey: string;
  onChange: (key: string) => void;
  style?: ViewStyle;
  activeColor?: string;
  inactiveColor?: string;
};

export default function TabSwitcher({
  tabs,
  activeKey,
  onChange,
  style,
  activeColor = "#53A3DA",
  inactiveColor = "#999",
}: Props) {
  return (
    <View style={[styles.row, style]}>
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[
              styles.tab,
              { borderBottomColor: isActive ? activeColor : "transparent" },
            ]}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={() => {
              console.log("Tab clicked:", tab.key);
              onChange(tab.key);
            }}
          >
            <Text
              style={[
                styles.label,
                { color: isActive ? activeColor : inactiveColor },
                isActive && styles.activeLabel,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    width: "100%",
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: "center",
    borderBottomWidth: 2,
  },
  label: {
    fontSize: 14,
  },
  activeLabel: {
    fontWeight: "800",
  },
});
