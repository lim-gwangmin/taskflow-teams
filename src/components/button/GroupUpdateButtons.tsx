"use client";
import Link from "next/link";
import { GROUP_API_URLS } from "@/constants/api/group";
import { Button } from "@heroui/button";
import { ROUTES } from "@/constants/routes";
import { DELETE } from "@/lib/axiosInstans";
import { toast } from "sonner";
import { SuccessResponse } from "@/types/response_type";
import useCustomRouter from "@/hooks/useCustomRouter";

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

export function GroupUpdateButton({ groupSeq }: { groupSeq: number }) {
  const { GROUP, EDIT } = ROUTES;
  return <Link href={`${GROUP}/${groupSeq}/${EDIT}`}>그룹수정</Link>;
}
