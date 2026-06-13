import AppContext from "@/contexts/app-context";
import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import AppSkeleton from "./-components/app-skeleton";
import { useSession } from "@/hooks/use-session";
import { AppHeader } from "@/components/layout/app-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSideBar } from "@/components/layout/app-sidebar";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const { isAuthenticated, isPending } = useSession();

  if (isPending) {
    return <AppSkeleton />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <AppContext.Provider value={{}}>
      <SidebarProvider>
        <AppSideBar />
        {/* min-w-0: permite que este flex-child encolha abaixo da largura do
            conteúdo (ex.: tabela de itens com min-w), evitando scroll horizontal
            na PÁGINA inteira — o overflow fica contido nos containers internos. */}
        <div className="w-full min-w-0">
          <AppHeader />
          <main className="w-full flex flex-1 bg-neutral-100 min-w-0">
            <Outlet />
            {/* <TanStackRouterDevtools /> */}
          </main>
        </div>
      </SidebarProvider>
    </AppContext.Provider>
  );
}
