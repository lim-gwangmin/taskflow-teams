// 쿠키 유저 정보 타입
export type CurrentUserSchema = {
  seq: number;
  name: string;
  email: string;
  nickname: string;
  discriminator: string;
} | null;
