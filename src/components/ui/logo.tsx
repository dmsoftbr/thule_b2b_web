import { cn } from "@/lib/utils";
import logoSvg from "@/assets/images/logo.svg";

export const Logo = ({ inverse }: { inverse: boolean }) => {
  return (
    <div className="relative flex gap-x-2">
      <img width={64} height={64} className="size-10" src={logoSvg} alt="B2B" />
      <p className={cn("font-bold text-4xl", inverse && "text-white")}>B2B</p>
    </div>
  );
};
