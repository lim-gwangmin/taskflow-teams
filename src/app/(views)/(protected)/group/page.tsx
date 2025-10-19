"use client";

import { useRef, FormEvent, useState, useEffect } from "react";
import useLoader from "@/hooks/useLoader";
import { toast } from "sonner";
import { POST, GET, DELETE } from "@/lib/axiosInstans";
import { ROUTES } from "@/constants/routes";
import { GROUP_API_URLS } from "@/constants/api/group";
import { SuccessResponse, GroupListResponse, GroupWhitMembership } from "@/types/response_type";
import TabMenu from "@/components/tabmenu/TabMenu";

const menuItems = [
  { title: "전체", params: "" },
  { title: "관리", params: "admin" },
  { title: "내 그룹", params: "user" },
];

type GroupSearchParams = {
  groupName?: string;
  currentPage: number;
  pageLimit: number;
};

export default function GropPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const { setIsLoading } = useLoader(false);
  const [groups, setGroups] = useState<GroupWhitMembership[]>([]);

  // 그룹 생성
  const submitCreateGroup = async (e: FormEvent<HTMLElement>): Promise<void> => {
    e.preventDefault();

    setIsLoading(true);

    const groupNameInput = formRef.current?.elements.namedItem("groupName") as HTMLInputElement;
    const groupName = groupNameInput.value;

    try {
      const response = await POST<SuccessResponse>(GROUP_API_URLS.GROUP, { groupName });
      const { success, data, error } = response;

      if (!success) {
        toast.error(error.message);
        throw new Error(error.message);
      }

      toast.success(data.message);
    } catch (error) {
      console.error(error, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // 그룹 조회
  const handleSearchGroup = async ({
    groupName = "",
    currentPage = 1,
    pageLimit = 5,
  }: GroupSearchParams): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await GET<GroupListResponse>(
        GROUP_API_URLS.GROUP + `?groupName=${groupName}&currentPage=${currentPage}&pageLimit=${pageLimit}`
      );
      const { success, data, error } = response;

      if (!success) {
        throw new Error(error.message);
      }

      const groupData = data.groups || [];
      setGroups(groupData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 그룹 삭제
  const handleDeletedGrop = async ({ groupSeq }) => {
    setIsLoading(true);
    try {
      const response = await DELETE<GroupListResponse>(GROUP_API_URLS.GROUP + `?groupSeq=${groupSeq}`);
      const { success, data, error } = response;

      if (!success) {
        toast.error(error.message);
        throw new Error(error.message);
      }

      toast.success(data.message);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      group page
      {/* 그룹 생성 */}
      <form ref={formRef} onSubmit={submitCreateGroup}>
        <input type="text" name="groupName" placeholder="그룹명을 입력해주세요." />
        <button type="submit">그룹생성</button>
      </form>
      {/* 탭메뉴 */}
      <TabMenu menus={menuItems} onClick={handleSearchGroup} />
      {/* 그룹 리스트 */}
      {groups.map((arg, index) => (
        <div key={index}>
          <p>순서: {index + 1}</p>
          <p>그룹명: {arg.group.name}</p>
          <p>그룹장: {arg.userEmail}</p>
          <button onClick={() => handleDeletedGrop({ groupSeq: arg.groupSeq })}>삭제</button>
        </div>
      ))}
    </>
  );
}
