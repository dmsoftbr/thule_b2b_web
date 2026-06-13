import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useState } from "react";

import { LoginBackground } from "./-components/login-background";
import { ResetPasswordSchema } from "./-components/schemas";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/form-input";
import { Logo } from "@/components/ui/logo";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api, handleError } from "@/lib/api";

const resetSearchSchema = z.object({
  // token vem do link enviado por e-mail (?token=...). Opcional para tratarmos
  // o caso de acesso sem token com uma mensagem amigável.
  token: z.string().optional(),
});

export const Route = createFileRoute("/auth/reset-password")({
  component: RouteComponent,
  validateSearch: (search) => resetSearchSchema.parse(search),
  head: () => ({
    meta: [{ title: "Redefinir Senha | THULE B2B" }],
  }),
});

function RouteComponent() {
  const navigate = useNavigate();
  const { token } = Route.useSearch();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof ResetPasswordSchema>) => {
    setError("");
    if (!token) {
      setError("Link inválido ou expirado. Solicite uma nova redefinição.");
      return;
    }
    try {
      setIsSubmitting(true);
      await api.patch("/auth/change-password-from-token", {
        recoveryPasswordToken: token,
        newPassword: values.newPassword,
      });
      toast.success("Senha redefinida com sucesso! Faça login com a nova senha.");
      navigate({ to: "/auth/login", replace: true });
    } catch (e) {
      setError(handleError(e));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <LoginBackground>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <Logo inverse={false} />
            <div className="relative">
              <img
                src="assets/images/thule_group.png"
                width={200}
                height={200}
                alt="Thule Group"
              />
            </div>
          </CardTitle>
          <CardDescription className="mt-2 text-center">
            Defina sua nova senha
          </CardDescription>
        </CardHeader>
        <CardContent className="min-w-[500px]">
          {!token ? (
            <div className="flex flex-col gap-4">
              <div className="text-center text-sm text-red-800 bg-red-300 p-2 rounded-md">
                Link inválido ou expirado. Solicite uma nova redefinição de
                senha na tela de login.
              </div>
              <Button
                type="button"
                className="text-sm font-normal uppercase"
                onClick={() => navigate({ to: "/auth/login" })}
              >
                Voltar ao login
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form
                className="flex flex-col space-y-4"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormInput
                  control={form.control}
                  label="Nova senha"
                  name="newPassword"
                  type="password"
                  placeholder="Digite a nova senha"
                  autoComplete="new-password"
                />
                <FormInput
                  control={form.control}
                  label="Confirmar nova senha"
                  name="confirmPassword"
                  type="password"
                  placeholder="Repita a nova senha"
                  autoComplete="new-password"
                />
                <div className="flex items-center justify-between">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="text-sm font-normal uppercase"
                  >
                    {isSubmitting ? "Salvando..." : "Redefinir senha"}
                  </Button>
                  <a
                    href="#"
                    className="text-blue-600"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate({ to: "/auth/login" });
                    }}
                  >
                    Voltar ao login
                  </a>
                </div>
                {error && (
                  <div className="text-center text-sm text-red-800 bg-red-300 p-2 rounded-md">
                    {error}
                  </div>
                )}
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </LoginBackground>
  );
}
