import { prisma } from "../prisma";
import { User, Role } from "@prisma/client";
import { getCurrentUser } from "@/services/auth";
import { COMMON_COMMENTS, GROUP_COMMENTS } from "@/constants/comments";

const { SERVER_ERROR } = COMMON_COMMENTS.SERVER;
const { CURRENT_USER } = COMMON_COMMENTS.AUTH;
const { SUCCESS_200, ERROR_401, ERROR_402, ERROR_500 } = GROUP_COMMENTS.SEARCH;

export async function fetchDetailGroup({ groupSeq }: { groupSeq: number }) {
  try {
    const currentUser = await getCurrentUser();
    // 유저 인증
    if (!currentUser) {
      return {
        success: false,
        data: null,
        error: { message: CURRENT_USER },
      };
    }
    const { id: userId } = currentUser;
    // --- 한 번의 쿼리로 존재 여부와 권한을 동시에 확인 ---
    const membership = await prisma.membership.findFirst({
      where: { userId, groupSeq, group: { seq: groupSeq } },
      select: {
        groupSeq: true,
        role: true,
        userEmail: true,
        group: { select: { name: true, no: true, admin: true } },
      },
    });

    if (!membership) {
      // 결과가 없으면, 그룹 자체가 없는지 or 권한만 없는지 구분 필요 시 추가 쿼리
      const groupExists = await prisma.group.count({ where: { seq: groupSeq } });
      if (groupExists === 0) {
        return { success: false, data: null, error: { message: ERROR_401 } }; // 그룹 없음
      } else {
        return { success: false, data: null, error: { message: ERROR_402 } }; // 권한 없음
      }
    }

    // --- 성공 ---
    return {
      success: true,
      data: {
        message: SUCCESS_200,
        group: membership,
      },
      error: null,
    };
    // // 그룹 조회
    // const getSearchMembership = await prisma.membership.findFirst({
    //   where: {
    //     groupSeq,
    //     group: { seq: groupSeq },
    //   },
    // });

    // // 조회된 그룹이 없을 경우
    // if (!getSearchMembership) {
    //   return {
    //     success: false,
    //     data: null,
    //     error: { message: ERROR_401 },
    //   };
    // }
    // // 조회된 그룹에
    // const isPermissionMembership = await prisma.membership.findFirst({
    //   where: {
    //     userId,
    //     groupSeq,
    //     group: { seq: groupSeq },
    //   },
    //   select: {
    //     groupSeq: true,
    //     role: true,
    //     userEmail: true,
    //     group: {
    //       select: {
    //         name: true,
    //         no: true,
    //         admin: true,
    //       },
    //     },
    //   },
    // });

    // // 내가 해당 그룹에 권한이 있는지 체크
    // if (!isPermissionMembership) {
    //   return {
    //     success: false,
    //     data: null,
    //     error: { message: ERROR_402 },
    //   };
    // }

    // return {
    //   success: true,
    //   data: {
    //     message: SUCCESS_200,
    //     data: isPermissionMembership,
    //   },
    //   error: null,
    // };
  } catch (error: any) {
    console.error(SERVER_ERROR, ERROR_500, error);
    // 일반적인 서버 오류 처리
    return {
      success: false,
      data: null,
      error: { message: ERROR_500 },
    };
  }
}
