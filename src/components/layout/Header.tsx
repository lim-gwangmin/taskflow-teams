"use client";

import { ReactElement } from "react";
import {
  DropdownSection,
  DropdownItem,
  User,
} from "@heroui/react";
import DropDown from "../dropdown/DropDown"
import LogoutButton from "../button/LogoutButton"
import { DROPDOWN_COLOR } from '../dropdown/constants';
import { get_logout } from "@/services/auth";


interface DefatultUserProps {
    user: string | null;
    email: string;
}

export default function Header({ 
    user = '',
    email = '',
    } : DefatultUserProps
    ) : ReactElement {
    return (
        <header 
            style={{
                width:'100%', 
                display: 'flex',
                justifyContent:'space-between',
                alignItems:'center',
                borderBottom: '1px solid #c8c8c8',
                marginBottom: '2rem',
                padding:'0.5rem 1rem',
        }}>
            <div>
                <h1 style={{fontWeight:'bold'}}>TaskFlow Teams</h1>
            </div>
            <div>
                <DropDown 
                    title={user} 
                    color={DROPDOWN_COLOR.primary} 
                    disabledKeys={['profile']}
                >
                    <DropdownSection aria-label="user">
                        <DropdownItem key={'profile'} className="h-14 gap-2 opacity-100" isReadOnly>
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
                            name={user}
                            />
                        </DropdownItem>
                    </DropdownSection>
                    <DropdownSection aria-label="route">
                        <DropdownItem key='setting' href="/myPage" >마이 페이지</DropdownItem>
                    </DropdownSection>
                    <DropdownSection aria-label="logout">
                        <DropdownItem key={'logoutBtn'} onClick={get_logout} >로그아웃</DropdownItem>
                    </DropdownSection>
                </DropDown>
                <LogoutButton/>
            </div>
        </header>
    )
}