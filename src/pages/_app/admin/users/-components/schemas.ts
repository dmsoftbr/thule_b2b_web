import { z } from "zod";

export const UserSchema = z.object({
  id: z
    .string()
    .regex(
      /^[a-zA-Z0-9._-]*$/,
      "O código deve conter apenas letras, números, ponto, hífen e underscore"
    )
    .optional(),
  name: z.string({ error: "Digite o Nome do Usuário" }),
  email: z.email({ error: "Digite um e-mail válido" }),
  role: z.coerce.string().nonempty("Selecione o Perfil do Usuário"),
  groupId: z
    .string({ error: "Selecione um Grupo de Usuários" })
    .min(1, "Selecione um Grupo de Usuários"),
  networkDomain: z.optional(z.string()),
  representativeId: z.optional(z.coerce.number()),
  isActive: z.coerce.boolean(),
});
