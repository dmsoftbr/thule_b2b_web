import type z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RecoveryPasswordSchema } from "./schemas";

import { Form } from "@/components/ui/form";
import { Logo } from "@/components/ui/logo";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { api, handleError } from "@/lib/api";

interface Props {
  onGotoBackToLogin: () => void;
}

export const ForgotPasswordForm = ({ onGotoBackToLogin }: Props) => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof RecoveryPasswordSchema>>({
    resolver: zodResolver(RecoveryPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const onRecovery = async (values: z.infer<typeof RecoveryPasswordSchema>) => {
    setError("");
    setSuccess("");
    try {
      setIsSubmitting(true);
      // E-mail vai como segmento de path → encodeURIComponent obrigatório
      // (caracteres como "+" viram espaço se não forem encodados).
      const { data } = await api.get<{ message: string }>(
        `/auth/recovery-password-token/${encodeURIComponent(values.email)}`
      );
      // Resposta genérica do backend (anti-enumeração): exibimos como veio.
      setSuccess(
        data?.message ??
          "Se o e-mail informado estiver cadastrado, enviaremos as instruções de redefinição de senha."
      );
      form.reset();
    } catch (e) {
      setError(handleError(e));
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
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
          Digite seu e-mail para recuperar sua senha
        </CardDescription>
      </CardHeader>
      <CardContent className="min-w-[500px]">
        <Form {...form}>
          <form
            className="flex flex-col space-y-4"
            onSubmit={form.handleSubmit(onRecovery)}
          >
            <div className="space-y-2">
              <FormInput
                control={form.control}
                label="E-mail"
                name="email"
                placeholder="Digite seu e-mail"
                type="email"
              />
            </div>
            <div className="flex items-center justify-between">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="text-sm font-normal uppercase"
              >
                {isSubmitting ? "Enviando..." : "Recuperar minha senha"}
              </Button>
              <div className="flex justify-end">
                <a
                  href="#"
                  className="text-blue-600"
                  onClick={() => onGotoBackToLogin()}
                >
                  Tenho uma senha
                </a>
              </div>
            </div>
            {error && (
              <div className="text-center text-sm text-red-800 bg-red-300 p-2 rounded-md">
                {error}
              </div>
            )}
            {success && (
              <div className="text-center text-sm text-emerald-800 bg-emerald-200 p-2 rounded-md">
                {success}
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
