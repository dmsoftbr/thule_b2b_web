import { cn } from "@/lib/utils";
import logoSvg from "@/assets/images/logo.svg";

export const Logo = ({ inverse }: { inverse: boolean }) => {
  return (
    <div className="relative flex gap-x-2">
      <img width={42} height={42} className="size-7" src={logoSvg} alt="B2B" />
      <p className={cn("font-bold text-2xl", inverse && "text-white")}>B2B</p>
    </div>
  );
};
