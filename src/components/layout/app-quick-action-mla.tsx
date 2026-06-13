import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { CircleCheckIcon } from "lucide-react";
import { usePermissions } from "@/hooks/use-permissions";

// Atalho para Aprovações MLA. Só aparece se o usuário tiver a permissão "23"
// (admins sempre veem); caso contrário não renderiza nada.
export const QuickActionMla = () => {
  const navigate = useNavigate();
  const { has } = usePermissions();

  if (!has("23")) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-neutral-400 hover:text-neutral-800 flex flex-col items-center gap-0 h-10"
      onClick={() => navigate({ to: "/mla", from: "/" })}
    >
      <CircleCheckIcon className="size-5" />
      <span className="sr-only">Aprovações MLA</span>
      <span className="text-[8px]">MLA</span>
    </Button>
  );
};
