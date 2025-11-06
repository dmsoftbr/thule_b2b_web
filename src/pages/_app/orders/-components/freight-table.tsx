import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";

export const FreightTable = () => {
  const [selectedCarrier, setSelectedCarrier] = useState("1");
  return (
    <RadioGroup
      defaultValue={selectedCarrier}
      onValueChange={(value) => setSelectedCarrier(value)}
    >
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
          <TableRow className={selectedCarrier == "1" ? "bg-blue-100" : ""}>
            <TableCell>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="1" id="1" />
              </div>
            </TableCell>
            <TableCell className="font-medium">JAMEF</TableCell>
            <TableCell>2</TableCell>
            <TableCell className="text-right">0,00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="2" id="2" />
              </div>
            </TableCell>
            <TableCell className="font-medium">SEDEX</TableCell>
            <TableCell>1</TableCell>
            <TableCell className="text-right">0,00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="3" id="3" />
              </div>
            </TableCell>
            <TableCell className="font-medium">PAC</TableCell>
            <TableCell>3</TableCell>
            <TableCell className="text-right">0,00</TableCell>
          </TableRow>

          <TableRow>
            <TableCell>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="4" id="4" />
              </div>
            </TableCell>
            <TableCell className="font-medium">TNT</TableCell>
            <TableCell>2</TableCell>
            <TableCell className="text-right">0,00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="5" id="5" />
              </div>
            </TableCell>
            <TableCell className="font-medium">RETIRA</TableCell>
            <TableCell>1</TableCell>
            <TableCell className="text-right">0,00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </RadioGroup>
  );
};
