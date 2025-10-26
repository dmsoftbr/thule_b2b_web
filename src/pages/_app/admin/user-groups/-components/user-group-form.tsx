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
import type { UserGroupModel } from "@/models/user-group.model";
import { UserGroupSchema } from "./schemas";

interface Props {
  initialData: UserGroupModel | null;
  isOpen: boolean;
  onClose: (refresh: boolean) => void;
  mode: FORM_ACTIONS;
}

export const UserGroupForm = ({ initialData, mode, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof UserGroupSchema>>({
    resolver: zodResolver(UserGroupSchema),
    defaultValues: {
      id: "",
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof UserGroupSchema>) => {
    try {
      let data = { ...values };

      setIsLoading(true);
      if (mode == "ADD") {
        await api.post("/admin/user-groups", data);
        toast.success("Grupo criado com sucesso!");
      } else {
        await api.patch("/admin/user-groups", data);
        toast.success("Grupo alterado com sucesso!");
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
          readOnly={mode != "ADD"}
          control={form.control}
          name="id"
          label="Código"
        />
        <FormInput control={form.control} name="name" label="Nome" />

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
