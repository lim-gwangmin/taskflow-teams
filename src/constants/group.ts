export const GROUP_CONSTANTS = {} as const;

// 멤버십 관련 상수
export const MEMBER_SHIP_CONSTANTS = {
  REQUEST: {
    STATUS: {
      PENDING: "PENDING",
      APPROVED: "APPROVED",
      DENIED: "DENIED",
    },
    TYPE: {
      APPLICATION: "APPLICATION",
      INVITATION: "INVITATION",
    },
  },
} as const;
