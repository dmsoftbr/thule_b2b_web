import { createFileRoute, redirect } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { DashboardAdministrative } from "./-components/dashboard-administrative";
import { DashboardRepresentative } from "./-components/dashboard-representative";
import { DashboardCustomer } from "./-components/dashboard-customer";

export const Route = createFileRoute("/_app/dashboard/")({
  component: DashboardPageComponent,
});

function DashboardPageComponent() {
  const { session } = useAuth();

  if (!session) {
    redirect({ to: "/auth/login", replace: true });
    return null;
  }

  if (session.user.role < 2) {
    return <DashboardAdministrative />;
  }

  if (session.user.role == 2) {
    return <DashboardRepresentative />;
  }

  if (session.user.role == 3) {
    return <DashboardCustomer />;
  }

  return (
    <div className="flex flex-col space-y-4 p-4 w-full h-full bg-white">
      Aguarde...
    </div>
  );
}
