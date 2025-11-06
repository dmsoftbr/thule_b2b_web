import type React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface Props {
  message: string | React.ReactNode;
  children: React.ReactNode;
  className?: string;
  indicatorClassName?: string;
}

export const AppTooltip = ({
  indicatorClassName,
  className,
  children,
  message,
}: Props) => {
  return (
    <Tooltip delayDuration={700}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        className={className}
        indicatorClassName={indicatorClassName}
      >
        <span>{message}</span>
      </TooltipContent>
    </Tooltip>
  );
};
