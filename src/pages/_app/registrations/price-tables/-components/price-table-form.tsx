import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { api, handleError } from "@/lib/api";
import { toast } from "sonner";

import { PriceTableSchema } from "./schemas";
import type { PriceTableModel } from "@/models/registrations/price-table.model";
import type { FORM_ACTIONS } from "@/@types/form-actions";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/form-input";
import { FormCheckBox } from "@/components/form/form-checkbox";
import { Button } from "@/components/ui/button";
import { FormDatePicker } from "@/components/form/form-datepicker";

interface Props {
  initialData: PriceTableModel | null;
  isOpen: boolean;
  onClose: (refresh: boolean) => void;
  mode: FORM_ACTIONS;
}

export const PriceTableForm = ({ initialData, mode, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof PriceTableSchema>>({
    resolver: zodResolver(PriceTableSchema),
    defaultValues: {
      id: "",
      name: "",
      validFrom: new Date(),
      validTo: new Date(),
      zeroDiscount: false,
      isActive: true,
      portalName: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof PriceTableSchema>) => {
    try {
      setIsLoading(true);

      await api.patch("/registrations/price-tables", values);
      toast.success("Tabela de Preço alterada com sucesso!");

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
    if (initialData) {
      form.reset({
        ...initialData,
        validFrom: initialData.validFrom
          ? new Date(initialData.validFrom)
          : new Date(),
        validTo: initialData.validTo
          ? new Date(initialData.validTo)
          : new Date(),
      });
    }
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
        <FormInput
          control={form.control}
          name="portalName"
          label="Nome no Portal"
        />
        <FormDatePicker
          control={form.control}
          label="Válido de"
          name="validFrom"
        />
        <FormDatePicker
          control={form.control}
          label="Válido Ate"
          name="validTo"
        />
        <div className="flex items-center justify-between gap-x-4">
          <FormCheckBox control={form.control} name="isActive" label="Ativa?" />
          <FormCheckBox
            control={form.control}
            name="zeroDiscount"
            label="Zera Desconto?"
          />
        </div>
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
