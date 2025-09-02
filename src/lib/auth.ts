
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { prisma } from '@/lib/prisma'; // Prisma 클라이언트 (예시)

// 유저 정보 조회
export const getCurrentUser = async () => {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get('token');

    if (!tokenCookie) {
        return null;
    };
    
    const secret = process.env.JWT_SECRET!;
    const decoded = verify(tokenCookie.value, secret);

    try {
        if (typeof decoded === 'object' && 'userId' in decoded) {
            const userId = decoded.userId as number; // userId의 타입까지 명확히 해줄 수 있음
            const currentUser = await prisma.user.findUnique({
                where: { id: userId },
            });

            return currentUser
        }

        return null
    } catch(error) {
        console.error('Invalid token:', error);
        return null
    } 
};