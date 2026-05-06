import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth-context";
import { UsersService } from "@/services/admin/users.service";
import type { EffectivePermissionModel } from "@/models/admin/user-permission.model";

const usersService = new UsersService();

export function usePermissions() {
  const { isAuthenticated, session } = useAuth();
  const isAdmin = session?.user?.role === 0 || session?.user?.role === 1;

  const query = useQuery<EffectivePermissionModel[]>({
    queryKey: ["permissions", "me", session?.user?.id],
    queryFn: () => usersService.getMyPermissions(),
    enabled: isAuthenticated && !isAdmin,
    staleTime: 5 * 60 * 1000,
  });

  const granted = new Set(
    (query.data ?? []).filter((p) => p.isPermitted).map((p) => p.permissionId)
  );

  const has = (permissionId?: string) => {
    if (!permissionId) return true;
    if (isAdmin) return true;
    return granted.has(permissionId);
  };

  return {
    isLoading: query.isLoading,
    isAdmin,
    permissions: query.data ?? [],
    has,
  };
}
