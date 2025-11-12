import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatNumber } from "@/lib/number-utils";
import type { CalcFreightsResposeDto } from "@/models/dto/responses/calculated-freights-response.model";
import { useState } from "react";

interface Props {
  data: CalcFreightsResposeDto[];
  onRefreshCalc: () => void;
}

export const FreightTable = ({ data, onRefreshCalc }: Props) => {
  const [selectedCarrier, setSelectedCarrier] = useState(
    data.length > 0 ? data[0].carrierId.toString() : ""
  );

  if (!data || data.length == 0)
    return (
      <div className="bg-red-200 rounded-md flex items-center justify-center flex-col space-y-2 p-2 mb-2">
        <p className="text-sm font-semibold">
          Algo deu errado ao conectar ao TOTVS para calculo dos Fretes.
        </p>
        <Button
          onClick={() => {
            onRefreshCalc();
          }}
        >
          Clique aqui para tentar novamente
        </Button>
      </div>
    );

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
          {data.map((item: CalcFreightsResposeDto) => (
            <TableRow
              className={
                selectedCarrier == item.carrierId.toString()
                  ? "bg-blue-100"
                  : ""
              }
            >
              <TableCell>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={item.carrierId.toString()}
                    id={item.carrierId.toString()}
                  />
                </div>
              </TableCell>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell>{formatNumber(item.deliveryDays, 0)}</TableCell>
              <TableCell className="text-right">
                {formatNumber(item.freightValue, 2)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </RadioGroup>
  );
};
