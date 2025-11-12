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
     * "viewer" = 내가 가입한 그룹 조회
     */
    const { seq: userSeq } = currentUser;
    const searchParams = request.nextUrl.searchParams;
    const groupName = searchParams.get("groupName");
    const currentPage = searchParams.get("currentPage");
    const pageLimit = searchParams.get("pageLimit");
    // pagination
    const page = parseInt(currentPage || "1"); // 기본값 1
    const limit = parseInt(pageLimit || "10"); // 기본값 10
    const skip = (page - 1) * limit;

    // 내가 만든 그룹 조회
    if (groupName === "admin") {
      const whereCondition = {
        memberships: {
          some: { userSeq, role: Role.ADMIN },
        },
      };
      const [totalCount, groupsData] = await prisma.$transaction([
        prisma.group.count({ where: whereCondition }),
        prisma.group.findMany({
          where: whereCondition,
          select: {
            seq: true,
            no: true,
            name: true,
            createdAt: true,
            description: true,
            userLimit: true,
            user: { select: { nickname: true, discriminator: true } },
          },
          orderBy: { createdAt: "desc" },
          skip: skip, // 건너뛸 개수
          take: limit, // 가져올 개수
        }),
      ]);
      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1 && page >= totalPages;
      return NextResponse.json(
        {
          success: true,
          data: {
            message: "내가 만든 그룹 조회 성공",
            groups: groupsData,
            pagination: {
              currentPage: page,
              totalPages: totalPages,
              totalCount: totalCount,
              hasPrevPage: hasPrevPage,
              hasNextPage: hasNextPage,
            },
          },
          error: null,
        },
        { status: 200 }
      );
    }
    // 내가 가입한 그룹 조회
    if (groupName === "viewer") {
      const whereCondition = {
        memberships: {
          some: { userSeq, role: Role.VIEWER },
        },
      };
      const [totalCount, groupsData] = await prisma.$transaction([
        prisma.group.count({ where: whereCondition }),
        prisma.group.findMany({
          where: whereCondition,
          select: {
            seq: true,
            no: true,
            name: true,
            createdAt: true,
            description: true,
            userLimit: true,
            user: { select: { nickname: true, discriminator: true } },
          },
          orderBy: { createdAt: "desc" },
          skip: skip, // 건너뛸 개수
          take: limit, // 가져올 개수
        }),
      ]);
      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1 && page >= totalPages;
      return NextResponse.json(
        {
          success: true,
          data: {
            message: "내가 가입한 그룹 조회 성공",
            groups: groupsData,
            pagination: {
              currentPage: page,
              totalPages: totalPages,
              totalCount: totalCount,
              hasPrevPage: hasPrevPage,
              hasNextPage: hasNextPage,
            },
          },
          error: null,
        },
        { status: 200 }
      );
    }

    // 특정 그룹 조회
    if (groupName) {
      const [totalCount, groupsData] = await prisma.$transaction([
        prisma.group.count({ where: { name: groupName } }),
        prisma.group.findMany({
          where: { name: groupName },
          select: {
            seq: true,
            no: true,
            name: true,
            description: true,
            userLimit: true,
            createdAt: true,
            user: { select: { nickname: true, discriminator: true } },
          },
          orderBy: { createdAt: "desc" },
          skip: skip, // 건너뛸 개수
          take: limit, // 가져올 개수
        }),
      ]);
      const totalPages = Math.ceil(totalCount / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1 && page >= totalPages;

      return NextResponse.json(
        {
          success: true,
          data: {
            message: "전체 그룹 조회 성공",
            groups: groupsData,
            pagination: {
              currentPage: page,
              totalPages: totalPages,
              totalCount: totalCount,
              hasPrevPage: hasPrevPage,
              hasNextPage: hasNextPage,
            },
          },
          error: null,
        },
        { status: 200 }
      );
    }

    // 전체그룹 조회
    const [totalCount, groupsData] = await prisma.$transaction([
      prisma.group.count(),
      prisma.group.findMany({
        select: {
          seq: true,
          no: true,
          name: true,
          description: true,
          userLimit: true,
          createdAt: true,
          user: { select: { nickname: true, discriminator: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: skip, // 건너뛸 개수
        take: limit, // 가져올 개수
      }),
    ]);
    // --- 3. 페이지네이션 메타데이터 계산 ---
    const totalPages = Math.ceil(totalCount / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1 && page >= totalPages;
    return NextResponse.json(
      {
        success: true,
        data: {
          message: "전체 그룹 조회 성공",
          groups: groupsData,
          pagination: {
            // 페이지네이션 정보 추가
            currentPage: page,
            totalPages: totalPages,
            totalCount: totalCount,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
          },
        },
        error: null,
      },
      { status: 200 }
    );
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
    const { groupName, description, userLimit } = await request.json();
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

    const { seq: userSeq, nickname, discriminator } = currentUser;

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
      where: { userSeq },
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
      const newGroup = await tx.group.create({
        data: {
          name: groupName,
          adminSeq: userSeq,
          description,
          userLimit: Number(userLimit),
        },
      });
      const newMembership = await tx.membership.create({
        data: {
          userSeq,
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
export async function PUT(request: NextRequest) {
  const { SUCCESS_200, ERROR_500 } = GROUP_COMMENTS.CREATE;
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

    const { groupSeq, groupName, groupDescription, groupUserLimit } = await request.json();
    // 그룹 고유코드를 formData에 없는 경우 예외처리
    if (!groupSeq) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: { message: "groupSeq값이 없습니다." },
        },
        { status: 402 }
      );
    }

    const isHasGroup = await prisma.group.findFirst({
      where: { seq: groupSeq },
    });

    if (!isHasGroup) {
      return NextResponse.json(
        {
          success: false,
          data: null,
          error: { message: "존재하지 않는 그룹입니다." },
        },
        { status: 404 }
      );
    }

    const updateGroup = await prisma.group.update({
      where: { seq: groupSeq },
      data: { name: groupName, description: groupDescription, userLimit: Number(groupUserLimit) },
    });

    return NextResponse.json(
      {
        success: true,
        data: { message: "성공적으로 수정됐습니다." },
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

    const { seq: userSeq } = currentUser;

    // 2. 권한 확인: 해당 멤버십을 찾고, 현재 유저가 ADMIN인지 확인합니다.
    const membershipToDelete = await prisma.membership.findFirst({
      where: {
        groupSeq: Number(groupSeq),
        userSeq, // 본인의 멤버십만 삭제 가능하도록 보안 강화
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
      await tx.membership.deleteMany({
        where: { groupId: groupIdToDelete },
      });
      await tx.group.delete({
        where: { id: groupIdToDelete },
      });
    });
    return NextResponse.json(
      {
        success: true,
        data: { message: "그룹이 성공적으로 삭제되었습니다." },
        error: null,
      },
      { status: 200 }
    );
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
