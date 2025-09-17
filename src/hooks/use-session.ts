import { useContext } from "react";
import { AuthContext } from "@/contexts/auth-context";

export function useSession() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useSession must be used within an AuthProvider");
  }
  const { session, isPending, isAuthenticated } = context;
  return { session, isPending, isAuthenticated };
}
