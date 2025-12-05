import { prisma } from "../prisma";
import { getCurrentUser } from "@/services/auth";
import { COMMON_COMMENTS, GROUP_COMMENTS } from "@/constants/comments";
import { notFound } from "next/navigation";

const { SERVER_ERROR } = COMMON_COMMENTS.SERVER;
const { CURRENT_USER } = COMMON_COMMENTS.AUTH;
const { SUCCESS_200, ERROR_401, ERROR_402, ERROR_500 } = GROUP_COMMENTS.SEARCH;

type GroupSeqParamsType = { groupSeq: number };

export async function fetchDetailGroup({ groupSeq }: GroupSeqParamsType) {
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
    const { seq: userSeq } = currentUser;

    const [membership, memberList] = await prisma.$transaction([
      prisma.membership.findFirst({
        where: { userSeq, groupSeq, group: { seq: groupSeq } },
        select: {
          groupSeq: true,
          role: true,
          joinedAt: true,
          group: {
            select: {
              name: true,
              no: true,
              createdAt: true,
              description: true,
              userLimit: true,
            },
          },
          user: { select: { nickname: true, discriminator: true } },
        },
      }),
      prisma.membership.findMany({
        where: {
          groupSeq,
          userSeq: { not: userSeq },
        },
        select: {
          role: true,
          joinedAt: true,
          user: {
            select: {
              seq: true,
              email: true,
              nickname: true,
              discriminator: true,
            },
          },
        },
      }),
    ]);
    if (!membership) {
      // 결과가 없으면, 그룹 자체가 없는지 or 권한만 없는지 구분 필요 시 추가 쿼리
      const groupExists = await prisma.group.count({ where: { seq: groupSeq } });
      if (groupExists === 0) {
        // 그룹 없음
        console.error(SERVER_ERROR, ERROR_401);
        notFound();
      } else {
        // 권한 없음
        return { success: false, data: null, error: { message: ERROR_402 } };
      }
    }

    return {
      success: true,
      data: {
        message: SUCCESS_200,
        result: {
          membership,
          memberList,
        },
      },
      error: null,
    };
  } catch (error: any) {
    console.error(SERVER_ERROR, ERROR_500, error);
    notFound();
  }
}
