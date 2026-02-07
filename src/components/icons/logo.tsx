import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      className={cn("h-6 w-6", className)}
      fill="currentColor"
    >
      <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-88a8,8,0,0,1,8-8,56,56,0,0,1,56,56,8,8,0,0,1-16,0,40,40,0,0,0-40-40,8,8,0,0,1-8-8Zm0-40a8,8,0,0,1,8-8,96,96,0,0,1,96,96,8,8,0,0,1-16,0,80,80,0,0,0-80-80,8,8,0,0,1-8-8Z" />
    </svg>
  );
}
