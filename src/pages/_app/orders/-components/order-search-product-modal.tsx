import { FormInputQty } from "@/components/form/form-qty-input";
import {
  ServerTable,
  type ServerTableColumn,
} from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ProductModel } from "@/models/product.model";
import { MinusIcon, PlusIcon, SearchIcon } from "lucide-react";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { ProductImage } from "@/components/app/product-image";
import { formatNumber } from "@/lib/number-utils";
import { useOrder } from "../-context/order-context";
import type { PriceTableModel } from "@/models/registrations/price-table.model";
import type { OrderModel } from "@/models/orders/order-model";
import { SearchCombo } from "@/components/ui/search-combo";
import { AppTooltip } from "@/components/layout/app-tooltip";
import { addProductToOrder } from "../-utils/order-utils";
import { toast } from "sonner";
import { useAppDialog } from "@/components/app-dialog/use-app-dialog";
import { convertArrayToSearchComboItem } from "@/lib/search-combo-utils";

interface Props {
  initialPriceTable: PriceTableModel;
}

export const OrderSearchProductModal = ({ initialPriceTable }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { order, setOrder } = useOrder();
  const [priceTable, setPriceTable] =
    useState<PriceTableModel>(initialPriceTable);
  const [tableToken, setTableToken] = useState(new Date().valueOf());
  const [isFetching, setIsFetching] = useState(false);
  const { showAppDialog } = useAppDialog();

  // Mantém o priceTable do modal sincronizado com a prop (o useState inicial
  // só pega o valor da primeira renderização — se a prop mudar depois, o state
  // ficaria defasado).
  useEffect(() => {
    if (initialPriceTable) {
      setPriceTable(initialPriceTable);
    }
  }, [initialPriceTable]);

  // Força a ServerTable a refazer o fetch quando o dialog abre OU quando os
  // parâmetros que vão pra `additionalInfo` mudam (customerId/priceTableId
  // não estão nas deps internas do useEffect da ServerTable).
  useEffect(() => {
    if (isOpen) {
      setIsFetching(true);
      setTableToken(new Date().valueOf());
    }
  }, [isOpen, order.customerId, priceTable?.id]);
  async function handleAddItemToOrder(
    priceTable: PriceTableModel,
    product: ProductModel,
    orderQuantity: number,
  ) {
    if (!priceTable) {
      toast.warning("Selecione a tabela de preço");
      return;
    }
    if (!orderQuantity) orderQuantity = 1;
    if (orderQuantity == 0) orderQuantity = 1;

    // setOrder do contexto é o setter do useState (aceita updater funcional em
    // runtime), apesar de tipado como (order) => void.
    const setOrderFn = setOrder as unknown as Dispatch<
      SetStateAction<OrderModel>
    >;

    const existingItemIndex = order.items.findIndex(
      (f) => f.productId == product.id,
    );

    if (existingItemIndex >= 0) {
      setOrderFn((prev) => ({
        ...prev,
        items: prev.items.map((it) =>
          it.productId == product.id ? { ...it, orderQuantity } : it,
        ),
      }));
      toast.success("Quantidade atualizada!");
      return;
    }

    // Mesma inclusão usada pelo combo de produtos: calcula data de entrega,
    // CFOP e dispara o cálculo de impostos de cada item.
    await addProductToOrder({
      product,
      quantity: orderQuantity,
      priceTable,
      order,
      setOrder: setOrderFn,
    });
    toast.success(
      `Produto adicionado ${order.isBudget ? "na simulação" : "no pedido"}!`,
    );
  }

  const columns: ServerTableColumn[] = [
    {
      key: "photo",
      dataIndex: "id",
      title: "Produto",
      renderItem: (product) => (
        <div className="size-14">
          <ProductImage
            productId={product.id}
            alt="Foto do Produto"
            className="size-14"
            onClick={(url) => window.open(url, "_blank")}
          />
        </div>
      ),
      sortable: true,
    },
    {
      key: "id",
      dataIndex: "id",
      title: "Código",
      renderItem: (product) => (
        <span className="font-semibold text-blue-600 ">{product.id}</span>
      ),
      sortable: true,
    },
    {
      key: "referenceCode",
      dataIndex: "referenceCode",
      title: "Código Curto",
      renderItem: (product) => (
        <span className="font-semibold text-blue-600 text-sm">
          {product.referenceCode}
        </span>
      ),
      sortable: true,
    },
    {
      key: "description",
      dataIndex: "description",
      title: "Descrição",
      renderItem: (product) => (
        <span className="text-sm">{product.description}</span>
      ),
      sortable: true,
    },
    {
      key: "familyName",
      dataIndex: "family.name",
      title: "Família",
      renderItem: (product: ProductModel) => (
        <span className="text-sm">{product.productFamily?.name}</span>
      ),
      sortable: true,
    },
    {
      key: "PreçoSug",
      dataIndex: "suggestUnitPrice",
      title: "Preço Sugerido",
      renderItem: (item: ProductModel) => (
        <div className="font-semibold text-blue-600 w-full text-right">
          {formatNumber(item.suggestUnitPrice, 2)}
        </div>
      ),
      sortable: true,
    },
    {
      key: "PrecoTabela",
      dataIndex: "unitPriceInTable",
      title: "Preço Compra Unit.",
      renderItem: (item: ProductModel) => (
        <div className="font-semibold w-full text-right text-blue-600 ">
          {formatNumber(item.unitPriceInTable, 2)}
        </div>
      ),
      sortable: true,
    },
    {
      key: "qty",
      dataIndex: "id",
      title: "Quantidade",
      renderItem: (product) => (
        <FormInputQty
          min={0}
          max={999999}
          step={1}
          minusSlot={<MinusIcon className="size-3" />}
          plusSlot={<PlusIcon className="size-3" />}
          value={product.quantity ?? 1}
          onValueChange={(value) => (product.quantity = value ?? 0)}
        />
      ),
      sortable: false,
    },
    {
      key: "actions",
      dataIndex: "id",
      title: "Ações",
      renderItem: (product: ProductModel) => (
        <div>
          <Button
            disabled={product.isBlockedByException}
            onClick={async () => {
              if (!priceTable) {
                toast.warning("Selecione a Tabela de Preço");
                return;
              }

              if (product.isBlockedByException) {
                const allowedBranch = product.allowedExceptionBranches?.[0];
                await showAppDialog({
                  title: "ATENÇÃO",
                  message: allowedBranch
                    ? `Para comprar esse produto, altere o estabelecimento para ${allowedBranch}`
                    : "Produto não disponível para venda neste estabelecimento.",
                  type: "warning",
                  buttons: [{ text: "OK", autoClose: true }],
                });
                return;
              }

              // Regra de grupo de desconto: o pedido fica "preso" ao grupo
              // (tabela de exceção) do primeiro item de grupo de desconto. Não
              // permite incluir produto fora do grupo selecionado.
              const orderGroupId =
                order.items.find((it) => it.exceptionMarginPercent != null)
                  ?.exceptionTableId ?? null;
              if (orderGroupId && product.exceptionTableId !== orderGroupId) {
                await showAppDialog({
                  title: "ATENÇÃO",
                  message: "Altere o estabelecimento para comprar este produto",
                  type: "warning",
                  buttons: [{ text: "OK", autoClose: true }],
                });
                return;
              }

              if (product.orderMessage) {
                await showAppDialog({
                  message: product.orderMessage,
                  title: "ATENÇÃO",
                  type: "warning",
                  buttons: [
                    {
                      text: "OK",
                      autoClose: true,
                    },
                  ],
                  onClose: () => {
                    handleAddItemToOrder(
                      priceTable,
                      product,
                      product.quantity < 1 ? 1 : product.quantity,
                    );
                  },
                });
              } else {
                handleAddItemToOrder(
                  priceTable,
                  product,
                  product.quantity < 1 ? 1 : product.quantity,
                );
              }
            }}
          >
            <PlusIcon className="size-4" />
            Adicionar
          </Button>
        </div>
      ),
      sortable: false,
    },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button type="button" onClick={() => setIsOpen(true)}>
          <SearchIcon className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[90%]">
        <DialogHeader>
          <DialogTitle>Pesquisar Produtos</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <div className="flex flex-col w-full relative">
          {isFetching && (
            <div className="absolute inset-0 z-40 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm rounded-lg animate-in fade-in duration-200">
              <div className="flex flex-col items-center gap-4 px-10 py-8 bg-white shadow-2xl rounded-2xl border border-slate-200 min-w-[280px]">
                <div className="relative size-14">
                  <div className="absolute inset-0 rounded-full border-4 border-blue-100" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <span className="text-base font-semibold text-slate-800">
                    Buscando produtos
                  </span>
                  <span className="text-xs text-slate-500">
                    Por favor, aguarde — estamos consultando o catálogo.
                  </span>
                </div>
              </div>
            </div>
          )}
          <ServerTable<ProductModel>
            key={tableToken}
            refreshDataToken={String(tableToken)}
            onAfterGetData={() => setIsFetching(false)}
            searchSlot={
              <AppTooltip message="Tabela de Preço">
                <SearchCombo
                  className="h-9.5 min-w-[200px]"
                  defaultValue={order.customer?.priceTables[0].id}
                  staticItems={convertArrayToSearchComboItem(
                    order.customer?.priceTables ?? [],
                    "id",
                    "portalName",
                  )}
                  onSelectOption={(opt) => {
                    setPriceTable(opt[0].extra?.priceTable);
                    setTableToken(new Date().valueOf());
                  }}
                />
              </AppTooltip>
            }
            columns={columns}
            dataUrl="/registrations/products/list-paged-price-table"
            searchFields={[]}
            defaultPageSize={8}
            defaultSearchField="all"
            defaultSortFieldDataIndex="suggestUnitPrice"
            defaultSortDesc={true}
            searchAutoFocus
            showAddButton={false}
            additionalInfo={{
              priceTableId: priceTable?.id ?? "",
              customerId: order.customerId ?? 0,
              branchId: order.branchId ?? "",
            }}
          />
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
