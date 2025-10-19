import { CSSProperties, ReactNode } from "react";
import { DROPDOWN_COLOR_TYPE, DROPDOWN_STYLE_TYPE } from "@/components/dropdown/types";

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
