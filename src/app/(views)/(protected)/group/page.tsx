"use client";

import { useRef, FormEvent, useState, useEffect } from "react";
import useLoader from "@/hooks/useLoader";
import { toast } from "sonner";
import { POST, GET } from "@/lib/axiosInstans";
import { ROUTES } from "@/constants/routes";
import { GROUP_API_URLS } from "@/constants/api/group";
import { SuccessResponse, GroupListResponse, GroupList } from "@/types/response_type";
import { GroupSearchParams } from "@/types/components";
import useCustomRouter from "@/hooks/useCustomRouter";
import { Pagination, Spinner } from "@heroui/react";

const menuItems = [
  { title: "전체", params: "" },
  { title: "관리", params: "admin" },
  { title: "내 그룹", params: "viewer" },
];

export default function GropPage() {
  const formRef = useRef<HTMLFormElement>(null);
  const { handleRoute } = useCustomRouter();
  const { isLoading, setIsLoading } = useLoader(false);
  const [groups, setGroups] = useState<GroupList[]>([]);
  const [groupSearch, setGroupSearch] = useState({
    groupName: "",
    role: "",
  });
  const [pagination, setpPagination] = useState<GroupListResponse["pagination"]>({
    currentPage: 1,
    totalPages: 1,
    totalCount: 1,
    hasPrevPage: false,
    hasNextPage: false,
  });

  useEffect(() => {
    handleSearchGroup({});
  }, []);
  // 그룹 생성
  const submitCreateGroup = async (e: FormEvent<HTMLElement>): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);

    if (!formRef.current) {
      throw new Error("formRef.current 속성이 없습니다.");
    }

    const formData = new FormData(formRef.current);
    const groupName = formData.get("groupName");
    const description = formData.get("description");
    const userLimit = formData.get("userLimit");

    try {
      const response = await POST<SuccessResponse>(GROUP_API_URLS.GROUP, { groupName, description, userLimit });
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
    role = "",
    currentPage = 1,
    pageLimit = 5,
  }: GroupSearchParams): Promise<void> => {
    setIsLoading(true);
    try {
      setGroupSearch({ groupName, role });
      const response = await GET<GroupListResponse>(
        GROUP_API_URLS.GROUP + `?groupName=${groupName}&role=${role}&currentPage=${currentPage}&pageLimit=${pageLimit}`
      );
      const { success, data, error } = response;

      if (!success) {
        throw new Error(error.message);
      }

      const groupData = data.groups || [];
      const paginationData = data.pagination;
      setGroups(groupData);
      setpPagination(paginationData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  // 그룹 상세페이지 이동
  const handleMoveToGroupDetailPage = ({ seq }: { seq: number }) => {
    handleRoute(ROUTES.GROUP + `/${seq}`);
  };

  return (
    <>
      <h2 style={{ fontSize: "20px", fontWeight: "bold" }}>그룹 생성 영역</h2>
      {/* 그룹 생성 */}
      <form ref={formRef} onSubmit={submitCreateGroup}>
        <section>
          <h4>그룹명</h4>
          <input type="text" name="groupName" placeholder="그룹명을 입력해주세요." />
        </section>
        <section>
          <h4>그룹 인원 제한</h4>
          <input type="number" min={2} max={50} defaultValue={2} name="userLimit" placeholder="인원 제한 설정" />
        </section>
        <section>
          <h4>그룹 소개</h4>
          <textarea name="description" placeholder="내 그룹을 설명해주세요." />
        </section>
        <button type="submit">그룹생성</button>
      </form>
      <h2 style={{ fontSize: "20px", fontWeight: "bold", borderTop: "2px solid #333" }}>그룹 조회 영역</h2>
      {/* 탭메뉴 */}
      <button onClick={() => handleSearchGroup({})}>전체</button>
      <button onClick={() => handleSearchGroup({ ...groupSearch, role: "ADMIN" })}>관리</button>
      <button onClick={() => handleSearchGroup({ ...groupSearch, role: "GUEST" })}>가입</button>
      {/* <TabMenu menus={menuItems} onClick={handleSearchGroup} /> */}
      {isLoading ? (
        <Spinner size="lg" />
      ) : (
        <ul>
          {/* 그룹 리스트 */}
          {groups.map((group, index) => (
            <li key={index}>
              <button onClick={() => handleMoveToGroupDetailPage({ seq: group.seq })} type="button">
                <p>순서: {index + 1}</p>
                <p>그룹명: {group.name}</p>
                <p>
                  그룹장: {group.user.nickname}#{group.user.discriminator}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}
      {pagination && groups.length ? (
        <Pagination
          color="secondary"
          initialPage={pagination.currentPage}
          page={pagination.currentPage}
          total={pagination.totalPages}
          onChange={(currentPage) => {
            handleSearchGroup({ ...groupSearch, currentPage });
          }}
        />
      ) : (
        <></>
      )}
    </>
  );
}
