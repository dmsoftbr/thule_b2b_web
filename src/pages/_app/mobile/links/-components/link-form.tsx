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
import { FormTextarea } from "@/components/form/form-textarea";
import * as uuid from "uuid";
import type { MobileLinkModel } from "@/models/mobile/link.model";
import { MobileLinkSchema } from "./schemas";
import { FormCheckBox } from "@/components/form/form-checkbox";

interface Props {
  initialData: MobileLinkModel | null;
  isOpen: boolean;
  onClose: (refresh: boolean) => void;
  mode: FORM_ACTIONS;
}

export const MobileLinkForm = ({ initialData, mode, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof MobileLinkSchema>>({
    resolver: zodResolver(MobileLinkSchema),
    defaultValues: {
      id: mode == "ADD" ? uuid.v4() : "",
      title: "",
      linkUrl: "",
      isActive: true,
    },
  });

  const onSubmit = async (values: z.infer<typeof MobileLinkSchema>) => {
    try {
      let data = { ...values };

      setIsLoading(true);
      if (mode == "ADD") {
        await api.post("/mobile/links", data);
        toast.success("Link criado com sucesso!");
      } else {
        await api.patch("/mobile/links", data);
        toast.success("Link alterado com sucesso!");
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
        <FormInput control={form.control} name="title" label="Título" />
        <FormTextarea
          control={form.control}
          name="linkUrl"
          label="Endereço (URL)"
          maxLength={5000}
          rows={4}
        />
        <FormCheckBox control={form.control} label="Ativo" name="isActive" />
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
