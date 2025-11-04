import { CSSProperties, ReactNode } from "react";
import { DROPDOWN_COLOR_TYPE, DROPDOWN_STYLE_TYPE } from "@/components/dropdown/types";
import { Role } from "@prisma/client";

/* ========== 컴포넌트 props 타입 정의 ========== */

// 헤더 타입 정의
export type HeaderProps_type = {
  user: string | null;
  email: string;
};
// 헤더 드롭다운 타입 정의
export type DropDownProps_type = {
  title: string | null;
  color?: DROPDOWN_COLOR_TYPE;
  variant?: DROPDOWN_STYLE_TYPE;
  disabledKeys?: Array<string>;
  children?: ReactNode;
};

// 레이아웃 컨테이너 타입 정의
export type ContainerProps_type = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
};

/* ========== 그룹관련 타입 정의 ========== */
// 그룹 조회 함수 파라미터 타입
export type GroupSearchParams = {
  groupName?: string;
  currentPage?: number;
  pageLimit?: number;
};
// 탭 리스트 타입
export type GroupList = {
  title: string;
  params: string;
};
// 탭 클릭 타입
export type TabClickHandler = (arg: GroupSearchParams) => Promise<void>;
// 그룹 상세페이지 파라미터 타입
export type GroupParamsType = {
  params: {
    groupSeq: string;
  };
};
// 그룹 상세페이지 그룹데이터 타입
export type GroupDetailDataType = {
  groupDatas: {
    group: {
      name: string;
      no: number;
      createdAt: Date;
      description: string;
      userLimit: number;
    };
    user: { nickname: string; discriminator: string };
    groupSeq: number;
    joinedAt: Date;
    role: Role;
  };
};
