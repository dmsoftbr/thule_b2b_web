import { FormCheckBox } from "@/components/form/form-checkbox";
import { FormInput } from "@/components/form/form-input";
import { AppPageHeader } from "@/components/layout/app-page-header";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { createFileRoute } from "@tanstack/react-router";
import { useForm } from "react-hook-form";

export const Route = createFileRoute("/_app/admin/settings/")({
  component: SettingsComponent,
});

function SettingsComponent() {
  const form = useForm();
  const onSubmit = () => {};
  return (
    <AppPageHeader titleSlot="Configurações do B2B">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="p-2 space-y-4 container mx-auto"
        >
          <div className="grid grid-cols-5 gap-x-4">
            <FormInput
              control={form.control}
              label="Estabelecimento de Estoque"
              name="stockBranchId"
            />
            <FormInput
              control={form.control}
              label="Estabelecimento de Outlet"
              name="outletBranchId"
            />
          </div>

          <div className="grid grid-cols-5 gap-x-4">
            <FormInput
              control={form.control}
              label="Itens por pedido"
              name="maxOrderItemsCount"
            />
            <FormCheckBox
              control={form.control}
              name="allocateOutletOrders"
              label="Alocar Pedido de Outlet"
            />
            <FormCheckBox
              control={form.control}
              label="Habilita Transportadora RETIRA"
              name="enableRetiraCarrier"
            />
            <FormInput
              control={form.control}
              label="Portador Financeiro Outlet"
              name="financialCarrierOutlet"
            />
            <FormInput
              control={form.control}
              label="Tabela de Preço Sugerido"
              name="suggestPriceTableId"
            />
          </div>
          <FormInput
            control={form.control}
            label="Pasta Documentos Anexos"
            name="attachsFolder"
          />
          <FormInput
            control={form.control}
            label="Pasta de DANFE/XML"
            name="fiscalFolder"
          />
          <FormInput
            control={form.control}
            label="Pasta Imagens Produtos"
            name="productImagesFolder"
          />
          <div className="flex items-center justify-end gap-x-2">
            <Button>Gravar</Button>
            <Button variant="secondary">Desfazer</Button>
          </div>
        </form>
      </Form>
    </AppPageHeader>
  );
}
