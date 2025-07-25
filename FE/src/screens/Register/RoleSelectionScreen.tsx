// src/screens/Register/RoleSelectionScreen.tsx
import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { COLORS, textStyles } from "../../constants/theme";
import EaterProfileIcon from "../../../assets/eater-profile.svg";
import MakerProfileIcon from "../../../assets/maker-profile.svg";

type Props = {
  onSelectRole: (role: "eater" | "maker") => void;
  onBack: () => void;
};

// 글리터 파티클 컴포넌트
const GlitterParticle = ({ style }: { style: any }) => (
  <View style={[styles.glitterParticle, style]} />
);

export default function RoleSelectionScreen({ onSelectRole, onBack }: Props) {
  const { width, height } = useWindowDimensions();
  const [eaterPressed, setEaterPressed] = useState(false);
  const [makerPressed, setMakerPressed] = useState(false);

  // 글리터 애니메이션을 위한 Animated Values
  const [glitterAnimations] = useState(() =>
    Array.from({ length: 8 }, () => new Animated.Value(0))
  );

  const startGlitterAnimation = (isEater: boolean) => {
    const animations = glitterAnimations.map((anim, index) =>
      Animated.sequence([
        Animated.delay(index * 50),
        Animated.timing(anim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ])
    );

    Animated.parallel(animations).start();
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require("../../../assets/white-background.png")}
        style={styles.background}
        resizeMode="cover"
      >
        <SafeAreaView
          style={[styles.content, { paddingVertical: height * 0.04 }]}
        >
          {/* 로고 및 타이틀 */}
          <View style={[styles.headerContainer, { marginTop: height * 0.05 }]}>
            <Text
              style={[
                textStyles.logo,
                { fontSize: width * 0.09, marginBottom: height * 0.015 },
              ]}
            >
              <Text style={{ color: "#fc6fae" }}>E</Text>at
              <Text style={{ color: "#38cca2" }}>D</Text>a!
            </Text>
            <Text
              style={[
                styles.mainTitle,
                { fontSize: width * 0.042, marginBottom: height * 0.008 },
              ]}
            >
              어떤 역할로 가입하시겠어요?
            </Text>
            <Text style={[styles.subtitle, { fontSize: width * 0.03 }]}>
              맛집을 발견하고 공유하는 특별한 여정을 시작해보세요
            </Text>
          </View>

          {/* 역할 선택 카드들 */}
          <View style={[styles.cardContainer, { marginTop: height * 0.05 }]}>
            {/* 냠냠이 카드 */}
            <TouchableOpacity
              style={[styles.roleCard, { marginBottom: height * 0.025 }]}
              onPress={() => onSelectRole("eater")}
              onPressIn={() => {
                setEaterPressed(true);
                startGlitterAnimation(true);
              }}
              onPressOut={() => setEaterPressed(false)}
              activeOpacity={1}
            >
              <View
                style={[styles.cardContainer3D, eaterPressed && styles.pressed]}
              >
                <LinearGradient
                  colors={["#fef7f7", "#fce7f3", "#fbcfe8"]}
                  style={styles.cardBackground}
                >
                  <LinearGradient
                    colors={
                      eaterPressed
                        ? ["#ff8bb5", "#ff69b4", "#fc6fae"]
                        : ["#fc6fae", "#f472b6", "#ec4899"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientOverlay}
                  >
                    {/* 글리터 효과 */}
                    {eaterPressed &&
                      glitterAnimations.map((anim, index) => (
                        <Animated.View
                          key={index}
                          style={[
                            styles.glitterContainer,
                            {
                              opacity: anim,
                              transform: [
                                {
                                  translateY: anim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, -30],
                                  }),
                                },
                                {
                                  scale: anim.interpolate({
                                    inputRange: [0, 0.5, 1],
                                    outputRange: [0, 1.5, 0],
                                  }),
                                },
                              ],
                              left: `${(index * 12 + 10) % 80}%`,
                              top: `${(index * 15 + 20) % 60}%`,
                            },
                          ]}
                        >
                          <GlitterParticle style={{}} />
                        </Animated.View>
                      ))}

                    {/* 장식 요소들 */}
                    <View style={[styles.decorCircle, styles.decorCircle1]} />
                    <View style={[styles.decorCircle, styles.decorCircle2]} />
                    <View style={[styles.decorCircle, styles.decorCircle3]} />

                    <View style={styles.cardContent}>
                      {/* 배지 - 카드 밖으로 이동 */}
                      <View style={[styles.badge, styles.eaterBadge]}>
                        <Text style={styles.badgeText}>FOODIE</Text>
                      </View>

                      {/* 캐릭터 영역 */}
                      <View style={styles.characterContainer}>
                        <View style={styles.characterBg}>
                          <EaterProfileIcon width={48} height={48} />
                        </View>
                      </View>

                      {/* 텍스트 영역 */}
                      <View style={styles.textContainer}>
                        <Text
                          style={[
                            styles.roleTitle,
                            { fontSize: width * 0.048 },
                          ]}
                        >
                          냠냠이로 가입하기
                        </Text>
                        <Text
                          style={[
                            styles.roleDescription,
                            { fontSize: width * 0.029 },
                          ]}
                        >
                          맛집 리뷰 쇼츠 탐색과{"\n"}콘텐츠 제작의 즐거움
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </LinearGradient>
              </View>
            </TouchableOpacity>

            {/* 사장님 카드 */}
            <TouchableOpacity
              style={styles.roleCard}
              onPress={() => onSelectRole("maker")}
              onPressIn={() => {
                setMakerPressed(true);
                startGlitterAnimation(false);
              }}
              onPressOut={() => setMakerPressed(false)}
              activeOpacity={1}
            >
              <View
                style={[styles.cardContainer3D, makerPressed && styles.pressed]}
              >
                <LinearGradient
                  colors={["#f0fdf4", "#dcfce7", "#bbf7d0"]}
                  style={styles.cardBackground}
                >
                  <LinearGradient
                    colors={
                      makerPressed
                        ? ["#ffd480", "#ffc947", "#fec566"]
                        : ["#fec566", "#38cca2", "#10b981"]
                    }
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.gradientOverlay}
                  >
                    {/* 글리터 효과 */}
                    {makerPressed &&
                      glitterAnimations.map((anim, index) => (
                        <Animated.View
                          key={index}
                          style={[
                            styles.glitterContainer,
                            {
                              opacity: anim,
                              transform: [
                                {
                                  translateY: anim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, -30],
                                  }),
                                },
                                {
                                  scale: anim.interpolate({
                                    inputRange: [0, 0.5, 1],
                                    outputRange: [0, 1.5, 0],
                                  }),
                                },
                              ],
                              left: `${(index * 12 + 10) % 80}%`,
                              top: `${(index * 15 + 20) % 60}%`,
                            },
                          ]}
                        >
                          <GlitterParticle style={{}} />
                        </Animated.View>
                      ))}

                    {/* 장식 요소들 */}
                    <View style={[styles.decorCircle, styles.decorCircle1]} />
                    <View style={[styles.decorCircle, styles.decorCircle2]} />
                    <View style={[styles.decorCircle, styles.decorCircle3]} />

                    <View style={styles.cardContent}>
                      {/* 배지 - 카드 밖으로 이동 */}
                      <View style={[styles.badge, styles.makerBadge]}>
                        <Text style={styles.badgeText}>BUSINESS</Text>
                      </View>

                      {/* 캐릭터 영역 */}
                      <View style={styles.characterContainer}>
                        <View style={styles.characterBg}>
                          <MakerProfileIcon width={52} height={52} />
                        </View>
                      </View>

                      {/* 텍스트 영역 */}
                      <View style={styles.textContainer}>
                        <Text
                          style={[
                            styles.roleTitle,
                            { fontSize: width * 0.048 },
                          ]}
                        >
                          사장님으로 가입하기
                        </Text>
                        <Text
                          style={[
                            styles.roleDescription,
                            { fontSize: width * 0.029 },
                          ]}
                        >
                          고객 콘텐츠로 가게 홍보와{"\n"}메뉴판 꾸미기의 효과
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </LinearGradient>
              </View>
            </TouchableOpacity>
          </View>

          {/* 뒤로가기 */}
          <TouchableOpacity
            style={[styles.backButton, { marginTop: height * 0.035 }]}
            onPress={onBack}
          >
            <Text style={[styles.backText, { fontSize: width * 0.033 }]}>
              로그인으로 돌아가기
            </Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  headerContainer: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  mainTitle: {
    color: "#1e293b",
    textAlign: "center",
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  subtitle: {
    color: "#64748b",
    textAlign: "center",
    fontWeight: "500",
    lineHeight: 16,
    opacity: 0.8,
  },
  cardContainer: {
    flex: 1,
    paddingHorizontal: 8,
  },
  roleCard: {
    borderRadius: 28,
    overflow: "visible",
  },
  cardContainer3D: {
    borderRadius: 28,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 12,
    transform: [{ translateY: 0 }],
  },
  pressed: {
    transform: [{ translateY: -4 }, { scale: 1.015 }],
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 16,
  },
  cardBackground: {
    borderRadius: 28,
    overflow: "hidden",
  },
  gradientOverlay: {
    borderRadius: 28,
    padding: 20,
    minHeight: 140,
    position: "relative",
    overflow: "hidden",
  },
  decorCircle: {
    position: "absolute",
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    borderRadius: 50,
  },
  decorCircle1: {
    width: 50,
    height: 50,
    top: -12,
    right: -12,
  },
  decorCircle2: {
    width: 35,
    height: 35,
    bottom: 12,
    left: -8,
  },
  decorCircle3: {
    width: 25,
    height: 25,
    top: 35,
    left: 12,
    opacity: 0.8,
  },
  cardContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -35,
    right: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 20,
  },
  eaterBadge: {
    backgroundColor: "rgba(252, 111, 174, 0.9)",
  },
  makerBadge: {
    backgroundColor: "rgba(254, 197, 102, 0.9)",
  },
  badgeText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 0.5,
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  characterContainer: {
    alignItems: "center",
    marginBottom: 14,
    position: "relative",
  },
  characterBg: {
    width: 70,
    height: 70,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  textContainer: {
    alignItems: "center",
  },
  roleTitle: {
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.25)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  roleDescription: {
    color: "rgba(255, 255, 255, 0.95)",
    lineHeight: 18,
    fontWeight: "600",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.1)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  backButton: {
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 28,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    marginHorizontal: 32,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  backText: {
    color: "#475569",
    fontWeight: "600",
    letterSpacing: -0.2,
  },
  // 글리터 효과 스타일
  glitterContainer: {
    position: "absolute",
    zIndex: 15,
  },
  glitterParticle: {
    width: 8,
    height: 8,
    backgroundColor: "#fff",
    borderRadius: 4,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
});
