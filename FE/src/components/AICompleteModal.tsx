// src/components/AICompleteModal.tsx
import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  ViewStyle,
  TextStyle,
  Image,
  ImageStyle,
} from "react-native";

interface AICompleteModalProps {
  visible: boolean;
  onClose: () => void;
  generatedContent?: string | null;
  // 텍스트 props
  title: string;
  subtitle: string;
  confirmButtonText: string;
  cancelButtonText: string;
  // 버튼 함수 props
  onConfirm: () => void;
  onCancel: () => void;
}

export default function AICompleteModal({
  visible,
  onClose,
  generatedContent,
  title,
  subtitle,
  confirmButtonText,
  cancelButtonText,
  onConfirm,
  onCancel,
}: AICompleteModalProps) {
  const { width } = useWindowDimensions();
  const modalWidth = width * 0.9;

  // 더미 이미지 URL (기본값)
  const defaultImageUrl =
    "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?w=400&h=300&fit=crop";

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={[styles.container, { width: modalWidth }]}>
          {/* AI 생성 이미지 */}
          <View style={styles.imageSection}>
            <Image
              source={{ uri: generatedContent || defaultImageUrl }}
              style={styles.generatedImage}
              resizeMode="cover"
            />
          </View>

          {/* 텍스트 콘텐츠 */}
          <View style={styles.textContent}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>

          {/* 버튼들 */}
          <View style={styles.buttonSection}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={onConfirm}
              activeOpacity={0.7}
            >
              <Text style={styles.confirmButtonText}>{confirmButtonText}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>{cancelButtonText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  } as ViewStyle,

  container: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    maxWidth: 400,
  } as ViewStyle,

  // 이미지 섹션
  imageSection: {
    width: "100%",
    height: 250,
    backgroundColor: "#F5F5F5",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    overflow: "hidden",
  } as ViewStyle,

  generatedImage: {
    width: "100%",
    height: "100%",
  } as ImageStyle,

  // 텍스트 콘텐츠
  textContent: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: "center",
  } as ViewStyle,

  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 8,
  } as TextStyle,

  subtitle: {
    fontSize: 14,
    color: "#666666",
    textAlign: "center",
    lineHeight: 20,
  } as TextStyle,

  // 버튼 섹션
  buttonSection: {
    padding: 24,
    paddingTop: 0,
    gap: 12,
  } as ViewStyle,

  confirmButton: {
    backgroundColor: "#FF69B4",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  } as ViewStyle,

  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  } as TextStyle,

  cancelButton: {
    backgroundColor: "#9CA3AF",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  } as ViewStyle,

  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  } as TextStyle,
});
