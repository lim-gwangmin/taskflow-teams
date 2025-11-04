import { Group } from "@prisma/client";

// API 요청 성공 제네릭 타입.
export interface SuccessResponse {
  message: string;
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

// 그룹 수정 response 타입

// 그룹 상세 조회 response 타입
// export interface GroupDetailResponse extends SuccessResponse {
//   groupDatas?: GroupWhitMembership[];
// }
