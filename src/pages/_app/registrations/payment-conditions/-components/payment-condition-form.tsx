import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { api, handleError } from "@/lib/api";
import { toast } from "sonner";

import { PaymentConditionSchema } from "./schemas";
import type { PaymentConditionModel } from "@/models/registrations/payment-condition.model";
import type { FORM_ACTIONS } from "@/@types/form-actions";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/form-input";
import { FormCheckBox } from "@/components/form/form-checkbox";
import { Button } from "@/components/ui/button";

interface Props {
  initialData: PaymentConditionModel | null;
  isOpen: boolean;
  onClose: (refresh: boolean) => void;
  mode: FORM_ACTIONS;
}

export const PaymentConditionForm = ({ initialData, mode, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof PaymentConditionSchema>>({
    resolver: zodResolver(PaymentConditionSchema),
    defaultValues: {
      id: 0,
      name: "",
      isActive: true,
      additionalDiscountPercent: 0,
    },
  });

  const onSubmit = async (values: z.infer<typeof PaymentConditionSchema>) => {
    try {
      setIsLoading(true);

      await api.patch("/registrations/payment-conditions", values);
      toast.success("Condição de Pagamento alterada com sucesso!");

      onClose(true);
      setIsLoading(false);
    } catch (error: any) {
      console.log(error);
      toast.error(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialData) form.reset(initialData);
  }, [initialData]);

  const isInputsDisabled = mode == "VIEW";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))}
        className="space-y-4"
      >
        <FormInput readOnly control={form.control} name="id" label="Código" />
        <FormInput control={form.control} name="name" label="Descrição" />
        <FormCheckBox
          control={form.control}
          name="isActive"
          label="Ativa p/Venda"
        />
        <FormInput
          control={form.control}
          name="additionalDiscountPercent"
          label="% Desconto Adicional"
          type="number"
        />

        <div className="flex items-end justify-end gap-x-2">
          {!isInputsDisabled && (
            <Button disabled={isLoading} type="submit" variant="green">
              Gravar
            </Button>
          )}
          <Button
            disabled={isLoading}
            type="button"
            variant="secondary"
            onClick={() => onClose(false)}
          >
            Voltar p/Lista
          </Button>
        </div>
      </form>
    </Form>
  );
};
