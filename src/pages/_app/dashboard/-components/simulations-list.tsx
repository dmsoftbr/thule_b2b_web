import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const SimulationsList = () => {
  return (
    <div className="flex-1 rounded-lg shadow bg-white p-6 border">
      <h2 className="font-semibold text-muted-foreground">
        Últimas Simulações
      </h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Simulação</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead className="text-right">Valor da Simulação</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">S0000001</TableCell>
            <TableCell>GERADA</TableCell>
            <TableCell>DIOGO MOREIRA</TableCell>
            <TableCell className="text-right">1.000,00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};
