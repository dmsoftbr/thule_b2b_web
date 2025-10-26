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
import { PRODUCT_ACTIVE_STATES } from "@/constants";
import { formatDate } from "@/lib/datetime-utils";
import { formatNumber } from "@/lib/number-utils";
import { cn } from "@/lib/utils";
import { type Esli011Model } from "@/models/stock/esli011.model";
import { StockService } from "@/services/stock/stock.service";
import { Loader2Icon, SearchIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export const Esli011Form = () => {
  const [esli11Data, setEsli11Data] = useState<Esli011Model>();
  const [isLoading, setIsLoading] = useState(false);
  const [productId, setProductId] = useState("");

  async function getData() {
    setIsLoading(true);
    setEsli11Data(undefined);
    try {
      const stockData = await StockService.getEsli011(productId);
      setEsli11Data(stockData);
    } catch (error) {
      console.log(error);
      toast.error("Ocorreu um erro ao tentar buscar os dados no TOTVS");
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Label>Produto</Label>
        <div className="flex gap-x-1">
          <Input
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
          />
          <Button disabled={isLoading}>Buscar</Button>
          <Button disabled={isLoading} onClick={() => getData()}>
            {isLoading && <Loader2Icon className="size-4 animate-spin" />}
            {!isLoading && <SearchIcon />}
          </Button>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <Label>Descrição</Label>
        <Input readOnly value={esli11Data?.description} />
      </div>
      <div className="flex flex-col space-y-2">
        <Label>Situação</Label>
        <Input
          readOnly
          value={
            PRODUCT_ACTIVE_STATES[
              esli11Data ? parseInt(esli11Data.productStatus) - 1 : 3
            ]
          }
          className={cn(
            esli11Data ? esli11Data.productStatus == "4" && "bg-red-300" : ""
          )}
        />
      </div>
      <div className="">
        <h2 className="bg-sky-200 px-2 rounded-tl-md py-1 rounded-tr-md">
          CARTEIRA DE PEDIDOS
        </h2>
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead>Est</TableHead>
              <TableHead>Ped Cli</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Entrega</TableHead>
              <TableHead>Dt Min Fat</TableHead>
              <TableHead>Dt Max Fat</TableHead>
              <TableHead>Qt Pedida</TableHead>
              <TableHead>Qt Atende</TableHead>
              <TableHead>Qt Aloca</TableHead>
              <TableHead>Qt Aloca</TableHead>
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
              <TableRow key={index}>
                <TableCell>{order.nrPedido}</TableCell>
                <TableCell>{order.codEstabel}</TableCell>
                <TableCell>{order.nrPedcli}</TableCell>
                <TableCell>{order.nomeAbrev}</TableCell>
                <TableCell>{formatDate(order.dtEntrega)}</TableCell>
                <TableCell>{formatDate(order.dtMinFat)}</TableCell>
                <TableCell>{formatDate(order.dtMaxFat)}</TableCell>
                <TableCell>{formatNumber(order.qtPedida, 0)}</TableCell>
                <TableCell>{formatNumber(order.qtAtendida, 0)}</TableCell>
                <TableCell>{formatNumber(order.qtAlocada, 0)}</TableCell>
                <TableCell>{formatNumber(order.qtLogAloc, 0)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="mt-2">
        <h2 className="bg-sky-200 px-2 rounded-tl-md py-1 rounded-tr-md">
          SALDO EM ESTOQUE
        </h2>
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead>Est</TableHead>
              <TableHead>Dep</TableHead>
              <TableHead>Localiz</TableHead>
              <TableHead>Disponível</TableHead>
              <TableHead>Qtde Atual</TableHead>
              <TableHead>Qt Aloc</TableHead>
              <TableHead>Qt Aloc Ped</TableHead>
              <TableHead>Qt ALoc Prod</TableHead>
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
              <TableRow key={index}>
                <TableCell>{item.codEstabel}</TableCell>
                <TableCell>{item.codDepos}</TableCell>
                <TableCell>{item.codLocaliz}</TableCell>
                <TableCell>
                  {formatNumber(
                    item.qtAtu -
                      item.qtAlocPed -
                      item.qtAlocProd -
                      item.qtAlocada,
                    0
                  )}
                </TableCell>
                <TableCell>{formatNumber(item.qtAtu, 0)}</TableCell>
                <TableCell>{formatNumber(item.qtAlocada, 0)}</TableCell>
                <TableCell>{formatNumber(item.qtAlocPed, 0)}</TableCell>
                <TableCell>{formatNumber(item.qtAlocProd, 0)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="bg-neutral-200">
              <TableHead colSpan={3}>Total</TableHead>
              <TableHead>
                {esli11Data?.stock.reduce(
                  (a, b) =>
                    (a += b.qtAtu - b.qtAlocPed - b.qtAlocProd - b.qtAlocada),
                  0
                )}
              </TableHead>
              <TableHead>
                {esli11Data?.stock.reduce((a, b) => (a += b.qtAtu), 0)}
              </TableHead>
              <TableHead>
                {esli11Data?.stock.reduce((a, b) => (a += b.qtAlocada), 0)}
              </TableHead>
              <TableHead>
                {esli11Data?.stock.reduce((a, b) => (a += b.qtAlocPed), 0)}
              </TableHead>
              <TableHead>
                {esli11Data?.stock.reduce((a, b) => (a += b.qtAlocProd), 0)}
              </TableHead>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      <div className="mt-2">
        <h2 className="bg-sky-200 px-2 rounded-tl-md py-1 rounded-tr-md">
          ORDENS DE COMPRA
        </h2>
        <Table className="border">
          <TableHeader>
            <TableRow>
              <TableHead>Est</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Ordem</TableHead>
              <TableHead>Parc</TableHead>
              <TableHead>Qtde</TableHead>
              <TableHead>Qtde Saldo</TableHead>
              <TableHead>Entrega</TableHead>
              <TableHead>Situação</TableHead>
              <TableHead>Pedido</TableHead>
              <TableHead>Embarque</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {esli11Data?.purchaseOrders?.length == 0 && (
              <TableRow>
                <TableCell>Sem dados para exibir</TableCell>
              </TableRow>
            )}
            {esli11Data?.purchaseOrders?.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.codEstabel}</TableCell>
                <TableCell>{item.itCodigo}</TableCell>
                <TableCell>{item.numeroOrdem}</TableCell>
                <TableCell>{item.parcela}</TableCell>
                <TableCell>{formatNumber(item.quantidade, 0)}</TableCell>
                <TableCell>{formatNumber(item.quantSaldo, 0)}</TableCell>
                <TableCell>{formatDate(item.dataEntrega)}</TableCell>
                <TableCell>{item.situacao}</TableCell>
                <TableCell>{item.numPedido}</TableCell>
                <TableCell>{item.embarque}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow className="bg-neutral-200">
              <TableHead colSpan={5}>Total</TableHead>
              <TableHead>{0}</TableHead>

              <TableHead colSpan={4}></TableHead>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      <div className="grid grid-cols-2 gap-x-4"></div>
    </div>
  );
};
