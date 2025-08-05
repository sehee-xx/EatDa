import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Import screens - 실제 경로에 맞게 수정해주세요
import LoginScreen from "../screens/Login/LoginScreen";
import EaterLoginScreen from "../screens/Login/EaterLoginScreen";
import MakerLoginScreen from "../screens/Login/MakerLoginScreen";

import EaterRegisterScreen from "../screens/Register/EaterRegisterScreen";
import MakerRegisterScreen from "../screens/Register/MakerRegisterScreen";
import RegisterScreen from "../screens/Register/RegisterScreen";
import RoleSelectionScreen from "../screens/Register/RoleSelectionScreen";

import ReviewTabScreen from "../screens/Review/ReviewTabScreen";

import ActiveEventScreen from "../screens/EventMaking/ActiveEventScreen";
import EventMakingScreen from "../screens/EventMaking/EventMakingScreen";

import StoreScreen from "../screens/Store/StoreScreen";
import StoreEventScreen from "../screens/Store/StoreEventScreen";
import StoreMenuScreen from "../screens/Store/StoreMenuScreen";
import StoreReviewScreen from "../screens/Store/StoreReviewScreen";
import DetailEventScreen from "../screens/Store/DetailEventScreen";

import MapScreen from "../screens/Store/Map/MapScreen";
import MenuCustomScreen from "../screens/Store/Menu/MenuCustomScreen";

// Review 관련
import CompleteModal from "../screens/Store/Review/CompleteModal";
import GenerateStep from "../screens/Store/Review/GenerateStep";
import MenuSelectStep from "../screens/Store/Review/MenuSelectStep";
import OCRStep from "../screens/Store/Review/OCRStep";
import ReviewWriteScreen from "../screens/Store/Review/ReviewWriteScreen";
import WriteStep from "../screens/Store/Review/WriteStep";

export type AuthStackParamList = {
  Login: undefined;
  EaterLoginScreen: undefined;
  MakerLoginScreen: undefined;

  RegisterScreen: undefined;
  EaterRegisterScreen: undefined;
  MakerRegisterScreen: undefined;
  RoleSelectionScreen: undefined;

  // 메인 앱 화면들
  ReviewTabScreen: undefined;
  ActiveEventScreen: undefined;
  EventMakingScreen: undefined;

  MapScreen: undefined;

  StoreScreen: undefined;
  StoreEventScreen: undefined;
  StoreMenuScreen: undefined;
  StoreReviewScreen: undefined;
  DetailEventScreen: undefined;

  MenuCustomScreen: undefined;

  CompleteModal: undefined;
  GenerateStep: undefined;
  MenuSelectStep: undefined;
  OCRStep: undefined;
  ReviewWriteScreen: undefined;
  WriteStep: undefined;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ headerShown: false }}
    >
      {/* 로그인 관련 */}
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="EaterLoginScreen" component={EaterLoginScreen} />
      <Stack.Screen name="MakerLoginScreen" component={MakerLoginScreen} />

      {/* 회원가입 관련 */}
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen
        name="EaterRegisterScreen"
        component={EaterRegisterScreen}
      />
      <Stack.Screen
        name="MakerRegisterScreen"
        component={MakerRegisterScreen}
      />
      <Stack.Screen
        name="RoleSelectionScreen"
        component={RoleSelectionScreen}
      />

      {/* 메인 앱 화면들 */}
      <Stack.Screen name="ReviewTabScreen" component={ReviewTabScreen} />
      <Stack.Screen name="ActiveEventScreen" component={ActiveEventScreen} />
      <Stack.Screen name="EventMakingScreen" component={EventMakingScreen} />

      <Stack.Screen name="MapScreen" component={MapScreen} />

      {/* 스토어 관련 */}
      <Stack.Screen name="StoreScreen" component={StoreScreen} />
      <Stack.Screen name="StoreEventScreen" component={StoreEventScreen} />
      <Stack.Screen name="StoreMenuScreen" component={StoreMenuScreen} />
      <Stack.Screen name="StoreReviewScreen" component={StoreReviewScreen} />
      <Stack.Screen name="DetailEventScreen" component={DetailEventScreen} />

      {/* 메뉴 관련 */}
      <Stack.Screen name="MenuCustomScreen" component={MenuCustomScreen} />

      {/* 리뷰 작성 관련 */}
      <Stack.Screen name="CompleteModal" component={CompleteModal} />
      <Stack.Screen name="GenerateStep" component={GenerateStep} />
      <Stack.Screen name="MenuSelectStep" component={MenuSelectStep} />
      <Stack.Screen name="OCRStep" component={OCRStep} />
      <Stack.Screen name="ReviewWriteScreen" component={ReviewWriteScreen} />
      <Stack.Screen name="WriteStep" component={WriteStep} />
    </Stack.Navigator>
  );
}
