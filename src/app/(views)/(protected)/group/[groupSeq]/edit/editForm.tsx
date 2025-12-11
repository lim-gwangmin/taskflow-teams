"use client";
import { useRef, FormEvent } from "react";
import { formattedDate } from "@/utils/date-fns";
import { PUT } from "@/lib/axiosInstans";
import { GROUP_API_URLS } from "@/constants/api/group";
import useLoader from "@/hooks/useLoader";
import { SuccessResponse } from "@/types/response_type";
import { toast } from "sonner";
import useCustomRouter from "@/hooks/useCustomRouter";

export default function EditForm({
  groupSeq,
  membership,
  memberList,
}: {
  groupSeq: number;
  membership: any;
  memberList: object;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const { handleRoute } = useCustomRouter();
  const { setIsLoading } = useLoader(false);
  const { group, role, user } = membership;
  const joinedAt = formattedDate(membership.joinedAt);
  const createdAt = formattedDate(group.createdAt);

  const handleGroupEditSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formRef.current) {
      throw new Error("formRef.current 속성이 없습니다.");
    }

    const formData = new FormData(formRef.current);

    const groupName = formData.get("groupName");
    const groupDescription = formData.get("groupDescription");
    const groupUserLimit = formData.get("userLimit");

    try {
      const response = await PUT<SuccessResponse>(GROUP_API_URLS.GROUP, {
        groupSeq,
        groupName,
        groupDescription,
        groupUserLimit,
      });
      const { success, error, data } = response;

      if (!success) {
        toast.error(error.message);
        throw new Error(error.message);
      }

      toast.success(data.message);
      handleRoute(`/group/${groupSeq}`);
    } catch (error) {
      console.error("form submit error!: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleGroupEditSubmit}>
      <section>
        <h4>그룹명</h4>
        <input type="text" name="groupName" defaultValue={group.name} />
      </section>
      <section>
        <h4>내 권한</h4>
        <input type="text" defaultValue={role} readOnly />
      </section>
      <section>
        <h4>그룹 인원 제한</h4>
        <input
          type="number"
          min={2}
          max={50}
          defaultValue={group.userLimit}
          name="userLimit"
          placeholder="인원 제한 설정"
        />
      </section>
      <section>
        <h4>그룹 소개</h4>
        <input type="text" name="groupDescription" defaultValue={group.description} />
      </section>
      <section>
        <h4>그룹 생성일</h4>
        <input type="text" defaultValue={createdAt} readOnly />
      </section>
      <section>
        <h4>관리자</h4>
        <input type="text" defaultValue={`${user.nickname}#${user.discriminator}`} readOnly />
      </section>
      <section>
        <h4>그룹 가입일</h4>
        <input type="text" defaultValue={joinedAt} readOnly />
      </section>
      <button>수정</button>
    </form>
  );
}
