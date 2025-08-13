// StoreMenuScreen.tsx
import React, { useEffect, useState, useCallback } from "react";
import { View, Text, FlatList, Image, ActivityIndicator } from "react-native";
import { getStoreMenu, StoreMenuItem } from "./Menu/services/api";
import NoDataScreen from "../../components/NoDataScreen";

export default function StoreMenuScreen({ storeId }: { storeId: number }) {
  const [items, setItems] = useState<StoreMenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    console.log(`[StoreMenu] storeId=${storeId}`);
    if (!Number.isFinite(storeId)) {
      console.warn(`[StoreMenu] ⚠️ invalid storeId:`, storeId);
    }
  }, [storeId]);

  const fetchMenus = useCallback(async () => {
    setLoading(true);
    const t0 = Date.now();
    try {
      console.log(`[StoreMenu] fetch start (storeId=${storeId})`);
      const list = await getStoreMenu(storeId);
      setItems(list);
      console.log(
        `[StoreMenu] fetch success (${Date.now() - t0}ms) count=${list.length}`
      );
      if (list[0]) console.log(`[StoreMenu] first`, list[0]);
    } catch (e) {
      console.warn("[StoreMenu] fetch failed:", e);
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      setItems(await getStoreMenu(storeId));
    } finally {
      setRefreshing(false);
    }
  }, [storeId]);

  if (!loading && items.length === 0) return <NoDataScreen />;

  return (
    <View style={{ flex: 1 }}>
      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(m) => String(m.menuId)}
          refreshing={refreshing}
          onRefresh={onRefresh}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                padding: 12,
                alignItems: "center",
              }}
            >
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 8,
                    marginRight: 12,
                  }}
                />
              ) : (
                <View
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 8,
                    marginRight: 12,
                    backgroundColor: "#eee",
                  }}
                />
              )}
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 16, fontWeight: "600" }}>
                  {item.name}
                </Text>
                <Text style={{ marginTop: 2 }}>
                  {item.price.toLocaleString()}원
                </Text>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}
