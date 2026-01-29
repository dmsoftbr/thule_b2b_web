import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/lib/datetime-utils";
import { formatNumber } from "@/lib/number-utils";
import { cn } from "@/lib/utils";
import { type Esli011Model } from "@/models/stock/esli011.model";
import { StockService } from "@/services/stock/stock.service";
import { CheckIcon, Loader2Icon, SearchIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SearchProductModal } from "@/components/app/search-product-modal";
import { handleError } from "@/lib/api";

export const Esli011Form = () => {
  const [esli11Data, setEsli11Data] = useState<Esli011Model>();
  const [isLoading, setIsLoading] = useState(false);
  const [productId, setProductId] = useState("");

  async function getData(itemId: string = "") {
    if (!productId && !itemId) return;
    setIsLoading(true);
    setEsli11Data(undefined);
    try {
      const stockData = await StockService.getEsli011(
        itemId ? itemId : productId,
      );
      setEsli11Data(stockData);
    } catch (error) {
      toast.error(handleError(error));
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    setEsli11Data(undefined);
  }, [productId]);

  return (
    <div className="space-y-4 px-2">
      <div className="flex gap-x-2">
        <div className="flex flex-col space-y-2">
          <Label>Produto</Label>
          <div className="flex gap-x-1">
            <Input
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              onKeyDown={(e) => {
                if (e.key == "Enter") {
                  e.preventDefault();
                  getData();
                }
              }}
            />
            <SearchProductModal
              onSelect={(product) => {
                setProductId(product?.id ?? "");
                if (product) getData(product.id);
              }}
            />
            <Button
              disabled={isLoading}
              onClick={() => getData()}
              variant="secondary"
            >
              {isLoading && <Loader2Icon className="size-4 animate-spin" />}
              {!isLoading && <CheckIcon />}
            </Button>
          </div>
        </div>
        <div className="flex flex-col space-y-2 flex-1">
          <Label>Descrição</Label>
          <Input readOnly value={esli11Data?.description ?? ""} />
        </div>
        <div className="flex flex-col space-y-2 min-w-[300px]">
          <Label>Situação</Label>
          <Input
            readOnly
            value={esli11Data?.productStatus ?? ""}
            className={cn(
              esli11Data
                ? esli11Data.productStatus == "Totalmente Obsoleto" &&
                    "bg-red-300"
                : "",
            )}
          />
        </div>
      </div>
      <div className="">
        <h2 className="bg-blue-400 text-white px-2 rounded-tl-md py-1 rounded-tr-md">
          CARTEIRA DE PEDIDOS
        </h2>
        <Table className="border">
          <TableHeader>
            <TableRow className="bg-neutral-200">
              <TableHead className="border border-neutral-300">
                Pedido
              </TableHead>
              <TableHead className="border border-neutral-300">Est</TableHead>
              <TableHead className="border border-neutral-300">
                Ped Cli
              </TableHead>
              <TableHead className="border border-neutral-300">
                Cliente
              </TableHead>
              <TableHead className="border border-neutral-300">
                Entrega
              </TableHead>
              <TableHead className="border border-neutral-300">
                Dt Min Fat
              </TableHead>
              <TableHead className="border border-neutral-300">
                Dt Max Fat
              </TableHead>
              <TableHead className="border border-neutral-300">
                Qt Pedida
              </TableHead>
              <TableHead className="border border-neutral-300">
                Qt Atende
              </TableHead>
              <TableHead className="border border-neutral-300">
                Qt Aloca Ped
              </TableHead>
              <TableHead className="border border-neutral-300">
                Qt Aloca Prod
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {esli11Data?.orders?.length == 0 && (
              <TableRow>
                <TableCell colSpan={11} className="text-center">
                  Sem pedidos com saldo com este produto em aberto
                </TableCell>
              </TableRow>
            )}
            {esli11Data?.orders?.map((order, index) => (
              <TableRow
                key={index}
                className="even:bg-neutral-100 hover:bg-neutral-300"
              >
                <TableCell className="border">{order.nrPedido}</TableCell>
                <TableCell className="border">{order.codEstabel}</TableCell>
                <TableCell className="border">{order.nrPedcli}</TableCell>
                <TableCell className="border">{order.nomeAbrev}</TableCell>
                <TableCell className="border">
                  {formatDate(order.dtEntrega)}
                </TableCell>
                <TableCell className="border">
                  {formatDate(order.dtMinFat)}
                </TableCell>
                <TableCell className="border">
                  {formatDate(order.dtMaxFat)}
                </TableCell>
                <TableCell className="border">
                  {formatNumber(order.qtPedida, 0)}
                </TableCell>
                <TableCell className="border">
                  {formatNumber(order.qtAtendida, 0)}
                </TableCell>
                <TableCell className="border">
                  {formatNumber(order.qtAlocada, 0)}
                </TableCell>
                <TableCell className="border">
                  {formatNumber(order.qtLogAloc, 0)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="bg-neutral-500 ">
              <TableHead
                className="text-white border border-neutral-200"
                colSpan={7}
              >
                Total
              </TableHead>
              <TableHead className="text-white border border-neutral-200">
                {esli11Data?.orders.reduce((a, b) => (a += b.qtPedida), 0)}
              </TableHead>
              <TableHead className="text-white border border-neutral-200">
                {esli11Data?.orders.reduce((a, b) => (a += b.qtAtendida), 0)}
              </TableHead>
              <TableHead className="text-white border border-neutral-200">
                {esli11Data?.orders.reduce((a, b) => (a += b.qtAlocada), 0)}
              </TableHead>
              <TableHead className="text-white border border-neutral-200">
                {esli11Data?.orders.reduce((a, b) => (a += b.qtLogAloc), 0)}
              </TableHead>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      <div className="mt-2">
        <h2 className="bg-emerald-600 text-white px-2 rounded-tl-md py-1 rounded-tr-md">
          SALDO EM ESTOQUE
        </h2>
        <Table className="border">
          <TableHeader>
            <TableRow className="bg-neutral-200">
              <TableHead className="border border-neutral-300">Est</TableHead>
              <TableHead className="border border-neutral-300">Dep</TableHead>
              <TableHead className="border border-neutral-300">
                Localiz
              </TableHead>
              <TableHead className="border border-neutral-300">
                Disponível
              </TableHead>
              <TableHead className="border border-neutral-300">
                Qtde Atual
              </TableHead>
              <TableHead className="border border-neutral-300">
                Qt Aloc
              </TableHead>
              <TableHead className="border border-neutral-300">
                Qt Aloc Ped
              </TableHead>
              <TableHead className="border border-neutral-300">
                Qt ALoc Prod
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {esli11Data?.stock?.length == 0 && (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  Sem dados para exibir
                </TableCell>
              </TableRow>
            )}
            {esli11Data?.stock?.map((item, index) => (
              <TableRow key={index} className="even:bg-neutral-100">
                <TableCell className="border border-neutral-200">
                  {item.codEstabel}
                </TableCell>
                <TableCell className="border border-neutral-200">
                  {item.codDepos}
                </TableCell>
                <TableCell className="border border-neutral-200">
                  {item.codLocaliz}
                </TableCell>
                <TableCell className="border border-neutral-200">
                  {formatNumber(
                    item.qtAtu -
                      item.qtAlocPed -
                      item.qtAlocProd -
                      item.qtAlocada,
                    0,
                  )}
                </TableCell>
                <TableCell className="border border-neutral-200">
                  {formatNumber(item.qtAtu, 0)}
                </TableCell>
                <TableCell className="border border-neutral-200">
                  {formatNumber(item.qtAlocada, 0)}
                </TableCell>
                <TableCell className="border border-neutral-200">
                  {formatNumber(item.qtAlocPed, 0)}
                </TableCell>
                <TableCell className="border border-neutral-200">
                  {formatNumber(item.qtAlocProd, 0)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="bg-neutral-500">
              <TableHead
                className="text-neutral-100 border border-neutral-100"
                colSpan={3}
              >
                Total
              </TableHead>
              <TableHead className="text-neutral-100 border border-neutral-100">
                {esli11Data?.stock.reduce(
                  (a, b) =>
                    (a += b.qtAtu - b.qtAlocPed - b.qtAlocProd - b.qtAlocada),
                  0,
                )}
              </TableHead>
              <TableHead className="text-neutral-100 border border-neutral-100">
                {esli11Data?.stock.reduce((a, b) => (a += b.qtAtu), 0)}
              </TableHead>
              <TableHead className="text-neutral-100 border border-neutral-100">
                {esli11Data?.stock.reduce((a, b) => (a += b.qtAlocada), 0)}
              </TableHead>
              <TableHead className="text-neutral-100 border border-neutral-100">
                {esli11Data?.stock.reduce((a, b) => (a += b.qtAlocPed), 0)}
              </TableHead>
              <TableHead className="text-neutral-100 border border-neutral-100">
                {esli11Data?.stock.reduce((a, b) => (a += b.qtAlocProd), 0)}
              </TableHead>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      <div className="mt-2 ">
        <h2 className="bg-orange-300 px-2 rounded-tl-md py-1 rounded-tr-md">
          ORDENS DE COMPRA
        </h2>
        <Table className="border">
          <TableHeader>
            <TableRow className="bg-neutral-200">
              <TableHead className="border border-neutral-300">Est</TableHead>
              <TableHead className="border border-neutral-300">Item</TableHead>
              <TableHead className="border border-neutral-300">Ordem</TableHead>
              <TableHead className="border border-neutral-300">Parc</TableHead>
              <TableHead className="border border-neutral-300">Qtde</TableHead>
              <TableHead className="border border-neutral-300">
                Qtde Saldo
              </TableHead>
              <TableHead className="border border-neutral-300">
                Entrega
              </TableHead>
              <TableHead className="border border-neutral-300">
                Situação
              </TableHead>
              <TableHead className="border border-neutral-300">
                Pedido
              </TableHead>
              <TableHead className="border border-neutral-300">
                Embarque
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {esli11Data?.purchaseOrders?.length == 0 && (
              <TableRow>
                <TableCell colSpan={10} className="text-center">
                  Sem dados para exibir
                </TableCell>
              </TableRow>
            )}
            {esli11Data?.purchaseOrders?.map((item, index) => (
              <TableRow key={index} className="even:bg-neutral-100">
                <TableCell className="border border-neutral-200">
                  {item.codEstabel}
                </TableCell>
                <TableCell className="border border-neutral-200">
                  {item.itCodigo}
                </TableCell>
                <TableCell className="border border-neutral-200">
                  {item.numeroOrdem}
                </TableCell>
                <TableCell className="border border-neutral-200">
                  {item.parcela}
                </TableCell>
                <TableCell className="border border-neutral-200">
                  {formatNumber(item.quantidade, 0)}
                </TableCell>
                <TableCell className="border border-neutral-200">
                  {formatNumber(item.quantSaldo, 0)}
                </TableCell>
                <TableCell className="border border-neutral-200">
                  {formatDate(item.dataEntrega)}
                </TableCell>
                <TableCell className="border border-neutral-200">
                  {item.situacao}
                </TableCell>
                <TableCell className="border border-neutral-200">
                  {item.numPedido}
                </TableCell>
                <TableCell className="border border-neutral-200">
                  {item.embarque}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="bg-neutral-500 text-white">
              <TableHead
                className="border border-neutral-100 text-white"
                colSpan={5}
              >
                Total
              </TableHead>
              <TableHead className="border border-neutral-100 text-white">
                {0}
              </TableHead>

              <TableHead
                className="border border-neutral-100 text-white"
                colSpan={4}
              ></TableHead>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
};
