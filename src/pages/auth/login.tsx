import { createFileRoute } from "@tanstack/react-router";
import { LoginBackground } from "./-components/login-background";
import { LoginForm } from "./-components/login-form";
import z from "zod";
import { useState } from "react";
import { ForgotPasswordForm } from "./-components/forgot-password-form";

const signInSearchSchema = z.object({
  email: z.string().optional(),
});

export const Route = createFileRoute("/auth/login")({
  component: RouteComponent,
  validateSearch: (search) => signInSearchSchema.parse(search),
  head: () => ({
    meta: [
      {
        title: "Login | THULE B2B",
      },
    ],
  }),
});

function RouteComponent() {
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  return (
    <LoginBackground>
      {!forgotPasswordMode && (
        <LoginForm onGotoForgotPassword={() => setForgotPasswordMode(true)} />
      )}
      {forgotPasswordMode && (
        <ForgotPasswordForm
          onGotoBackToLogin={() => setForgotPasswordMode(false)}
        />
      )}
    </LoginBackground>
  );
}
