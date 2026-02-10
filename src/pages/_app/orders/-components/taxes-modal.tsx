import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { formatNumber } from "@/lib/number-utils";
import type { TaxResponseDto } from "@/models/dto/responses/tax-response.model";

interface Props {
  data: TaxResponseDto | undefined;
}

export const TaxesModal = ({ data }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="mr-2 rounded-full bg-yellow-400 p-0 size-5 text-[15px] flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="10px"
            width="10px"
            version="1.1"
            id="Capa_1"
            viewBox="0 0 32 32"
          >
            <g>
              <g id="info">
                <g>
                  <path
                    style={{ fill: "#030104" }}
                    d="M10,16c1.105,0,2,0.895,2,2v8c0,1.105-0.895,2-2,2H8v4h16v-4h-1.992c-1.102,0-2-0.895-2-2L20,12H8     v4H10z"
                  />
                  <circle style={{ fill: "#030104" }} cx="16" cy="4" r="4" />
                </g>
              </g>
            </g>
          </svg>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Impostos Calculados</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col border">
          <div className="grid grid-cols-4 text-sm border-b bg-neutral-200 border-neutral-300">
            <div className="border-r border-neutral-300 px-1">Imposto</div>
            <div className="border-r border-neutral-300 px-1">Valor</div>
            <div className="border-r border-neutral-300 px-1">
              Base de Cálculo
            </div>
            <div className="px-1">Alíquota</div>
          </div>
          {data?.TaxesDetail.map((item: any) => (
            <div
              className="grid grid-cols-4 border-b py-1.5 px-1 last:border-b-0 first:border-t text-sm even:bg-neutral-50"
              key={item.descricao}
            >
              <div>{item.descricao}</div>
              <div>{formatNumber(item.valor, 2)}</div>
              <div>{formatNumber(item.base_calculo, 2)}</div>
              <div>{formatNumber(item.aliquota, 2)}</div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
