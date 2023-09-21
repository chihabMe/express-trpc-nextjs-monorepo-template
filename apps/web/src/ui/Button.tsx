import React from "react";
interface Props {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  type?: "submit" | "submit" | "reset";
  disabled?: boolean;
}
export const Button = (
  { disabled, children, type, className, onClick }: Props,
) => {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${className} ${
        disabled && "opacity-60"
      } w-full h-11 active:ring-2 active:ring-blue-400 px-2 py-2 rounded-md bg-blue-500 text-white font-medium cursor-pointer`}
    >
      {children}
    </button>
  );
};
export default Button;
