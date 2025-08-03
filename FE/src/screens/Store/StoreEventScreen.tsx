// src/screens/Store/StoreEventScreen.tsx

// 탭스위치에서 값이 === event 인 경우에 불러오기

import React , {useState} from "react";

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Animated,
  FlatList,
  useWindowDimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import {eventData} from "../../data/eventData"
import GridComponent from "../../components/GridComponent";

export default function StoreEventScreen(){

      const [containerWidth, setContainerWidth] = useState(0);


    return (
        <FlatList
        data={eventData}
        keyExtractor={(item) => item.id}
        onLayout={(e) => setContainerWidth(e.nativeEvent.layout.width)}
        numColumns={2}
        renderItem={({item, index}) => (
           <GridComponent
           item={item}
           size={containerWidth/2}
           index={index}
           totalLength={eventData.length}
           onPress={() =>{
            console.log("상세보기 출력할거임")
           }}></GridComponent>

        )}
        ></FlatList>

    )
}