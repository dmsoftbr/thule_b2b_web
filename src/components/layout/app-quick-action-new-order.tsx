import { Button } from "@/components/ui/button";
import { useNavigate } from "@tanstack/react-router";
import { ShoppingCartIcon } from "lucide-react";

export const AppQuickActionNewOrder = () => {
  const navigate = useNavigate();
  return (
    <Button
      variant="ghost"
      size="sm"
      className="text-neutral-400 hover:text-neutral-800 flex flex-col items-center gap-0 h-10"
      onClick={() => navigate({ to: "/orders/new-order" })}
    >
      <ShoppingCartIcon className="size-5" />
      <span className="sr-only">Novo Pedido</span>
      <span className="text-[8px]">Pedido</span>
    </Button>
  );
};
