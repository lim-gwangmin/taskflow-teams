"use client";

import { ReactElement, ReactNode, Fragment }from 'react';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  Button,
} from "@heroui/react";
import { DROPDOWN_STYLE_TYPE, DROPDOWN_COLOR_TYPE } from './types';
import { DROPDOWN_COLOR, DROPDOWN_VARIANT } from './constants';

interface DropdownDefaultProps {
  title: string | null;
  color?: DROPDOWN_COLOR_TYPE;
  variant?: DROPDOWN_STYLE_TYPE;
  disabledKeys?: Array<string>;
  children?: ReactNode,
}

export default function DropDown({ 
    title,
    color = DROPDOWN_COLOR.default, 
    variant = DROPDOWN_VARIANT.light,
    disabledKeys = [],
    children,
    } : DropdownDefaultProps
  ) : ReactElement {

  return (
   <Dropdown>
      <DropdownTrigger>
        <Button color={color} variant={variant}>
          {title}
        </Button>
      </DropdownTrigger>
      <DropdownMenu 
        disabledKeys={disabledKeys} 
        color={color} 
        variant={variant}
        itemClasses={{
            base: [
              "rounded-md",
              "text-default-500",
              "transition-opacity",
              "data-[hover=true]:text-foreground",
              "data-[hover=true]:bg-default-100",
              "dark:data-[hover=true]:bg-default-50",
              "data-[selectable=true]:focus:bg-default-50",
              "data-[pressed=true]:opacity-70",
              "data-[focus-visible=true]:ring-default-500",
            ],
        }}>
        <Fragment>
          {children}
        </Fragment>
      </DropdownMenu>
    </Dropdown>
  );
}

