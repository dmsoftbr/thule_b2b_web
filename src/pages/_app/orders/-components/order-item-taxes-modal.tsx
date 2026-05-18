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
import type { OrderItemTaxModel } from "@/models/orders/order-item-tax-model";

interface Props {
  productId: string;
  taxes: OrderItemTaxModel[] | undefined;
}

// Tributos da reforma (CBS/IBS) — escondidos da UI, mas mantidos no state
// para envio ao backend. Para reexibir, basta esvaziar este array.
const HIDDEN_PREFIXES = ["CBS", "IBS"];

const isHidden = (taxName: string) => {
  const name = (taxName ?? "").trim().toUpperCase();
  return HIDDEN_PREFIXES.some((p) => name === p || name.startsWith(`${p} `));
};

export const OrderItemTaxesModal = ({ productId, taxes }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const visibleTaxes = (taxes ?? []).filter((t) => !isHidden(t.taxName));
  const total = visibleTaxes.reduce((acc, t) => acc + (t.taxValue ?? 0), 0);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          title="Ver detalhamento dos impostos"
          className="rounded-full bg-yellow-400 p-0 size-5 text-[15px] flex items-center justify-center hover:bg-yellow-500 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="10px"
            width="10px"
            version="1.1"
            viewBox="0 0 32 32"
          >
            <g>
              <g>
                <path
                  style={{ fill: "#030104" }}
                  d="M10,16c1.105,0,2,0.895,2,2v8c0,1.105-0.895,2-2,2H8v4h16v-4h-1.992c-1.102,0-2-0.895-2-2L20,12H8     v4H10z"
                />
                <circle style={{ fill: "#030104" }} cx="16" cy="4" r="4" />
              </g>
            </g>
          </svg>
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Impostos do Item — {productId}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className="flex flex-col border">
          <div className="grid grid-cols-5 text-sm border-b bg-neutral-200 border-neutral-300 font-semibold">
            <div className="border-r border-neutral-300 px-1">Imposto</div>
            <div className="border-r border-neutral-300 px-1 text-right">
              Base de Cálculo
            </div>
            <div className="border-r border-neutral-300 px-1 text-right">
              MVA
            </div>
            <div className="border-r border-neutral-300 px-1 text-right">
              Alíquota
            </div>
            <div className="px-1 text-right">Valor</div>
          </div>
          {visibleTaxes.length === 0 && (
            <div className="text-center py-3 text-sm text-neutral-500">
              Nenhum imposto calculado para este item.
            </div>
          )}
          {visibleTaxes.map((t) => (
            <div
              className="grid grid-cols-5 border-b py-1.5 px-1 last:border-b-0 first:border-t text-sm even:bg-neutral-50 tabular-nums"
              key={t.id}
            >
              <div className="font-medium">{t.taxName}</div>
              <div className="text-right">{formatNumber(t.taxBase, 2)}</div>
              <div className="text-right">
                {formatNumber(t.mva ?? 0, 2)}%
              </div>
              <div className="text-right">
                {formatNumber(t.taxPercentual, 2)}%
              </div>
              <div className="text-right">{formatNumber(t.taxValue, 2)}</div>
            </div>
          ))}
          {visibleTaxes.length > 0 && (
            <div className="grid grid-cols-5 border-t-2 border-neutral-400 py-1.5 px-1 text-sm font-semibold bg-neutral-100 tabular-nums">
              <div className="col-span-4 text-right pr-2">Total</div>
              <div className="text-right">{formatNumber(total, 2)}</div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
