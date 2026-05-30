import { z } from "zod";

export const PriceTableSchema = z.object({
  id: z
    .string()
    .min(1, "Informe o código da tabela")
    .max(20, "O código deve ter no máximo 20 caracteres"),
  name: z.string(),
  validFrom: z.date(),
  validTo: z.date(),
  zeroDiscount: z.boolean(),
  isActive: z.boolean(),
  portalName: z.optional(z.string()),
});
