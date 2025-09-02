import { DROPDOWN_COLOR, DROPDOWN_VARIANT } from "./constants";


export interface DropDownMenu {
    title: string;
    color?: string;
    variant?: string;
    clickEvent?: () => void ;
}

export interface DropDownColor {
    default: string;
    primary: string;
    secondary: string;
    success: string;
    warning: string;
    danger: string;
};

export type DROPDOWN_COLOR_TYPE = keyof typeof DROPDOWN_COLOR;


export interface DropDownStyle {
    solid: string;
    bordered: string;
    light: string;
    flat: string;
    faded: string;
    shadow: string;
}
export type DROPDOWN_STYLE_TYPE = keyof typeof DROPDOWN_VARIANT;