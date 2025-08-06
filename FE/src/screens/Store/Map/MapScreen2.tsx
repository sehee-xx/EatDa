// src/screens/Store/MapScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Linking,
  ViewStyle,
  TextStyle,
  useWindowDimensions,
  TextInput,
} from "react-native";

import HamburgerButton from "../../../components/Hamburger";
import HeaderLogo from "../../../components/HeaderLogo";
import TabSwitcher from "../../../components/TabSwitcher";
import GoingImg from "../../../../assets/goingImage.svg";
import Destination from "../../../../assets/destination.svg";
import CurrentPosition from "../../../../assets/currentPosition.svg";
import ChangeInput from "../../../../assets/changeInput.svg";
import ClearButton from "../../../../assets/closeBtn.svg";
import BottomButton from "../../../components/BottomButton";
import NoDataScreen from "../../../components/NoDataScreen";
import SearchButton from "../../../../assets/searchBlackType.svg";
import { FindWayData, FindWayItem } from "../../../data/findWayData";

interface StoreMapScreenProps {
  onClose: () => void;
}

interface TimeSlot {
  day: string;
  time: string;
  isToday?: boolean;
}

export default function MapScreen2({ onClose }: StoreMapScreenProps) {
  const { width, height } = useWindowDimensions();
  const horizontalMargin = width * 0.06;

  // 출도착지 스와핑
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  //   탭 버튼
  const tabs = [
    { key: "bus", label: "버스" },
    { key: "subway", label: "지하철" },
    { key: "walk", label: "도보" },
  ];

  const [activeTab, setActiveTab] = useState("bus");

  // 가는방법 데이터
  const [findWayData, setFindWayData] = useState<FindWayItem[]>([]);

  // 검색버튼 눌렀을 때
  const [isLoading, setIsLoading] = useState(false);

  const filteredData = findWayData.filter((item) => {
    if (activeTab === "bus") return item.method === "BUS";
    if (activeTab === "subway") return item.method === "SUBWAY";
    if (activeTab === "walk") return item.method === "WALK";
    return false;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f7f8f9" }}>
      <View
        style={[
          styles.headerContainer,
          { marginHorizontal: horizontalMargin, marginTop: height * 0.057 },
        ]}
      >
        <HamburgerButton
          userRole="eater"
          onLogout={() => console.log("logout")}
          activePage="mapPage"
        ></HamburgerButton>
        <HeaderLogo></HeaderLogo>
      </View>
      {/* 출발 도착지 설정하는 박스 */}
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: width * 0.07,
          marginVertical: height * 0.03,
        }}
      >
        <View>
          <GoingImg
            width={30}
            height={30}
            style={{ marginLeft: 5, marginBottom: 10 }}
          ></GoingImg>
          <Destination width={40} height={40}></Destination>
        </View>
        <View style={{ marginHorizontal: width * 0.025 }}>
          <TextInput
            value={from}
            onChangeText={setFrom}
            style={{
              width: width * 0.6,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#e2e2e2",
            }}
            placeholder="출발지를 입력하세요"
          ></TextInput>
          <TextInput
            value={to}
            onChangeText={setTo}
            style={{
              width: width * 0.6,
              backgroundColor: "#f5f5f5",
              borderRadius: 8,
              borderWidth: 1,
              borderColor: "#e2e2e2",
            }}
            placeholder="도착지를 입력하세요"
          ></TextInput>
        </View>
        <View>
          <TouchableOpacity
            onPress={() => {
              setFrom(to);
              setTo(from);
            }}
          >
            <ChangeInput
              width={30}
              height={30}
              style={{ marginBottom: 20 }}
            ></ChangeInput>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setFindWayData(FindWayData);
            }}
          >
            <SearchButton width={30} height={30}></SearchButton>
          </TouchableOpacity>
        </View>
      </View>
      {/* 탭스위치 */}
      <TabSwitcher
        tabs={tabs}
        activeKey={activeTab}
        onChange={(key) => {
          setActiveTab(key);
        }}
      ></TabSwitcher>

      {findWayData.length === 0 ? (
        <NoDataScreen />
      ) : (
        <ScrollView style={{ paddingHorizontal: horizontalMargin }}>
          {filteredData.map((item) => (
            <View
              key={item.id}
              style={{
                marginVertical: 12,
                padding: 14,
                backgroundColor: "white",
                borderRadius: 10,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowOffset: { width: 0, height: 1 },
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                {Math.floor(item.totalTime / 60) > 0
                  ? `${Math.floor(item.totalTime / 60)}시간 ${
                      item.totalTime % 60
                    }분`
                  : `${item.totalTime}분`}
              </Text>
              <Text style={{ color: "#888", marginTop: 4 }}>
                도보 {item.walkTime}분 | 환승 {item.transitSections.length - 1}
                회 | 거리 {item.distance}km
              </Text>
              <View
                style={{ flexDirection: "row", marginTop: 8, flexWrap: "wrap" }}
              >
                {item.transitSections.map((section, idx) => (
                  <View
                    key={idx}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginRight: 8,
                      marginTop: 4,
                    }}
                  >
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        backgroundColor: section.color,
                        borderRadius: 4,
                        marginRight: 4,
                      }}
                    />
                    <Text>{section.lineName}</Text>
                    {idx < item.transitSections.length - 1 && (
                      <Text style={{ marginHorizontal: 4 }}>→</Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      )}
      <BottomButton
        onPress={() => console.log("페이지이동연결할게요")}
      ></BottomButton>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
  } as ViewStyle,

  activeTab: {},
});
