import { cookies } from "next/headers";
import { verify } from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

// 쿠키 유저 정보 타입
export type CurrentUserSchema = {
  seq: number;
  name: string;
  email: string;
  nickname: string;
  discriminator: string;
} | null;

// 유저 정보 조회
export const getCurrentUser = async (): Promise<CurrentUserSchema> => {
  const cookieStore = await cookies();
  const tokenCookie = cookieStore.get("token");

  if (!tokenCookie) {
    return null;
  }

  const secret = process.env.JWT_SECRET!;
  const decoded = verify(tokenCookie.value, secret);

  try {
    if (typeof decoded === "object" && "userSeq" in decoded) {
      const userSeq = decoded.userSeq as number;
      const currentUser = await prisma.user.findUnique({
        where: { seq: userSeq },
        select: {
          seq: true,
          name: true,
          email: true,
          nickname: true,
          discriminator: true,
        },
      });
      return currentUser;
    }
    cookieStore.delete("token");
    return null;
  } catch (error) {
    console.error("Invalid token:", error);
    cookieStore.delete("token");
    return null;
  }
};
