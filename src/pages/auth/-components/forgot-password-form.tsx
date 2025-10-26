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

interface Props {
  onGotoBackToLogin: () => void;
}

export const ForgotPasswordForm = ({ onGotoBackToLogin }: Props) => {
  const [error, setError] = useState("");

  const form = useForm<z.infer<typeof RecoveryPasswordSchema>>({
    resolver: zodResolver(RecoveryPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const onRecovery = async (values: z.infer<typeof RecoveryPasswordSchema>) => {
    setError("");
    //await new AuthService().getRecoveryPasswordToken(values.email);
    console.log(values);
    //TODO: implementar o RecoveryPassword
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
              <Button type="submit" className="text-sm font-normal uppercase">
                Recuperar minha senha
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
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
