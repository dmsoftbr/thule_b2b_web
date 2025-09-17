import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const OrdersList = () => {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Últimos Pedidos</CardTitle>
          <CardDescription />
        </CardHeader>
        <CardContent>
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
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
};
