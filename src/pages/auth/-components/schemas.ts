import { z } from "zod";

export const LoginSchema = z.object({
  userName: z.string().min(2, "Digite seu Usuário ou E-mail"),
  password: z.string().min(1, {
    message: "Digite sua Senha",
  }),
});

export const RecoveryPasswordSchema = z.object({
  email: z.string().min(1, "Digite seu E-mail").email("E-mail inválido"),
});

export const ResetPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirme a nova senha"),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
  });
