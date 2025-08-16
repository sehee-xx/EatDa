// src/screens/Store/StoreEventScreen.tsx
import React, { useEffect, useCallback, useState } from "react";
import { View, Text, FlatList } from "react-native";
import GridComponent, { eventItem } from "../../components/GridComponent";
import DetailEventScreen from "./DetailEventScreen";
import NoDataScreen from "../../components/NoDataScreen";
import { getStoreEvents } from "../EventMaking/services/api";
import type { ActiveEvent } from "../EventMaking/services/api";
import ResultModal from "../../components/ResultModal";

type Props = {
  storeId: number;
  canDelete?: boolean; // 가게 주인일 때만 true
};

const adapt = (a: ActiveEvent): eventItem => ({
  id: String(a.eventId),
  eventName: a.title,
  description: a.description ?? "",
  uri: { uri: a.postUrl },
  start_date: new Date(a.startAt),
  end_date: new Date(a.endAt),
  storeName: a.storeName ?? "",
});

// 유효 이미지(포스터)만 남기기
const toItems = (list: ActiveEvent[]): eventItem[] =>
  list.map(adapt).filter((it) => {
    const uri = (it.uri as any)?.uri;
    return typeof uri === "string" && uri.trim().length > 0;
  });

export default function StoreEventScreen({
  storeId,
  canDelete = false,
}: Props) {
  const [containerWidth, setContainerWidth] = useState(0);
  const [items, setItems] = useState<eventItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  // ResultModal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"success" | "failure">("failure");
  const [modalMessage, setModalMessage] = useState("");

  const openError = (msg: string) => {
    setModalType("failure");
    setModalMessage(msg);
    setModalVisible(true);
  };

  const fetchFirst = useCallback(async () => {
    if (!storeId) return;
    setLoading(true);
    try {
      const list = await getStoreEvents(storeId);
      setItems(toItems(list));
      if (list?.[0]) console.log("[StoreEvent] first item:", list[0]);
    } catch (e) {
      console.warn("[StoreEvent] getStoreEvents failed:", e);
      setItems([]);
      openError("이벤트를 불러오는데 실패했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }, [storeId]);

  useEffect(() => {
    fetchFirst();
  }, [fetchFirst]);

  const onRefresh = useCallback(async () => {
    if (!storeId) return;
    setRefreshing(true);
    try {
      const list = await getStoreEvents(storeId);
      setItems(toItems(list));
    } catch (e) {
      console.warn("[StoreEvent] refresh failed:", e);
      openError("이벤트 새로고침에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setRefreshing(false);
    }
  }, [storeId]);

  const isEmpty = !loading && items.length === 0;
  const tile = Math.floor(containerWidth / 3);

  if (isEmpty)
    return (
      <>
        <NoDataScreen />
        <ResultModal
          visible={modalVisible}
          type={modalType}
          message={modalMessage}
          onClose={() => setModalVisible(false)}
        />
      </>
    );

  if (selectedIndex !== null) {
    return (
      <>
        <DetailEventScreen
          events={items}
          selectedIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
          onDeleted={(deletedId) => {
            setItems((prev) => prev.filter((it) => it.id !== deletedId));
            setSelectedIndex(null);
          }}
          canDelete={canDelete}
        />
        <ResultModal
          visible={modalVisible}
          type={modalType}
          message={modalMessage}
          onClose={() => setModalVisible(false)}
        />
      </>
    );
  }

  return (
    <View
      style={{ flex: 1, marginVertical: 10 }}
      onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
    >
      {tile > 0 && (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={({ item, index }) => (
            <GridComponent
              item={item}
              size={tile}
              index={index}
              totalLength={items.length}
              onPress={() => setSelectedIndex(index)}
            />
          )}
          refreshing={refreshing}
          onRefresh={onRefresh}
          ListFooterComponent={
            loading ? (
              <View style={{ paddingVertical: 12 }}>
                <Text style={{ textAlign: "center" }}>불러오는 중…</Text>
              </View>
            ) : null
          }
          removeClippedSubviews
        />
      )}

      <ResultModal
        visible={modalVisible}
        type={modalType}
        message={modalMessage}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}
