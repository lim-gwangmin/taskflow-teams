import { prisma } from "../prisma";
import { getCurrentUser } from "@/services/auth";
import { notFound } from "next/navigation";
import { COMMON_COMMENTS } from "@/constants/comments";

const { SERVER_ERROR } = COMMON_COMMENTS.SERVER;
const { CURRENT_USER } = COMMON_COMMENTS.AUTH;

export async function getProfile() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return {
        success: false,
        data: null,
        error: { message: CURRENT_USER },
      };
    }

    const { seq, name, email, nickname, discriminator } = currentUser;

    const getUserData = await prisma.user.findFirst({
      where: { seq, nickname, discriminator },
      select: { name: true, email: true, nickname: true, discriminator: true },
    });

    if (!getUserData) {
      // throw Error('유저 정보를 가져오는데 오류가 발생했습니다.');
      return { success: false, data: null, error: { message: "유저 정보를 가져오는데 오류가 발생했습니다." } };
    }

    return {
      success: true,
      data: { message: "유저 정보를 성공적으로 불러왔습니다.", result: getUserData },
      error: null,
    };
  } catch (error) {
    console.error(SERVER_ERROR, error);
    notFound();
  }
}
