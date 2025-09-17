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
import { SearchCombo } from "@/components/ui/search-combo";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useNavigate } from "@tanstack/react-router";
import { ShoppingCartIcon, TrashIcon } from "lucide-react";
import { useState } from "react";

export const OutletShoppingCartModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <ShoppingCartIcon />0 Produtos
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-6/12">
        <DialogHeader>
          <DialogTitle>Produtos no Carrinho</DialogTitle>
          <DialogDescription hidden></DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <div className="space-y-1">
            <Label>Cliente:</Label>
            <SearchCombo
              placeholder="Selecione o Cliente"
              onChange={(value: string) => {
                console.log(value);
              }}
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
                    Quantidade
                  </TableHead>
                  <TableHead className="border border-gray-300">
                    Preço
                  </TableHead>
                  <TableHead className="border border-gray-300">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow className="hover:bg-inherit">
                  <TableCell className="border">100040</TableCell>
                  <TableCell className="border">
                    <p className="text-wrap text-xs">
                      Capa Chuva Grande p/ Alforje Amarela (100040 D)
                    </p>
                  </TableCell>
                  <TableCell className="border w-[140px]">
                    <FormInputQty
                      min={0}
                      max={999}
                      step={1}
                      onValueChange={(e) => console.log(e)}
                    />
                  </TableCell>
                  <TableCell className="text-right border">55,66</TableCell>
                  <TableCell className="border">
                    <div className="flex items-center justify-center gap-x-1">
                      {/* <Button size="sm" variant="secondary">
                        <InfoIcon className="size-4" />
                      </Button> */}
                      <Button size="sm" variant="destructive">
                        <TrashIcon className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </div>
        <DialogFooter>
          <Button
            size="sm"
            className="text-sm"
            onClick={() => {
              navigate({ to: "/orders/new-order" });
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
