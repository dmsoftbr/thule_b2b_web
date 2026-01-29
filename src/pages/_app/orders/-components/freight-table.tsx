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
import { useEffect, useState } from "react";

interface Props {
  data: CalcFreightsResposeDto[];
  onRefreshCalc: () => void;
  onValueChange: (
    carrierId: number,
    freightValue: number,
    term: number,
  ) => void;
}

export const FreightTable = ({ data, onRefreshCalc, onValueChange }: Props) => {
  const [hasFreeFreight, setHasFreeFreight] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState(
    data.length > 0 ? data[0].carrierId.toString() : "",
  );

  const handleValueChange = (carrierId: string) => {
    const selectedOpt = data.find((f) => f.carrierId == Number(carrierId));
    onValueChange(
      Number(carrierId),
      selectedOpt?.freightValue ?? 0,
      selectedOpt?.deliveryDays ?? 0,
    );
    setSelectedCarrier(carrierId);
  };

  useEffect(() => {
    const _hasFreeFreight =
      data.findIndex((f) => f.name.includes("(Frete Grátis)")) >= 0;
    if (_hasFreeFreight) setHasFreeFreight(true);
  }, [data]);

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
    <div>
      <RadioGroup
        defaultValue={selectedCarrier}
        onValueChange={(value) => {
          handleValueChange(value);
        }}
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
                key={item.carrierId}
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
      <ul className="text-[10px] border-t py-1">
        {hasFreeFreight && (
          <li>
            <b>FRETE GRÁTIS: </b> Nesta condição, poderá ocorrer a alteração de
            Transportadora sem aviso prévio, mas sem custos adicionais.
          </li>
        )}
        <li>
          <b>RETIRA: </b> Após a emissão da nota fiscal, os produtos estarão
          disponíveis para retirada nos horários das 09h00 às 10h00 e das 15h00
          às 16h00.
        </li>
      </ul>
    </div>
  );
};
