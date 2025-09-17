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
import { BoxIcon } from "lucide-react";
import { useState } from "react";

export const SalesChannelModal = () => {
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
          <BoxIcon className="size-4" />
          Produtos do Canal de Venda
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
          <div>
            <span className="mr-2 bg-emerald-500 text-white px-2 py-1.5 rounded text-xs">
              C
            </span>
            <span>
              <strong>Confirmado: </strong>
              Produto disponível no estoque
            </span>
          </div>
          <div>
            <span className="mr-2 bg-red-300 text-white px-2 py-1.5 rounded text-xs">
              B
            </span>
            <span>
              <strong>BackOrder: </strong>
              Produto Indisponível no estoque
            </span>
          </div>
          <div>
            <span className="mr-2 ml-4 bg-red-500 text-white px-2 py-1.5 rounded text-xs">
              B2
            </span>
            <strong>BackOrder B2: </strong>
            Produto em Tropicalização
          </div>
          <div>
            <span className="mr-2 ml-4 bg-pink-500 text-white px-2 py-1.5 rounded text-xs">
              B3
            </span>
            <strong>BackOrder B3: </strong>
            Produto Indisponível no estoque com previsão de chegada
          </div>
          <div>
            <span className="mr-2 ml-4 bg-purple-500 text-white px-2 py-1.5 rounded text-xs">
              B4
            </span>
            <strong>BackOrder B4: </strong>
            Produto Indisponível no estoque e sem previsão de chegada
          </div>

          <div>
            <span className="mr-2 bg-blue-300 text-white px-2 py-1.5 rounded text-xs">
              P
            </span>
            <span>Parcial</span>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => setIsOpen(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
