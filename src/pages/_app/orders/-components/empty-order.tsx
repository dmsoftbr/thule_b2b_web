import { PackageIcon } from "lucide-react";

export const EmptyOrder = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 w-full opacity-40">
      <PackageIcon className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Nenhum produto adicionado
      </h3>
      <p className="text-gray-500 text-center">
        Adicione alguns itens para começar seu pedido.
      </p>
    </div>
  );
};
