import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ImageStyle,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

interface ImageUploaderProps {
  images: (string | null)[]; // null을 허용하여 빈 슬롯 표현
  maxImages?: number;
  onAddImage: (index: number, imageUrl: string) => void; // index 추가
  onRemoveImage?: (index: number) => void;
  accentColor?: string;
}

export default function ImageUploader({
  images,
  maxImages = 3,
  onAddImage,
  onRemoveImage,
  accentColor = "#fec566", // 프로젝트 테마 색상으로 변경
}: ImageUploaderProps) {
  
  // 실제 갤러리에서 사진 업로드하기
  const handleAddImage = async (index: number) => {
    // 권한 요청
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "권한 필요",
        "이미지를 업로드하려면 사진첩 접근 권한이 필요합니다."
      );
      return;
    }

    // 갤러리 열기
    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // 간단한 편집 기능 허용
      aspect: [1, 1],      // 1:1 비율로 자르기
      quality: 1,          // 최고 화질
    });

    // 이미지 선택
    if (!pickerResult.canceled) {
      // 선택된 이미지의 로컬 파일 경로(uri)를 부모 컴포넌트로 전달
      onAddImage(index, pickerResult.assets[0].uri);
    }
  };

  // 각 슬롯을 개별적으로 렌더링
  const renderSlots = (): React.JSX.Element[] => {
    const slots: React.JSX.Element[] = [];

    for (let i = 0; i < maxImages; i++) {
      const imageUrl = images[i];

      if (imageUrl) {
        // 이미지가 있는 슬롯
        slots.push(
          <View key={`slot-${i}`} style={styles.imageWrapper}>
            <Image source={{ uri: imageUrl }} style={styles.uploadedImage} />
            {onRemoveImage && (
              <TouchableOpacity
                style={[styles.removeButton, { backgroundColor: accentColor }]}
                onPress={() => onRemoveImage(i)}
              >
                <Text style={styles.removeButtonText}>×</Text>
              </TouchableOpacity>
            )}
          </View>
        );
      } else {
        // 빈 슬롯 (추가 버튼)
        slots.push(
          <TouchableOpacity
            key={`slot-${i}`}
            style={[styles.addButton, { borderColor: accentColor }]}
            onPress={() => handleAddImage(i)}
          >
            <View style={[styles.addIcon, { backgroundColor: accentColor }]}>
              <Text style={styles.addIconText}>+</Text>
            </View>
          </TouchableOpacity>
        );
      }
    }

    return slots;
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>{renderSlots()}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {} as ViewStyle,
  imageContainer: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "flex-start",
  } as ViewStyle,
  imageWrapper: {
    position: "relative",
    width: 100,
    height: 100,
  } as ViewStyle,
  uploadedImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
  } as ImageStyle,
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  } as ViewStyle,
  removeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 18,
  } as TextStyle,
  addButton: {
    width: 100,
    height: 100,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  } as ViewStyle,
  addIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  } as ViewStyle,
  addIconText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    lineHeight: 22,
  } as TextStyle,
});