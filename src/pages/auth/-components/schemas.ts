import { z } from "zod";

export const LoginSchema = z.object({
  userName: z.string().min(2, "Digite seu Usuário ou E-mail"),
  password: z.string().min(1, {
    message: "Digite sua Senha",
  }),
});

export const RecoveryPasswordSchema = z.object({
  email: z.string().min(2, "Digite seu E-mail"),
});
