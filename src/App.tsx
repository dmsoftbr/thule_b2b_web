import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react";

import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./route-tree.gen";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "./contexts/auth-context";
import { AppDialogProvider } from "./components/app-dialog/app-dialog-context";

const router = createRouter({ routeTree });

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
          <Toaster richColors />
        </QueryClientProvider>
      </NuqsAdapter>
    </AuthProvider>
  );
}

export default App;
