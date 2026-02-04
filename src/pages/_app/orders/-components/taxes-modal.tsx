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
import { useOrder } from "../-context/order-context";
import type { OrderItemTaxModel } from "@/models/orders/order-item-tax-model";
import { formatNumber } from "@/lib/number-utils";

interface Props {
  data: any;
}

export const TaxesModal = ({ data }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const { order } = useOrder();

  // const getTaxes = () => {
  //   const list: OrderItemTaxModel[] = [];
  //   for (let item of order.items) {
  //     if (item.taxes) {
  //       for (let tax of item.taxes) {
  //         let existingTax = list.findIndex((f) => f.taxName == tax.taxName);
  //         if (existingTax >= 0) {
  //           list[existingTax].taxValue += tax.taxValue;
  //         } else {
  //           list.push({
  //             id: "",
  //             itemId: "",
  //             orderId: "",
  //             taxBase: 0,
  //             taxBaseReduction: 0,
  //             taxName: tax.taxName,
  //             taxPercentual: 0,
  //             taxValue: tax.taxValue,
  //           });
  //         }
  //       }
  //     }
  //   }
  //   return list;
  // };
  console.log("IMPOSTS", data);
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
        <div>
          <div className="grid grid-cols-4">
            <div>Imposto</div>
            <div>Valor</div>
            <div>Base de Cálculo</div>
            <div>Alíquota</div>
            {data?.TaxesDetail.map((item: any) => (
              <>
                <div>{item.descricao}</div>
                <div>{formatNumber(item.valor, 2)}</div>
                <div>{formatNumber(item.base_calculo, 2)}</div>
                <div>{formatNumber(item.aliquota, 2)}</div>
              </>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
