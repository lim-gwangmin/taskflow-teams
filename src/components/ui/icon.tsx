import { ColorRing } from "react-loader-spinner";

const LoadingSpinner = ({ width = 50, height = 50, color = "#fff", style = {} }) => {
  return (
    <ColorRing
      width={width}
      height={height}
      color={color}
      colors={[color, color, color, color, color]}
      wrapperStyle={style}
    />
  );
};

const CheckIcon = ({ size = 18, color = "#fff" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`shrink-0 size-${size}`}
  >
    <circle cx="12" cy="12" r="10" /> {/* 배경을 흰색으로 해서 대비를 줌 */}
    <path
      d="M8 12.5L11 15.5L16 9.5"
      stroke={color} /* 부모의 텍스트 색상을 따라감 */
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export { LoadingSpinner, CheckIcon };
