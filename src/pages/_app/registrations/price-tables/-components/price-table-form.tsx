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
import { parseDate } from "@/lib/datetime-utils";
import { FormInputMask } from "@/components/form/form-input-mask";
import { format } from "date-fns";

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
    if (initialData) form.reset(initialData);
    console.log(initialData);
    console.log(parseDate(form.getValues("validTo")));
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
        <FormInputMask
          control={form.control}
          name="validFrom"
          mask="00/00/0000"
          label={"Valido De"}
          outputType="date"
          defaultValue={format(form.getValues("validFrom"), "dd/MM/yyyy")}
        />

        <FormInputMask
          control={form.control}
          name="validTo"
          mask="00/00/0000"
          outputType="date"
          label={"Valido Até"}
          defaultValue={format(form.getValues("validTo"), "dd/MM/yyyy")}
        />
        <FormCheckBox
          control={form.control}
          name="zeroDiscount"
          label="Zera Desconto?"
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
