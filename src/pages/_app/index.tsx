import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_app/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      navigate({ to: "/dashboard", replace: true });
    }, 500);
  }, []);
  return (
    <div className="bg-white flex w-full h-full items-center justify-center">
      Aguarde...
    </div>
  );
}
