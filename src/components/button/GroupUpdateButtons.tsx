"use client";
import { GROUP_API_URLS } from "@/constants/api/group";
import { Button } from "@heroui/button";
import { ROUTES } from "@/constants/routes";
import { DELETE, PUT } from "@/lib/axiosInstans";
import Link from "next/link";

export function GroupDeleteButton({ groupSeq }: { groupSeq: number }) {
  const handleGroupDelete = async ({ groupSeq }: { groupSeq: number }) => {
    try {
      const response = await DELETE(GROUP_API_URLS.GROUP + `?groupSeq=${groupSeq}`);

      console.log(response, "response");
    } catch (error) {
      console.error(error);
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
