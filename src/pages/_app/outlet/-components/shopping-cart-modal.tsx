import { FormInputQty } from "@/components/form/form-qty-input";
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
import { Label } from "@/components/ui/label";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "@tanstack/react-router";
import { ShoppingCartIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { useOutletCart } from "./outlet-context";
import { formatNumber } from "@/lib/number-utils";
import { CustomersCombo } from "@/components/app/customers-combo";
import { toast } from "sonner";
import { type CustomerModel } from "@/models/registrations/customer.model";
import { generateOrderFromOutlet } from "../../orders/-utils/order-utils";
import type { OutletCartItem } from "@/models/outlet/outlet-cart-item.model";

type OutletOrderData = {
  customerId: number;
  customer: CustomerModel;
  paymentConditionId: number;
  deliveryLocationId: string;
  branchId: string;
  items: OutletCartItem[];
};

export const OutletShoppingCartModal = () => {
  const [selectedCustomer, setSelectedCustomer] = useState<
    CustomerModel | undefined
  >(undefined);
  const [isOpen, setIsOpen] = useState(false);
  const {
    totalItems,
    totalPrice,
    items,
    updateItemQuantity,
    removeItem,
    clearCart,
  } = useOutletCart();
  const navigate = useNavigate();

  const handleClearShoppingCart = () => {
    clearCart();
    setIsOpen(false);
  };

  const handleGenerateOrder = async () => {
    if (!selectedCustomer) {
      toast.info("Selecione o Cliente Primeiro");
      return;
    }

    if (totalItems == 0) {
      toast.info("Sem produtos no carrinho para gerar o pedido!");
      return;
    }
    const data: OutletOrderData = {
      customerId: selectedCustomer.id,
      customer: selectedCustomer,
      paymentConditionId: selectedCustomer.paymentConditionId,
      deliveryLocationId: selectedCustomer.deliveryLocations[0].id,
      branchId: selectedCustomer.branchId,
      items,
    };

    const newOrder = await generateOrderFromOutlet(data);
    clearCart();
    navigate({
      to: "/orders/new-outlet-order",
      state: (prev) => ({
        ...prev,
        routerData: newOrder,
      }),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={totalItems == 0 ? "default" : "green"}>
          <ShoppingCartIcon />
          {totalItems} Produtos
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-fit w-6/12">
        <DialogHeader>
          <DialogTitle>Produtos no Carrinho</DialogTitle>
          <DialogDescription hidden></DialogDescription>
        </DialogHeader>
        {totalItems == 0 && (
          <div className="flex flex-col items-center space-y-4">
            <h2 className="flex flex-col items-center">
              <span className="text-5xl">🥲</span>
              <p className="text-lg font-semibold">
                Seu carrinho ainda está vazio!
              </p>
            </h2>
            <Button
              variant="ghost"
              className="cursor-pointer text-blue-600"
              onClick={() => setIsOpen(false)}
            >
              Clique aqui para adicionar produtos
            </Button>
          </div>
        )}
        {totalItems > 0 && (
          <div className="space-y-2">
            <div className="space-y-1">
              <Label>Cliente:</Label>
              <CustomersCombo
                onSelect={(customer) => setSelectedCustomer(customer)}
                closeOnSelect
              />
            </div>
            <div>
              <Table className="w-full table-auto">
                <TableHeader>
                  <TableRow className="hover:bg-gray-200 bg-gray-200 border border-gray-300">
                    <TableHead className="border border-gray-300">
                      Produto
                    </TableHead>
                    <TableHead className="border border-gray-300">
                      Descrição
                    </TableHead>
                    <TableHead className="border border-gray-300">
                      Outlet
                    </TableHead>
                    <TableHead className="border border-gray-300">
                      Quantidade
                    </TableHead>
                    <TableHead className="border border-gray-300">
                      Preço
                    </TableHead>
                    <TableHead className="border border-gray-300">
                      Total
                    </TableHead>

                    <TableHead className="border border-gray-300">
                      Ações
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, index) => (
                    <TableRow className="hover:bg-inherit" key={index}>
                      <TableCell className="border">{item.id}</TableCell>
                      <TableCell className="border">
                        <p className="text-wrap text-xs">{item.name}</p>
                      </TableCell>
                      <TableCell>{item.priceTableId}</TableCell>
                      <TableCell className="border w-[140px]">
                        <FormInputQty
                          min={0}
                          max={999}
                          step={1}
                          onValueChange={(e) =>
                            updateItemQuantity(item.id, e ?? 1)
                          }
                          value={item.quantity}
                        />
                      </TableCell>
                      <TableCell className="text-right border w-[120px]">
                        R$ {formatNumber(item.price, 2)}
                      </TableCell>
                      <TableCell className="text-right border w-[120px]">
                        R$ {formatNumber(item.price * item.quantity, 2)}
                      </TableCell>
                      <TableCell className="border">
                        <div className="flex items-center justify-center gap-x-1">
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => removeItem(item.id)}
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter className="bg-neutral-200">
                  <TableRow>
                    <TableHead
                      colSpan={5}
                      className="border border-neutral-300"
                    >
                      Total:
                    </TableHead>
                    <TableHead className="border border-neutral-300 text-right">
                      R$ {formatNumber(totalPrice, 2)}
                    </TableHead>
                    <TableHead className="border border-neutral-300" />
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
          </div>
        )}
        <DialogFooter className="">
          {totalItems > 0 && (
            <div className="flex items-center justify-between w-full">
              <Button
                variant="destructive"
                onClick={() => handleClearShoppingCart()}
              >
                Esvaziar Carrinho
              </Button>
              <div className="flex gap-x-2">
                <Button
                  size="sm"
                  className="text-sm"
                  onClick={() => {
                    handleGenerateOrder();
                  }}
                >
                  Gerar Pedido
                </Button>
                <Button
                  size="sm"
                  className="text-sm"
                  variant="secondary"
                  onClick={() => setIsOpen(false)}
                >
                  Adicionar mais Produtos
                </Button>
              </div>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
