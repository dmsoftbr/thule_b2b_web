import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./route-tree.gen";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./contexts/auth-context";
import { AppDialogProvider } from "./components/app-dialog/app-dialog-context";
import RouteSkeleton from "./pages/_app/-components/route-skeleton";
const router = createRouter({
  routeTree,
  basepath: "/b2b",
  // Pré-carrega a rota no hover/touchstart de um <Link>. Em navegações já
  // "intencionadas" o código/dados da rota chegam antes do clique, reduzindo
  // a aparição do pending.
  defaultPreload: "intent",
  // O carregamento de dados deste app acontece dentro dos componentes via
  // useQuery (React Query), não em loaders de rota. Zeramos o stale time do
  // preload do router para que o React Query continue sendo a única fonte de
  // verdade do cache — sem uma segunda camada de "frescor" competindo.
  defaultPreloadStaleTime: 0,
  // Skeleton de conteúdo nas transições de rota. Como as rotas ficam sob o
  // layout `_app`, ele renderiza dentro do <Outlet/>, preservando sidebar +
  // header. Aparece rápido (150ms) e fica visível no mínimo 400ms p/ não piscar.
  defaultPendingComponent: RouteSkeleton,
  defaultPendingMs: 150,
  defaultPendingMinMs: 400,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppDialogProvider>
          <RouterProvider router={router} />
        </AppDialogProvider>
        <Toaster
            richColors
            closeButton
            toastOptions={{
              classNames: {
                error:
                  "!bg-red-400 !text-white !border-white [&>button]:!bg-red-400 [&>button]:!border-white [&>button]:!text-white",
                success:
                  "!bg-emerald-500 !text-white !border-white [&>button]:!bg-emerald-500 [&>button]:!border-white [&>button]:!text-white",
                info: "!bg-blue-300 !text-blue-700 !border-blue-600 [&>button]:!bg-blue-300 [&>button]:!border-blue-600 [&>button]:!text-blue-700",
                warning:
                  "!bg-orange-400 !text-white !border-white [&>button]:!bg-orange-400 [&>button]:!border-white [&>button]:!text-white",
              },
            }}
          />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
