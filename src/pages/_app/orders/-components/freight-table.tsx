import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const FreightTable = () => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead className="w-[100px]">Transportadora</TableHead>
          <TableHead>Prazo (dias)</TableHead>
          <TableHead>Valor R$</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>
            <input
              type="radio"
              className="size-4 !bg-transparent"
              name="rdTransp"
            />
          </TableCell>
          <TableCell className="font-medium">JAMEF</TableCell>
          <TableCell>2</TableCell>
          <TableCell className="text-right">0,00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <input type="radio" className="size-4" name="rdTransp" />
          </TableCell>
          <TableCell className="font-medium">SEDEX</TableCell>
          <TableCell>1</TableCell>
          <TableCell className="text-right">0,00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <input type="radio" className="size-4" name="rdTransp" />
          </TableCell>
          <TableCell className="font-medium">PAC</TableCell>
          <TableCell>3</TableCell>
          <TableCell className="text-right">0,00</TableCell>
        </TableRow>

        <TableRow>
          <TableCell>
            <input type="radio" className="size-4" name="rdTransp" />
          </TableCell>
          <TableCell className="font-medium">TNT</TableCell>
          <TableCell>2</TableCell>
          <TableCell className="text-right">0,00</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>
            <input type="radio" className="size-4" name="rdTransp" />
          </TableCell>
          <TableCell className="font-medium">RETIRA</TableCell>
          <TableCell>1</TableCell>
          <TableCell className="text-right">0,00</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
};
