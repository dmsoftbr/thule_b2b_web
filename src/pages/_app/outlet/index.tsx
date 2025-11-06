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
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { OutletItemSkeleton } from "./-components/outlet-item-skeleton";
import { OutletCartProvider } from "./-components/outlet-context";
import { api } from "@/lib/api";
import type { PagedResponseModel } from "@/models/dto/responses/paged-response.model";

export const Route = createFileRoute("/_app/outlet/")({
  component: OutletPage,
});

type OutletProductModel = {
  productId: string;
  description: string;
  photo: string;
  priceTableId: string;
  price: number;
  referenceCode: string;
};

function OutletPage() {
  const [searchText, setSearchText] = useState("");
  const [selectedOutlet, setSelectedOutlet] = useState("all");
  const queryClient = useQueryClient();
  async function fetchOutletProducts(): Promise<
    PagedResponseModel<OutletProductModel>
  > {
    const params = {
      searchText,
      searchField: "productId",
      currentPage: 0,
      pageSize: 10000,
      sortField: "productId",
      sortAsc: true,
      priceTableId: selectedOutlet,
    };
    const { data } = await api.post(`/outlet/list-paged`, params);
    return data;
  }

  const { data: products, isLoading } = useQuery({
    queryKey: ["outlet-products", selectedOutlet],
    queryFn: fetchOutletProducts,
  });

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["outlet-products"] });
  }, [searchText, selectedOutlet]);

  return (
    <OutletCartProvider>
      <div className="m-2 p-2 bg-white border shadow rounded w-full">
        <h1 className="font-semibold text-lg flex items-center justify-between mb-2">
          Produtos em Outlet
          <div className="flex items-center justify-center gap-x-2">
            <Input
              placeholder="Buscar Produto"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Select
              value={selectedOutlet}
              onValueChange={(value) => setSelectedOutlet(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar Outlet" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Outlets</SelectItem>
                <SelectItem value="Outlet1">Outlet 1</SelectItem>
                <SelectItem value="Outlet2">Outlet 2</SelectItem>
                <SelectItem value="Outlet3">Outlet 3</SelectItem>
                <SelectItem value="Outlet4">Outlet 4</SelectItem>
              </SelectContent>
            </Select>
            <OutletShoppingCartModal />
          </div>
        </h1>

        <div className="flex flex-wrap gap-4 justify-center">
          {isLoading && (
            <>
              <OutletItemSkeleton />
              <OutletItemSkeleton />
              <OutletItemSkeleton />
              <OutletItemSkeleton />
              <OutletItemSkeleton />
              <OutletItemSkeleton />
            </>
          )}
          {products?.result.map((item, index) => (
            <OutletItem
              key={index}
              productId={item.productId}
              description={item.description}
              priceTableId={item.priceTableId}
              price={item.price}
              photo={item.photo}
            />
          ))}
        </div>
      </div>
    </OutletCartProvider>
  );
}
