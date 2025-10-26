import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { BlocksIcon } from "lucide-react";

export const QuickActionNewBudget = () => {
  const navigate = useNavigate();
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-neutral-400 hover:text-neutral-800 flex flex-col items-center gap-0 h-10"
      onClick={() => navigate({ to: "/budgets/new-budget", from: "/" })}
    >
      <BlocksIcon className="size-5" />
      <span className="sr-only">Nova Simulação</span>
      <span className="text-[8px]">Simulação</span>
    </Button>
  );
};
