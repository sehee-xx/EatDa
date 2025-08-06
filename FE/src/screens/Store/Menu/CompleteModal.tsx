// 5. CompleteModal.tsx
import React from "react";
import AICompleteModal from "../../../components/AICompleteModal";

interface CompleteProps {
  visible: boolean;
  onClose: () => void;
  generatedContent?: string | null;
  menuInfo?: string;
  contentType?: "image" | "video" | null;
  reviewText?: string;
  onConfirm?: () => void; // 저장하기 버튼 핸들러
  onCancel?: () => void; // 취소 버튼 핸들러
}

export default function CompleteModal({
  visible,
  onClose,
  generatedContent,
  onConfirm,
  onCancel,
}: CompleteProps) {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    } else {
      onClose();
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      onClose();
    }
  };

  return (
    <AICompleteModal
      visible={visible}
      onClose={onClose}
      generatedContent={generatedContent}
      title="메뉴판 생성 완료!"
      subtitle="사장님께 메뉴판을 전송하시겠습니까?"
      confirmButtonText="전송하기"
      cancelButtonText="취소"
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );
}
