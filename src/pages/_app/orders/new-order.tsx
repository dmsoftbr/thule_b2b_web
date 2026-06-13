import { createFileRoute } from "@tanstack/react-router";
import { OrderForm } from "./-components/order-form";
import { AppPageHeader } from "@/components/layout/app-page-header";
import { OrderProvider } from "./-context/order-context";
import { OrdersService } from "@/services/orders/orders.service";
import { buildOrderFromBudget } from "./-utils/order-utils";
import type { OrderModel } from "@/models/orders/order-model";

export const Route = createFileRoute("/_app/orders/new-order")({
  component: NewOrderPage,
  // `fromBudget`: Id (GUID) da Simulação de origem quando o pedido é gerado a
  // partir dela. Opcional — ausente em um pedido novo em branco.
  validateSearch: (search: Record<string, unknown>): { fromBudget?: string } =>
    typeof search.fromBudget === "string"
      ? { fromBudget: search.fromBudget }
      : {},
  loaderDeps: ({ search: { fromBudget } }) => ({ fromBudget }),
  // Busca a simulação completa (cliente, tabelas de preço, itens, impostos) e
  // monta o pedido pré-preenchido. Buscar no loader (em vez de passar o objeto
  // via router state) evita perder dados aninhados na serialização do history.
  loader: async ({ deps: { fromBudget } }): Promise<OrderModel | undefined> => {
    if (!fromBudget) return undefined;
    const budget = await OrdersService.getById(fromBudget);
    return buildOrderFromBudget(budget);
  },
});

function NewOrderPage() {
  const prefilledOrder = Route.useLoaderData();

  return (
    <AppPageHeader
      titleSlot={
        prefilledOrder?.budgetId
          ? "Gerar Pedido de Venda"
          : "Novo Pedido de Venda"
      }
    >
      <OrderProvider formMode="NEW" initialOrder={prefilledOrder ?? undefined}>
        <OrderForm />
      </OrderProvider>
    </AppPageHeader>
  );
}
