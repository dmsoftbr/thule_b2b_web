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
        <div className="w-full">
          <AppHeader />
          <main className="w-full flex flex-1 bg-neutral-100">
            <Outlet />
            {/* <TanStackRouterDevtools /> */}
          </main>
        </div>
      </SidebarProvider>
    </AppContext.Provider>
  );
}
