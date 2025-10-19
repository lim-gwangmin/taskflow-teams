import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { User } from "@prisma/client";
// 쿠키 유저 정보 타입
export type CurrentUser = User | null;

// 유저 정보 조회
export const getCurrentUser = async (): Promise<CurrentUser> => {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");

  if (!tokenCookie) {
    return null;
  }

  const secret = process.env.JWT_SECRET!;
  const decoded = verify(tokenCookie.value, secret);

  try {
    if (typeof decoded === "object" && "userId" in decoded) {
      const userId = decoded.userId as number;
      const currentUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      return currentUser;
    }

    return null;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};
