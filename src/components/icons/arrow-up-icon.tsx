//https://heroicons.com/outline arrow-long-up
import { IconProps } from "./interface";

export default function ArrowUpIcon({ size = "1em", ...props }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      width={size}
      height={size}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18"
      />
    </svg>
  );
}
