import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { ProductStockForm } from "@/pages/_app/stock/product-stock/-components/product-stock-form";
import { PackageIcon } from "lucide-react";

export const QuickActionStock = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-neutral-400 hover:text-neutral-800 flex flex-col items-center gap-0 h-10"
          onClick={() => {}}
        >
          <PackageIcon className="size-5" />
          <span className="sr-only">Consulta de Estoque</span>
          <span className="text-[8px]">Estoque</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Consulta de Estoque</AlertDialogTitle>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <div>
          <ProductStockForm />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Fechar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
