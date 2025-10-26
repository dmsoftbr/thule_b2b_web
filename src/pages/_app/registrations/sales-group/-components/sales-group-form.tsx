import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import type { SalesGroupSchema } from "./schemas";
import type { z } from "zod";
import { FormInput } from "@/components/form/form-input";
import { FormTextarea } from "@/components/form/form-textarea";
import { Button } from "@/components/ui/button";
import { SalesGroupsService } from "@/services/registrations/sales-group.service";
import { useNavigate } from "@tanstack/react-router";
import type { SalesGroupModel } from "@/models/registrations/sales-group.model";
import { useEffect } from "react";
import { toast } from "sonner";

interface Props {
  formAction: "ADD" | "VIEW" | "EDIT";
  initialData?: SalesGroupModel;
}

export const SalesGroupForm = ({ initialData, formAction }: Props) => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof SalesGroupSchema>>({
    defaultValues: {
      id: "",
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SalesGroupSchema>) => {
    if (formAction == "ADD") {
      await SalesGroupsService.create(values);
      toast.success("Grupo criado com sucesso");
      navigate({ to: "/registrations/sales-group" });
    } else if (formAction == "EDIT") {
      await SalesGroupsService.update(values.id, values);
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
            onClick={() => navigate({ to: "/registrations/sales-group" })}
          >
            Voltar p/Lista
          </Button>
        </div>
      </form>
    </Form>
  );
};
