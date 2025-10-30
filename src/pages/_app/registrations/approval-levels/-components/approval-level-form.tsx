import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { api, handleError } from "@/lib/api";
import { toast } from "sonner";
import type { FORM_ACTIONS } from "@/@types/form-actions";
import { FormInput } from "@/components/form/form-input";

import * as uuid from "uuid";
import type { ApprovalLevelModel } from "@/models/registrations/approval-level.model";
import { ApprovalLevelSchema } from "./schemas";
import { FormSelect } from "@/components/form/form-select";
import { SelectItem } from "@/components/ui/select";

interface Props {
  initialData: ApprovalLevelModel | null;
  isOpen: boolean;
  onClose: (refresh: boolean) => void;
  mode: FORM_ACTIONS;
}

export const ApprovalLevelForm = ({ initialData, mode, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof ApprovalLevelSchema>>({
    resolver: zodResolver(ApprovalLevelSchema),
    defaultValues: {
      id: mode == "ADD" ? uuid.v4() : "",
      description: "",
      type: "UNIQUE",
    },
  });

  const onSubmit = async (values: z.infer<typeof ApprovalLevelSchema>) => {
    try {
      let data = {
        ...values,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: "",
        updatedBy: "",
      };

      setIsLoading(true);
      if (mode == "ADD") {
        await api.post("/registrations/approval-levels", data);
        toast.success("Alçada de Aprovação criada com sucesso!");
      } else {
        await api.patch("/registrations/approval-levels", data);
        toast.success("Alçada de Aprovação alterada com sucesso!");
      }

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
        <FormInput
          readOnly
          control={form.control}
          name="id"
          label="Identificador"
        />
        <FormInput
          control={form.control}
          name="description"
          label="Descrição"
        />

        <FormSelect
          control={form.control}
          name="type"
          label="Tipo"
          items={[
            <SelectItem key="UNIQUE" value="UNIQUE">
              Aprovador Único
            </SelectItem>,
            <SelectItem key="CHAIN" value="CHAIN">
              Cadeia
            </SelectItem>,
          ]}
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
