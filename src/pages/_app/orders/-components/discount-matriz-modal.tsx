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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PercentCircleIcon } from "lucide-react";
import { useState } from "react";

export const DiscountMatrizModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={() => setIsOpen(true)}
        >
          <PercentCircleIcon className="size-4" />
          Matriz de Descontos
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-[30%]">
        <DialogHeader>
          <DialogTitle>Matriz de Desconto</DialogTitle>
          <DialogDescription>
            Descontos Progressivos conforme o Valor do Pedido
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col space-y-6 mt-2">
          <Table className="border">
            <TableHeader>
              <TableRow className="bg-neutral-200">
                <TableHead className="border border-neutral-300">
                  Do Valor do Pedido
                </TableHead>
                <TableHead className="border border-neutral-300">
                  Ao Valor do Pedido
                </TableHead>
                <TableHead className="border border-neutral-300">
                  % Desconto
                </TableHead>
                <TableHead className="border border-neutral-300">
                  Cond. Pagto
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Sem Descontos Liberados
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
