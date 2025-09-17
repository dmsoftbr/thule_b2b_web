import { cn } from "@/lib/utils";

export const Logo = ({ inverse }: { inverse: boolean }) => {
  return (
    <div className="relative flex gap-x-2">
      <img
        width={64}
        height={64}
        className="size-10"
        src="/assets/images/logo.svg"
        alt="B2B"
      />
      <p className={cn("font-bold text-4xl", inverse && "text-white")}>B2B</p>
    </div>
  );
};
