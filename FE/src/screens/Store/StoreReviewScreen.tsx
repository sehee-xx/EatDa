// src/screens/Store/StoreReviewScreen.tsx

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Text,
  View,
  FlatList,
  Image,
  Dimensions,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Alert,
} from "react-native";
import { Video, ResizeMode } from "expo-av";
import GridComponent, { ReviewItem } from "../../components/GridComponent";
import CloseBtn from "../../../assets/closeBtn.svg";
import NoDataScreen from "../../components/NoDataScreen";

// API
import { getStoreReviews } from "./Review/services/api";
import { getTokens } from "../Login/services/tokenStorage";

interface StoreReviewScreenProps {
  storeId: number; // ← 가게페이지에서 넘겨줄 것
}

export default function StoreReviewScreen({ storeId }: StoreReviewScreenProps) {
  const screenHeight = Dimensions.get("window").height;

  const [containerWidth, setContainerWidth] = useState(0);
  const [selectedItem, setSelectedItem] = useState<ReviewItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { height } = useWindowDimensions();

  const [items, setItems] = useState<ReviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchedOnce, setFetchedOnce] = useState(false);

  const flatListRef = useRef<FlatList<ReviewItem>>(null);
  const vdoRefs = useRef<{ [key: number]: Video | null }>({});

  // 스크롤 시 여러 페이지 한꺼번에 넘어가지 않게끔 조절
  const handleMomentumEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = e.nativeEvent.contentOffset.y;
      const page = Math.round(offsetY / screenHeight);
      flatListRef.current?.scrollToOffset({
        offset: page * screenHeight,
        animated: false,
      });
      setCurrentIndex(page);
    },
    [screenHeight]
  );

  useEffect(() => {
    Object.keys(vdoRefs.current).forEach((key) => {
      const idx = parseInt(key, 10);
      const video = vdoRefs.current[idx];
      if (!video) return;
      if (idx === currentIndex) video.playAsync();
      else video.pauseAsync();
    });
  }, [currentIndex]);

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const handleOpenDetail = (item: ReviewItem) => {
    setSelectedItem(item);
    scaleAnim.setValue(0.8);
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const fetchReviews = useCallback(async () => {
    try {
      if (!storeId || storeId <= 0) {
        Alert.alert("오류", "유효하지 않은 가게 ID입니다.");
        return;
      }
      setLoading(true);
      const { accessToken } = await getTokens();
      if (!accessToken) {
        Alert.alert("로그인 필요", "다시 로그인 해주세요.");
        return;
      }

      const raw = await getStoreReviews(storeId, accessToken);

      // API → Grid/상세뷰에서 쓰는 ReviewItem으로 매핑
      // 백엔드에 id 필드가 없다면 프론트에서 고유키 생성
      const mapped: ReviewItem[] = raw
        .map((r, idx) => {
          const isVideo = !!r.shortsUrl && typeof r.shortsUrl === "string";
          const uri = isVideo ? r.shortsUrl : r.imageUrl;

          // uri가 하나도 없으면 렌더링 불가하므로 스킵
          if (!uri || typeof uri !== "string" || uri.length === 0) return null;

          const idBase =
            (r as any).id != null ? String((r as any).id) : `${storeId}-${idx}`;
          return {
            id: idBase,
            type: isVideo ? "video" : "image",
            uri,
            // 타이틀이 따로 없으므로 간단한 프리셋
            title: isVideo ? "쇼츠 리뷰" : "사진 리뷰",
            description: r.description ?? "",
            // GridComponent가 썸네일을 사용한다면 r.thumbnailUrl 활용 가능
            // thumbnail: r.thumbnailUrl ?? undefined,
          } as ReviewItem;
        })
        .filter(Boolean) as ReviewItem[];

      setItems(mapped);
      setFetchedOnce(true);
    } catch (e: any) {
      console.log("[StoreReviewScreen] fetchReviews error:", e?.message);
      Alert.alert("리뷰 조회 실패", e?.message || "잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const isEmpty = fetchedOnce && (!items || items.length === 0);

  if (loading && !fetchedOnce) {
    return <NoDataScreen />;
  }

  return isEmpty ? (
    <NoDataScreen />
  ) : (
    <View style={{ flex: 1 }}>
      {selectedItem ? (
        <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }] }}>
          {/* 상세보기 */}
          <FlatList
            ref={flatListRef}
            data={items}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View style={{ height: screenHeight }}>
                {/* 이미지 리뷰 */}
                {item.type === "image" ? (
                  <Image
                    source={{ uri: item.uri }}
                    style={{ flex: 1 }}
                    resizeMode="cover"
                  />
                ) : (
                  /* 비디오 리뷰 */
                  <Video
                    ref={(ref) => {
                      vdoRefs.current[index] = ref;
                    }}
                    source={{ uri: item.uri }}
                    style={{ flex: 1 }}
                    resizeMode={ResizeMode.COVER}
                    shouldPlay={index === currentIndex}
                    isLooping
                    isMuted
                  />
                )}
                {/* 닫기 버튼 */}
                <TouchableOpacity
                  style={styles.closeBtn}
                  onPress={() => setSelectedItem(null)}
                >
                  <CloseBtn />
                </TouchableOpacity>
                <View style={[styles.textOverlay, { bottom: height * 0.33 }]}>
                  <Text style={styles.titleText}>#{item.title}</Text>
                  <Text style={styles.descText}>{item.description}</Text>
                </View>
              </View>
            )}
            pagingEnabled
            decelerationRate="fast"
            snapToInterval={screenHeight}
            snapToAlignment="start"
            initialScrollIndex={items.findIndex(
              (i) => i.id === selectedItem?.id
            )}
            getItemLayout={(data, index) => ({
              length: screenHeight,
              offset: screenHeight * index,
              index,
            })}
            onMomentumScrollEnd={handleMomentumEnd}
            windowSize={2}
            initialNumToRender={1}
            maxToRenderPerBatch={1}
            removeClippedSubviews
          />
        </Animated.View>
      ) : (
        // 전체 보기 (그리드)
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
          numColumns={3}
          renderItem={({ item, index }) => (
            <GridComponent
              item={item}
              size={containerWidth / 3}
              index={index}
              totalLength={items.length}
              onPress={() => handleOpenDetail(item)}
            />
          )}
          // 당겨서 새로고침(optional)
          refreshing={loading}
          onRefresh={fetchReviews}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  closeBtn: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: 15,
    zIndex: 5,
  },
  textOverlay: {
    position: "absolute",
    left: 20,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 12,
    padding: 12,
    marginRight: 100,
  },
  titleText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  descText: {
    color: "#fff",
    fontSize: 13,
  },
});
