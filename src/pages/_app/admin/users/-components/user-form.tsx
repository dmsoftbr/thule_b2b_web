import { FormCheckBox } from "@/components/form/form-checkbox";
import { FormInput } from "@/components/form/form-input";
import { FormSearchCombo } from "@/components/form/form-search-combo";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { USER_ROLES } from "@/constants";
import { convertArrayToSearchComboItem } from "@/lib/search-combo-utils";
import { useNavigate } from "@tanstack/react-router";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { type UserSchema } from "./schemas";
import { CustomersCombo } from "@/components/app/customers-combo";

export const UserForm = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof UserSchema>>({
    defaultValues: {
      customerId: 0,
      email: "",
      groupId: "",
      id: "",
      isActive: true,
      name: "",
      networkDomain: "",
      representativeId: 0,
      role: "",
    },
  });

  const roleWatch = useWatch({
    control: form.control,
    name: "role",
  });

  async function onSubmit(values: z.infer<typeof UserSchema>) {
    console.log(values);
    navigate({ to: "/admin/users" });
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex items-center justify-center flex-col"
        >
          <div className="flex flex-col w-full space-y-2 p-4 container max-w-lg">
            <FormInput label="Usuário" control={form.control} name="id" />
            <FormInput label="Nome" control={form.control} name="name" />
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
              items={convertArrayToSearchComboItem(USER_ROLES, "id", "name")}
              label="Grupo de Usuários"
              name="groupId"
              placeholder="Selecione o Grupo de Usuários"
              searchPlaceholder="Buscar Grupo"
            />
            <div className="form-group">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cliente</FormLabel>
                    <FormControl>
                      <CustomersCombo
                        disabled={roleWatch != "CUSTOMER"}
                        defaultValue={field.value}
                        onSelect={(customer) => {
                          field.onChange(customer?.id);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormSearchCombo
              disabled={roleWatch != "REPRESENTATIVE"}
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
            <FormCheckBox
              control={form.control}
              name="isActive"
              label="Ativo"
            />
          </div>
          <div className="bg-neutral-100 border-t px-2 py-2 flex items-center justify-end gap-x-2 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate({ to: "/admin/users" })}
            >
              Cancelar
            </Button>

            <Button size="sm" type="submit">
              Gravar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
