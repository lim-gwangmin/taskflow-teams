import { ContainerProps_type } from "@/types/components";

export default function Container({ children, className, style }: ContainerProps_type) {
  return (
    <div className={`max-w-[1280] mx-auto px-[10px] sm:px-[14px] md:px-[16px] lg:px-[20px] ${className}`} style={style}>
      {children}
    </div>
  );
}
