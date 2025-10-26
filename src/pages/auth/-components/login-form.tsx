import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/ui/logo";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/lib/api";
import { useNavigate } from "@tanstack/react-router";
import { LoginSchema } from "./schemas";
import { useAuth } from "@/hooks/use-auth";
import type { SessionModel } from "@/models/auth/session-model";

interface Props {
  onGotoForgotPassword: () => void;
}

export const LoginForm = ({ onGotoForgotPassword }: Props) => {
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>("");
  const [isPending] = useTransition();
  const { login } = useAuth();

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      userName: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    try {
      setError("");

      const { data } = await api.post<SessionModel>("/auth/login", {
        ...values,
        clientType: "web",
      });

      login(data);

      navigate({ to: "/dashboard", replace: true });
    } catch (error: any) {
      if (error.name === "HTTPError") {
        const body = await error.response.json();

        setError(body.message);
      } else {
        console.log(error);
        setError(error.message);
      }
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
          Digite seus dados para acessar o sistema
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="flex flex-col space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail / Usuário</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="current-password"
                        {...field}
                        disabled={isPending}
                        placeholder="Digite seu e-mail"
                        type="text"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha</FormLabel>
                    <FormControl>
                      <Input
                        autoComplete="current-password"
                        {...field}
                        disabled={isPending}
                        placeholder="Digite sua Senha"
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="text-blue-600"
                onClick={() => onGotoForgotPassword()}
              >
                Esqueci minha senha
              </button>
            </div>
            <Button type="submit" className="text-sm font-normal uppercase">
              Acessar
            </Button>
            {error && (
              <div className="text-center text-sm text-red-800 bg-red-300 p-2 rounded-md">
                {error}
              </div>
            )}
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <p className="text-center text-sm text-gray-600">
          Ao fazer login, você concorda com nossos{" "}
          <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
            Termos de Serviço
          </a>{" "}
          e{" "}
          <a
            href="https://www.thule.com/pt-br/legal-and-privacy-policy"
            className="font-medium text-blue-600 hover:text-blue-500"
            target="_blank"
          >
            Política de Privacidade
          </a>
        </p>
      </CardFooter>
    </Card>
  );
};
