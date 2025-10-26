import { Button } from "@/components/ui/button";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { api, handleError } from "@/lib/api";
import { toast } from "sonner";
import type { FORM_ACTIONS } from "@/@types/form-actions";
import { FormInput } from "@/components/form/form-input";
import type { UserModel } from "@/models/user.model";
import { UserSchema } from "./schemas";
import { FormSearchCombo } from "@/components/form/form-search-combo";
import { convertArrayToSearchComboItem } from "@/lib/search-combo-utils";
import { USER_ROLES } from "@/constants";
import { FormCheckBox } from "@/components/form/form-checkbox";
import { cn } from "@/lib/utils";
import { useAppDialog } from "@/components/app-dialog/use-app-dialog";

interface Props {
  initialData: UserModel | null;
  isOpen: boolean;
  onClose: (refresh: boolean) => void;
  mode: FORM_ACTIONS;
}

export const UserForm = ({ initialData, mode, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const { showAppDialog } = useAppDialog();

  const form = useForm<z.infer<typeof UserSchema>>({
    resolver: zodResolver(UserSchema) as Resolver<z.infer<typeof UserSchema>>,
  });

  const roleWatch = useWatch({
    control: form.control,
    name: "role",
  });

  const onSubmit = async (values: z.infer<typeof UserSchema>) => {
    try {
      let newRole = 3;
      if (values.role == "ADMINISTRATOR") newRole = 0;
      if (values.role == "ADMINISTRATIVE") newRole = 1;
      if (values.role == "REPRESENTATIVE") newRole = 2;
      if (values.role == "CUSTOMER") newRole = 3;

      let data = { ...values, role: newRole };

      setIsLoading(true);
      if (mode == "ADD") {
        await api.post("/admin/users", data);
        toast.success("Usuário criado com sucesso!");
        showAppDialog({
          message: "Senha Inicial é: thule@123",
          title: "Atenção",
          type: "warning",
          buttons: [
            {
              text: "Fechar",
              variant: "secondary",
              value: "",
              autoClose: true,
            },
          ],
        });
      } else {
        await api.patch("/admin/users", data);
        toast.success("Usuário alterado com sucesso!");
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
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) =>
            console.log(errors)
          )}
          className="space-y-4"
        >
          <FormInput
            readOnly={mode != "ADD"}
            control={form.control}
            name="id"
            label="Código"
          />
          <FormInput control={form.control} name="name" label="Nome" />
          <FormInput label="E-mail" control={form.control} name="email" />
          <FormSearchCombo
            control={form.control}
            items={convertArrayToSearchComboItem(USER_ROLES, "id", "name")}
            label="Perfil"
            name="role"
            placeholder="Selecione o Perfil do Usuário"
            searchPlaceholder="Buscar Perfil"
          />
          <FormInput
            label="Domínio da Rede"
            control={form.control}
            name="networkDomain"
          />
          <FormSearchCombo
            control={form.control}
            apiEndpoint="/admin/user-groups/all"
            queryStringName=""
            labelProp="name"
            valueProp="id"
            label="Grupo de Usuários"
            name="groupId"
            placeholder="Selecione o Grupo de Usuário"
            searchPlaceholder="Buscar Grupo de Usuário"
          />
          <FormSearchCombo
            className={cn(
              "hidden space-y-2",
              roleWatch == "CUSTOMER" && "block"
            )}
            control={form.control}
            apiEndpoint="/registrations/customers/all"
            queryStringName=""
            labelProp="abbreviation"
            valueProp="id"
            label="Cliente"
            name="customerId"
            placeholder="Selecione o Cliente"
            searchPlaceholder="Buscar Cliente"
          />
          <FormSearchCombo
            className={cn(
              "hidden space-y-2",
              roleWatch == "REPRESENTATIVE" && "block"
            )}
            control={form.control}
            apiEndpoint="/registrations/representatives/all"
            queryStringName=""
            labelProp="abbreviation"
            valueProp="id"
            label="Representante"
            name="representativeId"
            placeholder="Selecione o Representante"
            searchPlaceholder="Buscar Representante"
          />
          <FormCheckBox control={form.control} name="isActive" label="Ativo" />
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
    </>
  );
};
