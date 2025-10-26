import { z } from "zod";

export const UserSchema = z.object({
  id: z.string({ error: "Digite o Código do Usuário. Exemplo: luiz.silva" }),
  name: z.string({ error: "Digite o Nome do Usuário" }),
  email: z.email({ error: "Digite um e-mail válido" }),
  role: z.string({ error: "Selecione o Perfil do Usuário" }),
  groupId: z.string({ error: "Selecione um Grupo de Usuários" }),
  networkDomain: z.optional(z.string()),
  customerId: z.optional(z.coerce.number()),
  representativeId: z.optional(z.coerce.number()),
  isActive: z.coerce.boolean(),
});
