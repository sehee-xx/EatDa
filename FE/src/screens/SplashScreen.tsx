import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import { Video, AVPlaybackStatus, ResizeMode } from "expo-av";
import { COLORS, textStyles } from "../constants/theme";

type SplashScreenProps = {
  onFinish: () => void;
};

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const { width: rawWidth, height: rawHeight } = useWindowDimensions();
  const width = Math.round(rawWidth);
  const height = Math.round(rawHeight);

  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    // 5초 동안 보여주고 종료
    const timer = setTimeout(() => {
      console.log("5 seconds completed, proceeding to app");
      onFinish();
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [onFinish]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      // 비디오가 끝나면 다시 처음부터 재생 (루프 효과)
      if (status.didJustFinish) {
        console.log("Video loop completed, restarting...");
        // 비디오 재시작은 isLooping={true}로 자동 처리됨
      }
    }
  };

  const handleLoad = () => {
    console.log("Video loaded successfully!");
    setVideoReady(true);
  };

  return (
    <View style={styles.container}>
      {/* 배경 */}
      <View style={[styles.background, { width, height }]} />

      {/* 비디오 - 화면을 거의 채우는 크기로 */}
      <View
        style={[
          styles.videoContainer,
          { width: width * 0.8, height: width * 0.8 },
        ]}
      >
        <Video
          source={require("../../assets/intro.mov")}
          style={[styles.video, { width: width * 0.8, height: width * 0.8 }]}
          shouldPlay={true}
          isLooping={true} // 루프 활성화
          useNativeControls={false} // 컨트롤 숨기기
          resizeMode={ResizeMode.CONTAIN}
          volume={0} // 음소거
          onLoad={handleLoad}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />
      </View>

      {/* 로고 - 각 글자별 색상 */}
      <View style={styles.logoContainer}>
        <View style={styles.logoTextContainer}>
          <Text
            style={[
              textStyles.logo,
              styles.logoChar,
              { fontSize: width * 0.15, color: COLORS.primaryEater },
            ]}
          >
            E
          </Text>
          <Text
            style={[
              textStyles.logo,
              styles.logoChar,
              { fontSize: width * 0.2, color: COLORS.secondaryMaker },
            ]}
          >
            a
          </Text>
          <Text
            style={[
              textStyles.logo,
              styles.logoChar,
              { fontSize: width * 0.15, color: COLORS.primaryMaker },
            ]}
          >
            t
          </Text>
          <Text
            style={[
              textStyles.logo,
              styles.logoChar,
              { fontSize: width * 0.2, color: COLORS.secondaryEater },
            ]}
          >
            D
          </Text>
          <Text
            style={[
              textStyles.logo,
              styles.logoChar,
              { fontSize: width * 0.15, color: COLORS.primaryEater },
            ]}
          >
            a
          </Text>
          <Text
            style={[
              textStyles.logo,
              styles.logoChar,
              { fontSize: width * 0.2, color: COLORS.primaryMaker },
            ]}
          >
            !
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#fff",
  },
  videoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 50,
  },
  video: {
    // 동적 크기는 인라인 스타일로 적용됨
  },
  logoContainer: {
    alignItems: "center",
  },
  logoTextContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logoChar: {
    textShadowColor: "rgba(0,0,0,0.1)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  debugInfo: {
    fontSize: 12,
    color: "#666",
    marginTop: 10,
    textAlign: "center",
  },
});
