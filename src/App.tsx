import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react";

import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./route-tree.gen";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./contexts/auth-context";
import { AppDialogProvider } from "./components/app-dialog/app-dialog-context";

const router = createRouter({ routeTree, basepath: "/b2b" });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

function App() {
  const queryClient = new QueryClient();

  return (
    <AuthProvider>
      <NuqsAdapter>
        <QueryClientProvider client={queryClient}>
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
        </QueryClientProvider>
      </NuqsAdapter>
    </AuthProvider>
  );
}

export default App;
