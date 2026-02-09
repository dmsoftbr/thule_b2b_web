import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { api, handleError } from "@/lib/api";
import { toast } from "sonner";
import type { FORM_ACTIONS } from "@/@types/form-actions";

import { SkuMessageSchema } from "./schemas";
import type { SkuMessageModel } from "@/models/registrations/sku-message.model";
import { FormTextarea } from "@/components/form/form-textarea";
import { Label } from "@/components/ui/label";
import { AllProductsCombo } from "@/components/app/all-products-combo";

interface Props {
  initialData: SkuMessageModel | null;
  isOpen: boolean;
  onClose: (refresh: boolean) => void;
  mode: FORM_ACTIONS;
}

export const SkuMessageForm = ({ initialData, mode, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof SkuMessageSchema>>({
    resolver: zodResolver(SkuMessageSchema),
    defaultValues: {
      productId: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof SkuMessageSchema>) => {
    try {
      let data = { ...values };

      setIsLoading(true);
      if (mode == "ADD") {
        await api.post("/registrations/sku-messages", data);
        toast.success("Registro criado com sucesso!");
      } else {
        await api.patch("/registrations/sku-messages", data);
        toast.success("Registro alterado com sucesso!");
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
        <div>
          <Label>Produto</Label>
          <AllProductsCombo
            onSelect={(product) =>
              form.setValue("productId", product?.id ?? "")
            }
            defaultValue={initialData?.productId ?? ""}
            closeOnSelect
          />
        </div>

        <FormTextarea control={form.control} name="message" label="Mensagem" />
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
