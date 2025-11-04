"use client";
import Link from "next/link";
import { DropdownSection, DropdownItem, User } from "@heroui/react";
import DropDown from "../dropdown/DropDown";
import { DROPDOWN_COLOR } from "../dropdown/constants";
import { DROPDOWN_ROUTES } from "@/constants/routes";
import { get_logout } from "@/lib/api/auth";
import { HeaderProps_type } from "@/types/components";
import { ROUTES } from "@/constants/routes";
import Container from "./Container";
import { CurrentUserSchema } from "@/services/auth";

type UserSchemaProp = {
  currentUser: {
    name: string;
    email: string;
    nickname: string;
    discriminator: string;
  };
};

export default function Header({ currentUser }: UserSchemaProp) {
  const { name, email, nickname, discriminator } = currentUser;

  return (
    <header className="w-full border-b-1 border-solid border-[#c8c8c8] mb-[30px]">
      <Container className="flex justify-between items-center py-[10px] sm:py-[14px] md:py-[16px] lg:py-[20px]">
        <div>
          <h1 className="font-bold">
            <Link href={ROUTES.DASHBOARD}>TaskFlow Teams</Link>
          </h1>
        </div>
        <div>
          <DropDown title={`${nickname}#${discriminator}`} color={DROPDOWN_COLOR.primary} disabledKeys={["profile"]}>
            <DropdownSection aria-label="user">
              <DropdownItem key={"profile"} className="h-14 gap-2 opacity-100" isReadOnly>
                <User
                  avatarProps={{
                    size: "sm",
                    // src: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fkr.freepik.com%2Ffree-photos-vectors%2Fuser&psig=AOvVaw12wbwZEqxZINWfb1iXR8XM&ust=1756788785427000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCPCMg6_ito8DFQAAAAAdAAAAABAE",
                  }}
                  classNames={{
                    name: "text-default-600",
                    description: "text-default-500",
                  }}
                  description={email}
                  name={name}
                />
              </DropdownItem>
            </DropdownSection>
            <DropdownSection aria-label="route">
              {DROPDOWN_ROUTES.map((page) => (
                <DropdownItem key={page.menu} href={page.url}>
                  {page.menu}
                </DropdownItem>
              ))}
            </DropdownSection>
            <DropdownSection aria-label="logout">
              <DropdownItem key={"logoutBtn"} onClick={get_logout}>
                로그아웃
              </DropdownItem>
            </DropdownSection>
          </DropDown>
        </div>
      </Container>
    </header>
  );
}
