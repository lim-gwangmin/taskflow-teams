import { Group } from "@prisma/client";

// API 요청 성공 제네릭 타입.
export interface SuccessResponse {
  message: string;
}

/* =========== 그룹 관련 타입 정의 ============== */

// 그룹 조회 데이터 타입
export interface GroupWhitMembership {
  groupSeq: number;
  role: string;
  userEmail: string;
  group: Group;
}

// 그룹 조회 response 타입
export interface GroupListResponse extends SuccessResponse {
  groups?: GroupWhitMembership[];
}
