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
import SearchButton from "../../../../assets/searchBlackType.svg"
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
    { key: "busAndSubway", label: "버스 + 지하철" },
  ];

  const [activeTab, setActiveTab] = useState("bus");

// 가는방법 데이터
const [findWayData, setFindWayData] = useState([]);

// 검색버튼 눌렀을 때
const [isLoading, setIsLoading] = useState(false);

// 하단 버튼

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
          <TouchableOpacity onPress={() =>{
            setFrom(to);
            setTo(from);
          }}>
            <ChangeInput
              width={30}
              height={30}
              style={{ marginBottom: 20 }}
            ></ChangeInput>
          </TouchableOpacity>
          <TouchableOpacity onPress={() =>{
            // 검색 -> 데이터 불러오기?
          }}>
            <SearchButton width={30} height={30} ></SearchButton>
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
          <NoDataScreen></NoDataScreen>
        ) : (
          <ScrollView></ScrollView>
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
