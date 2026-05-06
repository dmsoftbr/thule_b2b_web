import { useEffect, type ReactNode } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { usePermissions } from "@/hooks/use-permissions";

interface Props {
  permissionId: string;
  children: ReactNode;
}

export const RequirePermission = ({ permissionId, children }: Props) => {
  const { has, isLoading, isAdmin } = usePermissions();
  const navigate = useNavigate();

  const allowed = isAdmin || has(permissionId);

  useEffect(() => {
    if (isLoading) return;
    if (!allowed) {
      toast.error("Você não possui permissão para acessar esta página.");
      navigate({ to: "/" });
    }
  }, [allowed, isLoading, navigate]);

  if (isLoading || !allowed) return null;
  return <>{children}</>;
};
