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

  // MVA não vem do Datasul como campo próprio — é derivado das bases:
  // a base da ST = (mercadoria + IPI) × (1 + MVA), logo
  //   MVA% = base_ST / (base_ICMS + IPI) − 1.
  // Os campos existem no TaxesDetail tanto em edição (resposta do Datasul, onde
  // a linha de ST chama "ST") quanto em visualização (buildTaxesDetailFromOrderItems,
  // onde chama "ICMS-ST").
  const detail = data?.TaxesDetail ?? [];
  const findRow = (...names: string[]) =>
    detail.find((r: any) =>
      names.includes((r?.descricao ?? "").trim().toUpperCase()),
    );
  const stRow = findRow("ST", "ICMS-ST", "ICMS ST");
  const baseSt = stRow?.base_calculo ?? 0;
  const baseIcms = findRow("ICMS")?.base_calculo ?? 0;
  const ipiValor = findRow("IPI")?.valor ?? 0;
  const mvaBase = baseIcms + ipiValor;
  const mvaPercent = stRow && mvaBase > 0 ? (baseSt / mvaBase - 1) * 100 : 0;

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
          <div className="grid grid-cols-5 text-sm border-b bg-neutral-200 border-neutral-300">
            <div className="border-r border-neutral-300 px-1">Imposto</div>
            <div className="border-r border-neutral-300 px-1">Valor</div>
            <div className="border-r border-neutral-300 px-1">
              Base de Cálculo
            </div>
            <div className="border-r border-neutral-300 px-1">Alíquota</div>
            <div className="px-1">MVA %</div>
          </div>
          {data?.TaxesDetail.filter((item: any) => {
            // Oculta tributos da reforma (CBS e variantes de IBS — "IBS",
            // "IBS Mun", "IBS UF" etc) do modal de impostos calculados.
            const name = (item?.descricao ?? "").trim().toUpperCase();
            if (name === "CBS" || name.startsWith("CBS ")) return false;
            if (name === "IBS" || name.startsWith("IBS ")) return false;
            return true;
          }).map((item: any) => {
            const name = (item?.descricao ?? "").trim().toUpperCase();
            const isSt = name === "ST" || name === "ICMS-ST" || name === "ICMS ST";
            return (
              <div
                className="grid grid-cols-5 border-b py-1.5 px-1 last:border-b-0 first:border-t text-sm even:bg-neutral-50"
                key={item.descricao}
              >
                <div>{item.descricao}</div>
                <div>{formatNumber(item.valor, 2)}</div>
                <div>{formatNumber(item.base_calculo, 2)}</div>
                <div>{formatNumber(item.aliquota, 2)}</div>
                <div>{isSt && mvaPercent > 0 ? formatNumber(mvaPercent, 2) : ""}</div>
              </div>
            );
          })}
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
