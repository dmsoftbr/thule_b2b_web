import { createFileRoute } from "@tanstack/react-router";
import { OutletItem } from "./-components/outlet-item";
import { Input } from "@/components/ui/input";
import { OutletShoppingCartModal } from "./-components/shopping-cart-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { OutletItemSkeleton } from "./-components/outlet-item-skeleton";
import { OutletCartProvider } from "./-components/outlet-context";

export const Route = createFileRoute("/_app/outlet/")({
  component: OutletPage,
});

type OutletProduct = {
  productId: string;
  description: string;
  photo: string;
};

function OutletPage() {
  async function fetchOutletProducts(): Promise<OutletProduct[]> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const dados = [];
    for (let i = 0; i < 10; i++) {
      dados.push({
        productId: "532002",
        description: "Suporte Thule FreeRide p/ 1 Bicicleta p/ Teto",
        photo: "https://remote.thule.com/imgrepo/532002.jpg",
      });
    }
    return dados;
  }

  const { data: products = [] } = useQuery({
    queryKey: ["outlet-products"],
    queryFn: fetchOutletProducts,
  });

  return (
    <OutletCartProvider>
      <div className="m-2 p-2 bg-white border shadow rounded w-full">
        <h1 className="font-semibold text-lg flex items-center justify-between mb-2">
          Produtos em Outlet
          <div className="flex items-center justify-center gap-x-2">
            <Input placeholder="Buscar Produto" />
            <Select defaultValue="0">
              <SelectTrigger>
                <SelectValue placeholder="Filtrar Outlet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Todos os Outlets</SelectItem>
                <SelectItem value="outlet1">Outlet 1</SelectItem>
                <SelectItem value="outlet2">Outlet 2</SelectItem>
                <SelectItem value="outlet3">Outlet 3</SelectItem>
                <SelectItem value="outlet4">Outlet 4</SelectItem>
              </SelectContent>
            </Select>
            <OutletShoppingCartModal />
          </div>
        </h1>

        <div className="flex flex-wrap gap-4 justify-center">
          <Suspense
            fallback={
              <>
                <OutletItemSkeleton />
                <OutletItemSkeleton />
                <OutletItemSkeleton />
                <OutletItemSkeleton />
                <OutletItemSkeleton />
                <OutletItemSkeleton />
              </>
            }
          ></Suspense>
          {products.map((item, index) => (
            <OutletItem
              key={index}
              productId={item.productId}
              description={item.description}
              photo={item.photo}
            />
          ))}
        </div>
      </div>
    </OutletCartProvider>
  );
}
