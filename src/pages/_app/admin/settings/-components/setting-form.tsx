import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { api, handleError } from "@/lib/api";
import { toast } from "sonner";
import type { SettingModel } from "@/models/admin/setting.model";
import type { FORM_ACTIONS } from "@/@types/form-actions";
import { SettingSchema } from "./schemas";
import { FormInput } from "@/components/form/form-input";
import { FormTextarea } from "@/components/form/form-textarea";

interface Props {
  initialData: SettingModel;
  isOpen: boolean;
  onClose: (refresh: boolean) => void;
  mode: FORM_ACTIONS;
}

export const SettingsForm = ({ initialData, mode, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof SettingSchema>>({
    resolver: zodResolver(SettingSchema),
    defaultValues: {
      id: "",
      name: "",
      content: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SettingSchema>) => {
    try {
      let data = { ...values };

      setIsLoading(true);
      await api.patch("/admin/settings", data);
      toast.success("Configuração alterada com sucesso!");

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
    form.reset(initialData);
  }, [initialData]);

  const isInputsDisabled = mode == "VIEW";

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, (errors) => console.log(errors))}
        className="space-y-4"
      >
        <FormInput readOnly control={form.control} name="id" label="Código" />
        <FormTextarea
          readOnly
          control={form.control}
          name="name"
          label="Nome"
          rows={2}
        />
        <FormTextarea
          control={form.control}
          name="content"
          label="Conteúdo"
          rows={5}
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
