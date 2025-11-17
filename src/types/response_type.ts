import { Group, MembershipRequest } from "@prisma/client";

// API 요청 성공 제네릭 타입.
export interface SuccessResponse {
  message: string;
}

export type CurrentUserSchema = {
  seq: number;
  email: string;
  name: string;
  nickname: string;
  discriminator: string;
};

// 로그인 데이터 response 타입
export interface LoginResponse extends SuccessResponse {
  user: CurrentUserSchema;
}

/* =========== 그룹 관련 타입 정의 ============== */

// 그룹 조회 데이터 타입
export interface GroupList {
  seq: number;
  no: number;
  name: string;
  createdAt: Date;
  user: {
    nickname: string;
    discriminator: string;
  };
}

// 그룹 조회 response 타입
export interface GroupListResponse extends SuccessResponse {
  groups?: GroupList[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
  };
}

export type MemberRequestItem = {
  seq: number;
  userSeq: number;
  groupSeq: number;
  status: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  group: {
    name: string;
    description: string;
    seq: number;
  };
  user: {
    seq: number;
    name: string;
    nickname: string;
    discriminator: string;
  };
};
// 그룹 수정 response 타입
export interface MemberShipResponse extends SuccessResponse {
  result: MemberRequestItem[];
  // pagination?: {
  //   currentPage: number;
  //   totalPages: number;
  //   totalCount: number;
  //   hasPrevPage: boolean;
  //   hasNextPage: boolean;
  // };
}
