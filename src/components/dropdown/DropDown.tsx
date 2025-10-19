"use client";

import { Fragment } from "react";
import { Dropdown, DropdownTrigger, DropdownMenu, Button } from "@heroui/react";
import { DROPDOWN_COLOR, DROPDOWN_VARIANT } from "./constants";
import { DropDownProps_type } from "@/types/components";

export default function DropDown({
  title,
  color = DROPDOWN_COLOR.default,
  variant = DROPDOWN_VARIANT.light,
  disabledKeys = [],
  children,
}: DropDownProps_type) {
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
        }}
      >
        <Fragment>{children}</Fragment>
      </DropdownMenu>
    </Dropdown>
  );
}
