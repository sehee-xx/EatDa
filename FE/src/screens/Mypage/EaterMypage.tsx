import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from "react-native";
import { COLORS, SPACING } from "../../constants/theme";
import HeaderLogo from "../../components/HeaderLogo";
import Hamburger from "../../components/Hamburger";
import StatsCard from "../../components/StatsCard";
import ActivityCard from "../../components/ActivityCard";
import CategoryCard from "../../components/CategoryCard";
import MypageProfile from "../../components/MypageProfile";
import { reviewData } from "../../data/reviewData";
import EaterMypageDetail from "./EaterMypageDetail";

// 배경 이미지 import
const eater_background = require("../../../assets/eater_background.png");
const EaterProfileIcon = require("../../../assets/eater-profile.svg");

// 통계 카드용 아이콘들 (임시로 기존 아이콘 사용, 나중에 적절한 아이콘으로 교체)
const ReviewIcon = require("../../../assets/3d-sms.png");
const EventIcon = require("../../../assets/3d-camera.png");
const MenuIcon = require("../../../assets/3d-invitation.png");

// EaterMypageDetail과 동일한 TabKey 사용
type TabKey = "myReviews" | "scrappedReviews" | "myMenuBoard";

interface EaterMypageProps {
  onLogout: () => void;
}

export default function EaterMypage({ onLogout }: EaterMypageProps) {
  const { width } = useWindowDimensions();
  const [showDetail, setShowDetail] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("myReviews");

  // Eater 전용 데이터 개수 계산 (TabKey 순서로 정리)
  const tabData = {
    myReviews: {
      data: reviewData.slice(0, 6),
      label: "내가 남긴 리뷰"
    },
    scrappedReviews: {
      data: reviewData.slice(6, 10),
      label: "스크랩 한 리뷰"
    },
    myMenuBoard: {
      data: [],
      label: "내가 만든 메뉴판"
    }
  };

  // Eater 전용 설정
  const backgroundImage = eater_background;

  // CategoryCard 클릭 핸들러
  const handleCategoryPress = (tabKey: TabKey) => {
    setActiveTab(tabKey);
    setShowDetail(true);
  };

  // Detail 화면에서 뒤로가기
  const handleBackToMain = () => {
    setShowDetail(false);
  };

  // Detail 화면 표시
  if (showDetail) {
    return (
      <EaterMypageDetail 
        userRole="eater"
        onLogout={onLogout}
        initialTab={activeTab}
        onBack={handleBackToMain}
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* 헤더 */}
      <View style={styles.headerContainer}> 
        <TouchableOpacity>
          <Hamburger
            userRole="eater"
            onLogout={onLogout}
            onMypage={() => {}} // 이미 마이페이지에 있으므로 빈 함수
          />
        </TouchableOpacity>
        <HeaderLogo />
      </View>

      <ScrollView style={styles.content}>
        {/* 프로필 섹션 (노란색 배경) */}
        <View style={styles.profileSection}>
          <Image source={backgroundImage} style={styles.backgroundImage} />
          <View style={styles.profileContent}>
            <MypageProfile 
              userRole="eater"
              nickname="Sol"
            />
            
            {/* 통계 카드들 - 타입으로 라벨 결정 */}
            <View style={styles.statsContainer}>
              <StatsCard
                type="리뷰"
                count={tabData.myReviews.data.length}
              />
              <StatsCard
                type="스크랩"
                count={tabData.scrappedReviews.data.length}
              />
              <StatsCard
                type="메뉴판"
                count={tabData.myMenuBoard.data.length}
              />
            </View>
          </View>
        </View>

        {/* 카테고리 섹션 - TabKey에 따른 내용 */}
        <View style={styles.categorySection}>
          <CategoryCard
            icon={ReviewIcon}
            title={tabData.myReviews.label}
            count={tabData.myReviews.data.length}
            onPress={() => handleCategoryPress("myReviews")}
          />
          <CategoryCard
            icon={EventIcon}
            title={tabData.scrappedReviews.label}
            count={tabData.scrappedReviews.data.length}
            onPress={() => handleCategoryPress("scrappedReviews")}
          />
          <CategoryCard
            icon={MenuIcon}
            title={tabData.myMenuBoard.label}
            count={tabData.myMenuBoard.data.length}
            onPress={() => handleCategoryPress("myMenuBoard")}
          />
        </View>

        {/* 최근 활동 섹션 - userRole에 따라 다른 텍스트 */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>최근 활동</Text>
          
          <ActivityCard
            icon={ReviewIcon}
            text="리뷰 등록이 완료되었습니다"
            time="2시간 전"
            onPress={() => console.log("활동 1 클릭")}
          />
          
          <ActivityCard
            icon={MenuIcon}
            text="내가 만든 메뉴판이 고정되었습니다"
            time="3시간 전"
            onPress={() => console.log("활동 2 클릭")}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerContainer: {
    flexDirection: "row",
    paddingTop: 40,
    backgroundColor: "#fff",
  },
  content: {
    flex: 1,
  },
  profileSection: {
    position: "relative",
    height: 300,
    marginBottom: SPACING.lg,
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%", // 크기 줄임
    height: "60%", // 크기 줄임
    alignSelf: "center", // 가운데 정렬
  },
  profileContent: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: "space-between",
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  categorySection: {
    padding: SPACING.lg,
  },
  activitySection: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.textColors.primary,
    marginBottom: SPACING.md,
  },
});
