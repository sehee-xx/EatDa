import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  StyleSheet,
  Alert,
} from "react-native";
import { getStoreMenus, MenuData } from "./Menu/services/api";
import NoDataScreen from "../../components/NoDataScreen";
type Props = { storeId: number; accessToken: string }; //

export default function StoreMenuScreen({ storeId, accessToken }: Props) {
  const [menuData, setMenuData] = useState<MenuData[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchedOnce, setFetchedOnce] = useState(false);
  const [error, setError] = useState<string>("");

  // 실제 메뉴 데이터 가져오기
  useEffect(() => {
    console.log("[STORE-MENU][SCREEN] mount", {
      storeId,
      accessTokenLen: accessToken?.length ?? 0,
      typeOfStoreId: typeof storeId,
    });

    const fetchMenuData = async () => {
      try {
        setLoading(true);
        setError("");

        const sid = typeof storeId === "string" ? Number(storeId) : storeId;
        if (!Number.isFinite(sid)) {
          console.warn("[STORE-MENU][SCREEN] invalid storeId:", storeId);
          setMenuData([]);
          return;
        }

        console.log("[STORE-MENU][SCREEN] call getStoreMenus", {
          storeId: sid,
        });
        const menus = await getStoreMenus(sid, accessToken);

        const adjusted = menus.map((menu, index) => ({
          ...menu,
          id:
            menu.id === undefined || menu.id === null || menu.id === 0
              ? index + 1
              : menu.id,
        }));

        console.log("[STORE-MENU][SCREEN] received", {
          count: adjusted.length,
          sample: adjusted[0],
        });
        setMenuData(adjusted);
      } catch (error: any) {
        console.error("[STORE-MENU][SCREEN] fetch error:", error);
        setError(error.message || "메뉴를 불러오는데 실패했습니다.");
        Alert.alert(
          "오류",
          "메뉴를 불러오는데 실패했습니다. 다시 시도해주세요."
        );
      } finally {
        setLoading(false);
      }
    };

    if (storeId && accessToken) fetchMenuData();
  }, [storeId, accessToken]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const list = await getStoreMenus(storeId, accessToken);
      setMenuData(Array.isArray(list) ? list : []);
    } catch (e) {
      console.warn("[StoreMenu] refresh failed:", e);
    } finally {
      setRefreshing(false);
    }
  }, [storeId, accessToken]);

  if (fetchedOnce && !loading && menuData.length === 0) {
    return <NoDataScreen />;
  }

  return (
    <View style={{ flex: 1 }}>
      {loading && !fetchedOnce ? (
        <ActivityIndicator style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={menuData}
          keyExtractor={(m, idx) => `${storeId}-${m.name}-${idx}`} //
          refreshing={refreshing}
          onRefresh={onRefresh}
          contentContainerStyle={{ paddingVertical: 8 }}
          renderItem={({ item }) => (
            <View style={styles.row}>
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
              ) : (
                <View style={[styles.thumb, styles.thumbPlaceholder]} />
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.name}>{item.name}</Text>
                {typeof item.price === "number" ? (
                  <Text style={styles.price}>
                    {item.price.toLocaleString()}원
                  </Text>
                ) : null}
                {item.description ? (
                  <Text style={styles.desc}>{item.description}</Text>
                ) : null}
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: "center",
  },
  thumb: { width: 64, height: 64, borderRadius: 8, marginRight: 12 },
  thumbPlaceholder: { backgroundColor: "#eee" },
  name: { fontSize: 16, fontWeight: "600" },
  price: { marginTop: 2 },
  desc: { marginTop: 4, color: "#666" },
});
