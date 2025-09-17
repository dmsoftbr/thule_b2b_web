import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SearchIcon } from "lucide-react";

export const Esli011Form = () => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Label>Produto</Label>
        <div className="flex gap-x-1">
          <Input />
          <Button>Buscar</Button>
          <Button>
            <SearchIcon />
          </Button>
        </div>
      </div>
      <div className="flex flex-col space-y-2">
        <Label>Descrição</Label>
        <Input readOnly />
      </div>
      <div className="flex flex-col space-y-2">
        <Label>Situação</Label>
        <Input readOnly />
      </div>
      <div className="">
        <h2 className="bg-sky-200">CARTEIRA DE PEDIDOS</h2>
        <Table>
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
            <TableRow>
              <TableCell>Sem dados para exibir</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="mt-2">
        <h2 className="bg-sky-200">SALDO EM ESTOQUE</h2>
        <Table>
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
            <TableRow>
              <TableCell>Sem dados para exibir</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="mt-2">
        <h2 className="bg-sky-200">ORDENS DE COMPRA</h2>
        <Table>
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
            <TableRow>
              <TableCell>Sem dados para exibir</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className="grid grid-cols-2 gap-x-4"></div>
    </div>
  );
};
