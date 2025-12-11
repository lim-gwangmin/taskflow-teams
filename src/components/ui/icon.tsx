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

export { LoadingSpinner };
