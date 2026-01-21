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
import { AppTooltip } from "@/components/layout/app-tooltip";

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

  const getItemToolTip = (priceTableId: string) => {
    if (priceTableId == "Outlet1") {
      return (
        <div className="max-w-[200px]">
          Tabela Preço: Outlet1
          <br />
          <p>
            Os produtos desta categoria são novos. Tanto podem ser produtos de
            anos anteriores, produtos que saíram de linha ou produtos com
            excesso de estoque. Estes produtos tem a mesma garantia Thule de
            acordo com o seu Grupo de Produto.
          </p>
        </div>
      );
    }

    if (priceTableId == "Outlet2") {
      return (
        <div className="max-w-[200px]">
          Tabela Preço: Outlet2
          <br />
          <p>
            Os produtos da categoria 2 são novos e nunca foram utilizados, no
            entanto, podem apresentar a sua embalagem amassada ou danificada,
            mas os produtos não tem marcas e tampouco riscos. Por esse motivo,
            são produtos que não podem ser expostos como novos na loja. Estes
            produtos tem a mesma garantia Thule de acordo com o seu Grupo de
            Produto.
          </p>
        </div>
      );
    }

    if (priceTableId == "Outlet3") {
      return (
        <div className="max-w-[200px]">
          Tabela Preço: Outlet3
          <br />
          <p>
            Os produtos da categoria 3 apresentam alguns sinais como pequenas
            marcas, pequenos riscos, que não comprometem a sua utilização. Podem
            ser, por exemplo, produtos que voltaram de exposições, eventos ou
            devoluções. Também podem ser produtos novos com alguma pequena
            variação de cor que não obedecem 100% dos nossos padrões de
            qualidade. Estes produtos não apresentam desgaste e tem a mesma
            garantia Thule de acordo com o seu Grupo de Produto.
          </p>
        </div>
      );
    }

    if (priceTableId == "Outlet4") {
      return (
        <div className="max-w-[200px]">
          Tabela Preço: Outlet4
          <br />
          <p>
            Nesta categoria 4, o produto pode apresentar marcas, riscos mais
            visíveis ou apresentar sinais claros que já foi utilizado de alguma
            forma. Todos os produtos Outlet passam por uma revisão e os seus
            defeitos não comprometem a sua utilização. Estes produtos tem a
            mesma garantia Thule, mas apenas para o seu funcionamento e não para
            defeitos visuais. O Prazo de Garantia é de acordo com o seu Grupo de
            Produto.
          </p>
        </div>
      );
    }

    return "";
  };

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["outlet-products"] });
  }, [searchText, selectedOutlet]);

  return (
    <OutletCartProvider>
      <div className="m-2 p-2 bg-white border shadow rounded w-full relative">
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
        <div className="flex gap-x-2 items-center border w-full bg-slate-100 p-2 rounded-md text-sm fixed bottom-0">
          <div>Descrição dos Outlet:</div>
          <AppTooltip
            message={getItemToolTip("Outlet1")}
            className="bg-black text-white"
            indicatorClassName="bg-black text-black fill-black"
          >
            <div className="border bg-neutral-600/25 text-neutral-700 px-2 py-1.5 rounded cursor-pointer">
              Outlet 1
            </div>
          </AppTooltip>
          <AppTooltip
            message={getItemToolTip("Outlet2")}
            className="bg-black text-white"
            indicatorClassName="bg-black text-black fill-black"
          >
            <div className="border bg-neutral-600/50 text-neutral-700 px-2 py-1.5 rounded cursor-pointer">
              Outlet 2
            </div>
          </AppTooltip>
          <AppTooltip
            message={getItemToolTip("Outlet3")}
            className="bg-black text-white"
            indicatorClassName="bg-black text-black fill-black"
          >
            <div className="border bg-neutral-600/75 text-white px-2 py-1.5 rounded cursor-pointer">
              Outlet 3
            </div>
          </AppTooltip>
          <AppTooltip
            message={getItemToolTip("Outlet4")}
            className="bg-black text-white"
            indicatorClassName="bg-black text-black fill-black"
          >
            <div className="border bg-neutral-600 text-white px-2 py-1.5 rounded cursor-pointer">
              Outlet 4
            </div>
          </AppTooltip>
        </div>
      </div>
    </OutletCartProvider>
  );
}
