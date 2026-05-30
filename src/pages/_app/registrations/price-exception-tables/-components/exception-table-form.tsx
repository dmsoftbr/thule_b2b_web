import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import type { PriceExceptionTableSchema } from "./schemas";
import type { z } from "zod";
import { FormInput } from "@/components/form/form-input";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { PriceExceptionTablesService } from "@/services/registrations/price-exception-tables.service";
import { useNavigate } from "@tanstack/react-router";
import type { PriceExceptionTableModel } from "@/models/registrations/price-exception-table.model";
import { useEffect } from "react";
import { toast } from "sonner";
import { handleError } from "@/lib/api";

interface Props {
  formAction: "ADD" | "VIEW" | "EDIT";
  initialData?: PriceExceptionTableModel;
}

export const ExceptionTableForm = ({ initialData, formAction }: Props) => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof PriceExceptionTableSchema>>({
    defaultValues: {
      id: "",
      name: "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof PriceExceptionTableSchema>,
  ) => {
    try {
      if (formAction == "ADD") {
        await PriceExceptionTablesService.create(values);
        toast.success("Grupo de desconto criado com sucesso");
        navigate({ to: "/registrations/price-exception-tables" });
      } else if (formAction == "EDIT") {
        await PriceExceptionTablesService.update(values);
        toast.success("Grupo de desconto atualizado com sucesso");
        navigate({ to: "/registrations/price-exception-tables" });
      }
    } catch (error) {
      toast.error(handleError(error));
    }
  };

  useEffect(() => {
    if (formAction != "ADD" && initialData) {
      form.reset(initialData);
    }
  }, []);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          control={form.control}
          name="id"
          label="Código"
          maxLength={50}
          readOnly={formAction != "ADD"}
        />
        <FormTextarea
          control={form.control}
          name="name"
          label="Nome"
          inputClassName="resize-none"
          maxLength={100}
          rows={2}
        />
        <div className="flex items-center justify-end gap-x-2">
          <Button variant="default">Gravar</Button>
          <Button
            variant="secondary"
            onClick={() =>
              navigate({ to: "/registrations/price-exception-tables" })
            }
          >
            Voltar p/Lista
          </Button>
        </div>
      </form>
    </Form>
  );
};
