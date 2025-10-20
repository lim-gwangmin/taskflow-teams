import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { getCurrentUser } from "@/services/auth";
import { COMMON_COMMENTS, GROUP_COMMENTS } from "@/constants/comments";

const { SERVER_ERROR } = COMMON_COMMENTS.SERVER;
const { CURRENT_USER } = COMMON_COMMENTS.AUTH;

// 그룹 조회
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    const searchParams = request.nextUrl.searchParams;
    const groupName = searchParams.get("groupName");
    const currentPage = searchParams.get("currentPage");
    const pageLimit = searchParams.get("pageLimit");

    // 유저 인증
    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: { message: CURRENT_USER },
        },
        { status: 401 }
      );
    }

    /**
     * groupName parameter
     * "" = 전체 그룹 조회
     * "admin" = 내가 만든 그룹 조회
     * "user" = 내가 가입한 그룹 조회
     */

    // 전체 그룹 조회
    if (!groupName) {
      const getAllGroups = await prisma.membership.findMany({
        // where 조건을 아예 넣지 않습니다.
        // 필요한 필드만 선택하거나 정렬 순서를 지정할 수 있습니다.
        select: {
          groupSeq: true,
          role: true,
          userEmail: true,
          group: {
            select: { name: true, no: true, admin: true },
          },
        },
        orderBy: {
          group: {
            createdAt: "desc",
          },
        },
      });

      return NextResponse.json(
        {
          success: true,
          data: {
            message: "전체 그룹 조회 성공",
            groups: getAllGroups,
          },
          error: null,
        },
        { status: 200 }
      );
    }

    // 내가 속한 모든 그룹 조회
    if (!groupName) {
      // 내가 속한 그룹 조회
      const getGroups = await prisma.membership.findMany({
        where: { userId: currentUser.id, userEmail: currentUser.email },
        select: {
          groupSeq: true,
          role: true,
          userEmail: true,
          group: {
            select: { name: true, no: true, admin: true },
          },
        },
      });

      return NextResponse.json(
        {
          success: true,
          data: {
            message: "내가 속한 그룹 조회 성공",
            groups: getGroups,
          },
          error: null,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error(SERVER_ERROR, "그룹조회 중 오류가 발생했습니다.", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: { message: "그룹조회 중 오류가 발생했습니다." },
      },
      { status: 500 }
    );
  }
}
// 그룹 생성
export async function POST(request: NextRequest) {
  const { SUCCESS_200, ERROR_409_DUPLICATE_NAME, ERROR_409_ALREADY_MEMBER, ERROR_500 } = GROUP_COMMENTS.CREATE;

  try {
    const { groupName } = await request.json();
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: { message: CURRENT_USER },
        },
        { status: 401 }
      );
    }

    const { id: userId, email } = currentUser;

    if (!groupName) {
      throw new Error("그룹명을 입력해주세요.");
    }

    // 그룹명 중복 체크
    const searcGroup = await prisma.group.findFirst({
      where: { name: groupName },
    });

    if (searcGroup) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: { message: ERROR_409_DUPLICATE_NAME },
        },
        { status: 409 }
      );
    }

    // 이미 속한 그룹인지 체크
    const userMemberships = await prisma.membership.findMany({
      where: { userId },
      include: { group: true },
    });
    const findAlreadyMember = userMemberships.find((m) => m.group.name === groupName);

    if (findAlreadyMember) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: { message: ERROR_409_ALREADY_MEMBER },
        },
        { status: 409 }
      );
    }

    // => group, membership 테이블에 데이터 추가
    const { newGroup, newMembership } = await prisma.$transaction(async (tx) => {
      const newGroup = await tx.group.create({ data: { name: groupName, admin: email } });
      const newMembership = await tx.membership.create({
        data: {
          userEmail: email,
          userId,
          groupSeq: newGroup.seq,
          groupId: newGroup.id,
          role: Role.ADMIN,
        },
      });

      return { newGroup, newMembership };
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          message: SUCCESS_200,
          group: newGroup,
          membership: newMembership,
        },
        error: null,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(SERVER_ERROR, ERROR_500, error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: { message: ERROR_500 },
      },
      { status: 500 }
    );
  }
}
// 그룹 수정
export async function PUT() {
  try {
  } catch (error) {}
}
// 그룹 삭제
export async function DELETE(request: NextRequest) {
  const { SUCCESS_200, ERROR_403, ERROR_500 } = GROUP_COMMENTS.DELETE;
  try {
    const currentUser = await getCurrentUser();

    // 유저 인증
    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: { message: CURRENT_USER },
        },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const groupSeq = searchParams.get("groupSeq");

    if (!groupSeq) {
      throw new Error("groupSeq 값이 필요합니다.");
    }

    const { id: userId } = currentUser;

    // 2. 권한 확인: 해당 멤버십을 찾고, 현재 유저가 ADMIN인지 확인합니다.
    const membershipToDelete = await prisma.membership.findFirst({
      where: {
        groupSeq: Number(groupSeq),
        userId, // 본인의 멤버십만 삭제 가능하도록 보안 강화
      },
    });

    // 멤버십이 없거나 권한이 ADMIN이 아니면 에러를 반환합니다.
    if (!membershipToDelete || membershipToDelete.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: { message: ERROR_403 },
        },
        { status: 403 }
      );
    }

    // 3. 트랜잭션 시작: 여러 데이터베이스 작업을 하나로 묶습니다.
    const groupIdToDelete = membershipToDelete.groupId;

    await prisma.$transaction(async (tx) => {
      // ⚠️ 중요: group을 삭제하기 전에, 해당 group을 참조하는 모든 membership을 먼저 삭제해야 합니다.
      // (다른 사용자가 그룹에 속해 있을 수 있기 때문입니다.)
      await tx.membership.deleteMany({
        where: { groupId: groupIdToDelete },
      });

      // 이제 group을 안전하게 삭제할 수 있습니다.
      await tx.group.delete({
        where: { id: groupIdToDelete },
      });
    });

    return NextResponse.json({ message: "그룹이 성공적으로 삭제되었습니다." }, { status: 200 });
  } catch (error) {
    console.error(SERVER_ERROR, "그룹삭제 중 오류가 발생했습니다.", error);
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: { message: "그룹삭제 중 오류가 발생했습니다." },
      },
      { status: 500 }
    );
  }
}
