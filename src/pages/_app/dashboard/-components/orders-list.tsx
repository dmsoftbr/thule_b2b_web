import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const OrdersList = () => {
  return (
    <div className="rounded-lg shadow bg-white flex-1 p-6 border">
      <h2 className="font-semibold text-muted-foreground">Últimos Pedidos</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Pedido</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead className="text-right">Valor do Pedido</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">P0000001</TableCell>
            <TableCell>PEDIDO ENVIADO</TableCell>
            <TableCell>DIOGO MOREIRA</TableCell>
            <TableCell className="text-right">1.000,00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
