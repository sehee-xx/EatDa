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
import MakerMypageDetail from "./MakerMypageDetail";

// 배경 이미지 import
const maker_background = require("../../../assets/maker_background.png");
const MakerProfileIcon = require("../../../assets/maker-profile.svg");

// 통계 카드용 아이콘들 (임시로 기존 아이콘 사용, 나중에 적절한 아이콘으로 교체)
const ReviewIcon = require("../../../assets/3d-sms.png");
const EventIcon = require("../../../assets/3d-invitation.png");
const MenuIcon = require("../../../assets/3d-sms.png");

// MakerMypageDetail과 동일한 TabKey 사용
type TabKey = "storeReviews" | "storeEvents" | "receivedMenuBoard";

interface MakerMypageProps {
  onLogout: () => void;
}

export default function MakerMyPage({ onLogout }: MakerMypageProps) {
  const { width } = useWindowDimensions();
  const [showDetail, setShowDetail] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("storeReviews");

  // Maker 전용 데이터 개수 계산 (TabKey 순서로 정리)
  const tabData = {
    storeReviews: {
      data: reviewData.slice(6, 12),
      label: "가게 리뷰 보기"
    },
    storeEvents: {
      data: reviewData.slice(12, 15),
      label: "가게 이벤트 보기"
    },
    receivedMenuBoard: {
      data: [],
      label: "받은 메뉴판"
    }
  };

  // Maker 전용 설정
  const backgroundImage = maker_background;

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
      <MakerMypageDetail 
        userRole="maker"
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
            userRole="maker"
            onLogout={onLogout}
            onMypage={() => {}}
          />
        </TouchableOpacity>
        <HeaderLogo />
      </View>

      <ScrollView style={styles.content}>
        {/* 프로필 섹션 (핑크색 배경) */}
        <View style={styles.profileSection}>
          <Image source={backgroundImage} style={styles.backgroundImage} />
          <View style={styles.profileContent}>
            <MypageProfile 
              userRole="maker"
              nickname="Sol"
            />
            
            {/* 통계 카드들 - 타입으로 라벨 결정 */}
            <View style={styles.statsContainer}>
              <StatsCard
                type="리뷰"
                count={tabData.storeReviews.data.length}
              />
              <StatsCard
                type="스크랩"
                count={tabData.storeEvents.data.length}
              />
              <StatsCard
                type="메뉴판"
                count={tabData.receivedMenuBoard.data.length}
              />
            </View>
          </View>
        </View>

        {/* 카테고리 섹션 - TabKey에 따른 내용 */}
        <View style={styles.categorySection}>
          <CategoryCard
            icon={ReviewIcon}
            title={tabData.storeReviews.label}
            count={tabData.storeReviews.data.length}
            onPress={() => handleCategoryPress("storeReviews")}
          />
          <CategoryCard
            icon={EventIcon}
            title={tabData.storeEvents.label}
            count={tabData.storeEvents.data.length}
            onPress={() => handleCategoryPress("storeEvents")}
          />
          <CategoryCard
            icon={MenuIcon}
            title={tabData.receivedMenuBoard.label}
            count={tabData.receivedMenuBoard.data.length}
            onPress={() => handleCategoryPress("receivedMenuBoard")}
          />
        </View>

        {/* 최근 활동 섹션 */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>최근 활동</Text>
          
          <ActivityCard
            icon={ReviewIcon}
            text="가게 리뷰가 등록되었습니다"
            time="2시간 전"
            onPress={() => console.log("활동 1 클릭")}
          />
          
          <ActivityCard
            icon={MenuIcon}
            text="받은 메뉴판이 업데이트되었습니다"
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
