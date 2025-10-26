import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

interface Props {
  message: string;
  children: React.ReactNode;
}

export const AppTooltip = ({ children, message }: Props) => {
  return (
    <Tooltip delayDuration={700}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p>{message}</p>
      </TooltipContent>
    </Tooltip>
  );
};
