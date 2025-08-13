// src/screens/EventMaking/ActiveEventScreen.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  SafeAreaView,
  StyleSheet,
  ViewStyle,
  TextStyle,
  FlatList,
  Animated,
  ActivityIndicator,            // ✅ 추가
} from "react-native";

import { getActiveEvents } from "./services/api";
import { ActiveEvent } from "./services/api";

import { useFocusEffect } from "@react-navigation/native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { AuthStackParamList } from "../../navigation/AuthNavigator";
import { useAuth } from "../../contexts/AuthContext";
import { eventItem } from "../../components/GridComponent";
import HamburgerButton from "../../components/Hamburger";
import HeaderLogo from "../../components/HeaderLogo";
import GridComponent from "../../components/GridComponent";
import CloseButton from "../../../assets/closeBtn.svg";
import NoDataScreen from "../../components/NoDataScreen";  // ✅ 추가

type NavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  "ActiveEventScreen"
>;

export default function ActiveEventScreen() {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation<NavigationProp>();

  const handleMypage = () => {};
  const handleCreateEventPoster = () => navigation.navigate("EventMakingScreen");

  const { isLoggedIn, userRole } = useAuth();
  const isMaker = isLoggedIn && userRole === "MAKER";

  const [selectedEvent, setSelectedEvent] = useState<eventItem | null>(null);
  const [items, setItems] = useState<eventItem[]>([]);
  const [loading, setLoading] = useState(false);        // 초기 로딩
  const [refreshing, setRefreshing] = useState(false);  // 풀투리프레시 상태

  const adapt = (a: ActiveEvent): eventItem => ({
    id: String(a.eventId),
    eventName: a.title,
    eventDescription: a.title,
    uri: { uri: a.postUrl },  // 서버가 항상 제공하므로 placeholder 제거
    start_date: new Date(a.startAt),
    end_date: new Date(a.endAt),
  });

  // 공통 fetch 함수
  const fetchActive = React.useCallback(async () => {
    setLoading(true);
    try {
      const list = await getActiveEvents();
      setItems(list.map(adapt));
    } catch (e) {
      console.warn("getActiveEvents failed", e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 화면 포커스마다 새로고침
  useFocusEffect(
    React.useCallback(() => {
      let cancelled = false;
      (async () => {
        setLoading(true);
        try {
          const list = await getActiveEvents();
          if (!cancelled) setItems(list.map(adapt));
        } catch (e) {
          console.warn("getActiveEvents failed", e);
          if (!cancelled) setItems([]);
        } finally {
          if (!cancelled) setLoading(false);
        }
      })();
      return () => { cancelled = true; };
    }, [fetchActive])
  );

  // Pull-to-Refresh
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    try {
      const list = await getActiveEvents();
      setItems(list.map(adapt));
    } catch (e) {
      console.warn("refresh getActiveEvents failed", e);
    } finally {
      setRefreshing(false);
    }
  }, []);

  // 상세 보기 상태면 상세 화면 렌더
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  useEffect(() => {
    if (selectedEvent) scaleAnim.setValue(0.8);
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  }, [selectedEvent]);

  const [containerWidth, setContainerWidth] = useState(0);

  if (selectedEvent) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Animated.View style={{ flex: 1, transform: [{ scale: scaleAnim }] }}>
          <CloseButton
            onPress={() => setSelectedEvent(null)}
            style={[
              { position: "absolute" },
              { top: height * 0.04, right: width * 0.07 },
            ]}
          />
          <View
            style={[
              styles.storeNameContainer,
              { paddingTop: height * 0.05, paddingBottom: height * 0.03 },
            ]}
          >
            <Text style={[styles.storeName, { paddingBottom: height * 0.05 }]}>
              햄찌네 피자
            </Text>
            <Image
              style={{ width: width * 0.8, height: height * 0.65, borderRadius: 10 }}
              source={selectedEvent.uri}
              resizeMode="cover"
            />
          </View>
          <View style={[styles.textOverLay, { marginHorizontal: width * 0.1 }]}>
            <Text style={[styles.eventName, { paddingBottom: height * 0.017, paddingTop: height * 0.02 }]}>
              {selectedEvent.eventName}
            </Text>
            <Text style={[styles.eventDescription, { paddingBottom: height * 0.02 }]}>
              {selectedEvent.eventDescription}
            </Text>
          </View>
        </Animated.View>
      </SafeAreaView>
    );
  }

  // 전체 보기
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <HamburgerButton userRole={isMaker ? "maker" : "eater"} onMypage={handleMypage} />
        <HeaderLogo />
      </View>

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
            onPress={() => setSelectedEvent(item)}
          />
        )}
        refreshing={refreshing}
        onRefresh={onRefresh}
        // ✅ 데이터 없을 때 처리
        ListEmptyComponent={
          loading ? (
            <View style={{ paddingTop: 80, alignItems: "center" }}>
              <ActivityIndicator size="large" color="#fec566" />
            </View>
          ) : (
            <NoDataScreen />
          )
        }
        // 빈 화면에서 가운데 정렬
        contentContainerStyle={
          items.length === 0
            ? { flexGrow: 1, justifyContent: "center", paddingHorizontal: 24 }
            : undefined
        }
      />

      {!selectedEvent && isMaker && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.createEventButton}
            onPress={handleCreateEventPoster}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Text style={styles.createEventButtonText}>이벤트 포스터 생성하기</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    paddingTop: 40,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  } as ViewStyle,
  createEventButton: {
    backgroundColor: "#fec566",
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    shadowColor: "#fec566",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  } as ViewStyle,
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,
  createEventButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  } as TextStyle,
  goBackButton: { position: "absolute" },
  storeName: { color: "#333333", fontWeight: "bold", fontSize: 20 } as TextStyle,
  storeNameContainer: { alignItems: "center", justifyContent: "center" },
  textOverLay: { backgroundColor: "#EEEEEE", borderRadius: 10, alignItems: "center" } as ViewStyle,
  eventName: { color: "#000000", fontSize: 14, fontWeight: "bold" } as TextStyle,
  eventDescription: { color: "#333333", fontSize: 12 } as TextStyle,
});
