"use client";
import Link from "next/link";
import { GROUP_API_URLS } from "@/constants/api/group";
import { Button } from "@heroui/button";
import { ROUTES } from "@/constants/routes";
import { DELETE, POST } from "@/lib/axiosInstans";
import { toast } from "sonner";
import useLoader from "@/hooks/useLoader";
import { SuccessResponse } from "@/types/response_type";
import useCustomRouter from "@/hooks/useCustomRouter";
import { MEMBER_SHIP_CONSTANTS } from "@/constants/group";

// 그룹 삭제
export function GroupDeleteButton({ groupSeq }: { groupSeq: number }) {
  const { handleBackRoute } = useCustomRouter();

  const handleGroupDelete = async ({ groupSeq }: { groupSeq: number }) => {
    try {
      const response = await DELETE<SuccessResponse>(GROUP_API_URLS.GROUP + `?groupSeq=${groupSeq}`);

      const { data, success, error } = response;

      if (!success) {
        toast.error(error.message);
        throw new Error("오류가 발생했습니다.");
      }

      toast.success(data.message);
      handleBackRoute();
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  return (
    <Button color="danger" type="button" onPress={() => handleGroupDelete({ groupSeq })}>
      그룹삭제
    </Button>
  );
}

// 그룹 수정
export function GroupUpdateButton({ groupSeq }: { groupSeq: number }) {
  const { GROUP, EDIT } = ROUTES;
  return <Link href={`${GROUP}/${groupSeq}/${EDIT}`}>그룹수정</Link>;
}

// 유저 => 그룹 가입 신청
export function GroupPermissionRequestButton({ groupSeq }: { groupSeq: number }) {
  const { setIsLoading } = useLoader(false);
  const requestType = MEMBER_SHIP_CONSTANTS.REQUEST.TYPE.APPLICATION;

  // 그룹 가입 신청 이벤트
  const handleGroupRequest = async () => {
    setIsLoading(true);

    try {
      const response = await POST<SuccessResponse>(GROUP_API_URLS.MEMBER_SHIP, { groupSeq, requestType });

      const { success, error, data } = response;

      console.log(response);

      if (error) {
        console.error(error.message);
        toast.error(error.message);
        throw new Error(error.message);
      }

      toast.success(data.message);
    } catch (error) {
      console.error("asd", error);
    } finally {
      setIsLoading(false);
    }
  };

  return <button onClick={handleGroupRequest}>가입 신청</button>;
}
