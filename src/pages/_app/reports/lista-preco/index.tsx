import { AppPageHeader } from "@/components/layout/app-page-header";
import { Label } from "@/components/ui/label";
import {
  SearchCombo,
  type SearchComboItem,
} from "@/components/ui/search-combo";
import { ProductCommercialFamiliesService } from "@/services/registrations/product-commercial-families.service";
import { ProductFamiliesService } from "@/services/registrations/product-families.serivce";
import { ProductGroupsService } from "@/services/registrations/product-groups.service";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon, Loader2Icon } from "lucide-react";
import { api, handleError } from "@/lib/api";
import { toast } from "sonner";
import { ProductImage } from "@/components/app/product-image";
import type { ListaPrecoResponseModel } from "@/models/dto/responses/lista-preco-response.model";
import { formatNumber } from "@/lib/number-utils";
import { Input } from "@/components/ui/input";

const pageSize = 20;

export const Route = createFileRoute("/_app/reports/lista-preco/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchItCodigo, setSearchItCodigo] = useState("");
  const [searchCodRefer, setSearchCodRefer] = useState("");
  const [searchDescItem, setSearchDescItem] = useState("");
  const [selectedFamComerc, setSelectedFamComerc] = useState<string[]>([]);
  const [selectedFamMat, setSelectedFamMat] = useState<string[]>([]);
  const [selectedGruposEstoque, setSelectedGruposEstoque] = useState<string[]>(
    [],
  );
  const [famComercData, setFamComercData] = useState<SearchComboItem[]>([]);
  const [famMatData, setFamMatData] = useState<SearchComboItem[]>([]);
  const [grupoEstoqueData, setGrupoEstoqueData] = useState<SearchComboItem[]>(
    [],
  );
  const [tableData, setTableData] = useState<ListaPrecoResponseModel[]>([]);

  async function getFamComerc() {
    const data = await ProductCommercialFamiliesService.getAll();
    const newData: SearchComboItem[] = data.map((item) => {
      return {
        value: item.id.toString(),
        label: `${item.name}`,
        extra: item,
        keyworks: [item.id.toString(), item.name],
      };
    });
    setFamComercData(newData);
  }

  async function getFamMat() {
    const data = await ProductFamiliesService.getAll();
    const newData: SearchComboItem[] = data.map((item) => {
      return {
        value: item.id.toString(),
        label: `${item.name}`,
        extra: item,
        keyworks: [item.id.toString(), item.name],
      };
    });
    setFamMatData(newData);
  }

  async function getGruposEstoque() {
    const data = await ProductGroupsService.getAll();
    const newData: SearchComboItem[] = data.map((item) => {
      return {
        value: item.id.toString(),
        label: `${item.name}`,
        extra: item,
        keyworks: [item.id.toString(), item.name],
      };
    });
    setGrupoEstoqueData(newData);
  }

  const getData = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.post(`/reports/lista-preco`, {
        famComercial: selectedFamComerc,
        famMaterial: selectedFamMat,
        grupoEstoque: selectedGruposEstoque,
      });
      setCurrentPage(1);
      setTableData(data);
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getFamComerc();
    getFamMat();
    getGruposEstoque();
  }, []);

  const handleGetPDF = async () => {
    setIsLoading(true);
    try {
      const response = await api.post(
        `/reports/lista-preco/pdf`,
        {
          famComercial: selectedFamComerc,
          famMaterial: selectedFamMat,
          grupoEstoque: selectedGruposEstoque,
        },
        {
          responseType: "blob",
        },
      );
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.download = "ListaPreco.pdf"; // Suggest a filename for download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Clean up the object URL
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGetExcel = async () => {
    setIsLoading(true);
    try {
      const response = await api.post(
        `/reports/lista-preco/xlsx`,
        {
          famComercial: selectedFamComerc,
          famMaterial: selectedFamMat,
          grupoEstoque: selectedGruposEstoque,
        },
        {
          responseType: "blob",
        },
      );
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.download = "ListaPreco.xlsx"; // Suggest a filename for download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url); // Clean up the object URL
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    return tableData.filter((item) => {
      const matchItCodigo = searchItCodigo
        ? item.itCodigo?.toLowerCase().includes(searchItCodigo.toLowerCase())
        : true;

      const matchCodRefer = searchCodRefer
        ? item.codRefer?.toLowerCase().includes(searchCodRefer.toLowerCase())
        : true;

      const matchDescItem = searchDescItem
        ? item.descItem?.toLowerCase().includes(searchDescItem.toLowerCase())
        : true;

      setCurrentPage(1);
      return matchItCodigo && matchCodRefer && matchDescItem;
    });
  }, [tableData, searchItCodigo, searchCodRefer, searchDescItem]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage]);

  return (
    <AppPageHeader titleSlot="Lista de Preço">
      <div className="flex flex-col w-full space-y-2 p-2 relative">
        {isLoading && (
          <div className="absolute inset-0">
            <div className="z-40 bg-neutral-900/45 inset-0 absolute flex items-center justify-center">
              <div className="bg-white flex items-center justify-center z-50 rounded-lg h-12 min-w-[200px]">
                <span>
                  <Loader2Icon className="animate-spin size-4 mr-1.5 text-blue-600" />
                </span>{" "}
                Aguarde...
              </div>
            </div>
          </div>
        )}
        <div className="flex w-full gap-x-2">
          <div className="form-group flex-1">
            <Label>Família Comercial:</Label>
            <SearchCombo
              selectAllOnLoad
              multipleSelect
              showSelectButtons
              staticItems={famComercData}
              showValueInSelectedItem
              onChange={() => {}}
              onSelectOption={(value) => {
                const newValues = value.map((item) => {
                  return item.value;
                });
                setSelectedFamComerc(newValues);
              }}
              placeholder="Selecione as Famílias"
              key={famComercData.length}
            />
          </div>

          <div className="form-group flex-1">
            <Label>Família Material:</Label>
            <SearchCombo
              selectAllOnLoad
              multipleSelect
              showSelectButtons
              staticItems={famMatData}
              showValueInSelectedItem
              onChange={() => {}}
              onSelectOption={(value) => {
                const newValues = value.map((item) => {
                  return item.value;
                });
                setSelectedFamMat(newValues);
              }}
              placeholder="Selecione as Famílias"
              key={famMatData.length}
            />
          </div>

          <div className="form-group flex-1">
            <Label>Grupo de Estoque:</Label>
            <SearchCombo
              selectAllOnLoad
              multipleSelect
              showSelectButtons
              staticItems={grupoEstoqueData}
              showValueInSelectedItem
              onChange={() => {}}
              onSelectOption={(value) => {
                const newValues = value.map((item) => {
                  return item.value;
                });
                setSelectedGruposEstoque(newValues);
              }}
              placeholder="Selecione os Grupos"
              key={grupoEstoqueData.length}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="mt-5" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span>
                      <Loader2Icon className="size-4 mr-2 animate-spin" />
                    </span>
                    Gerando...
                  </>
                ) : (
                  <>
                    Gerar{" "}
                    <span>
                      <ChevronDownIcon className="size-4" />
                    </span>
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => getData()}>
                Em Tela
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleGetPDF()}>
                Em PDF
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleGetExcel()}>
                Em Excel
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="">
          <table className="table-auto w-full">
            <thead>
              <tr className="text-xs border bg-neutral-200 border-neutral-300">
                <th className="font-semibold p-1 border-r border-r-neutral-300">
                  Foto
                </th>
                <th className="font-semibold p-1 border-r border-r-neutral-300">
                  Grupo de Estoque
                </th>
                <th className="font-semibold p-1 border-r border-r-neutral-300">
                  Família
                </th>
                <th className="font-semibold p-1 border-r border-r-neutral-300">
                  Cód. Longo
                </th>
                <th className="font-semibold p-1 border-r border-r-neutral-300">
                  Cód. Curto
                </th>
                <th className="font-semibold p-1 border-r border-r-neutral-300">
                  Descrição
                </th>
                <th className="font-semibold p-1 border-r border-r-neutral-300">
                  Preço Sugerido
                </th>
                <th className="font-semibold p-1 border-r border-r-neutral-300">
                  Preço Base
                </th>
                <th className="font-semibold p-1 border-r border-r-neutral-300">
                  Thule Store
                </th>
                <th className="font-semibold p-1 border-r border-r-neutral-300">
                  % IPI
                </th>
                <th className="font-semibold p-1 border-r border-r-neutral-300">
                  NCM
                </th>
                <th className="font-semibold p-1 border-r border-r-neutral-300">
                  EAN
                </th>
              </tr>
              <tr className="border bg-slate-200">
                <th></th>
                <th></th>
                <th className="border-slate-300 border-r"></th>
                <th className="p-1 border-r border-slate-300">
                  <Input
                    className="!text-[10px] !h-6 font-normal"
                    value={searchItCodigo}
                    onChange={(e) => setSearchItCodigo(e.target.value)}
                  />
                </th>
                <th className="p-1 border-r border-slate-300">
                  <Input
                    className="!text-[10px] !h-6 font-normal"
                    value={searchCodRefer}
                    onChange={(e) => setSearchCodRefer(e.target.value)}
                  />
                </th>
                <th className="p-1 border-r border-slate-300">
                  <Input
                    className="!text-[10px] !h-6 font-normal"
                    value={searchDescItem}
                    onChange={(e) => setSearchDescItem(e.target.value)}
                  />
                </th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.length == 0 && (
                <tr className="h-10 border-t border-t-neutral-300">
                  <td className="border text-sm text-center" colSpan={12}>
                    Sem dados para exibir
                  </td>
                </tr>
              )}
              {paginatedData.map((item) => (
                <tr
                  className="border-l border-b odd:bg-neutral-100"
                  key={item.itCodigo}
                >
                  <td className="border-r p-1 text-xs">
                    <ProductImage
                      productId={item.itCodigo}
                      alt={item.itCodigo}
                    />
                  </td>
                  <td className="border-r p-1 text-xs">{item.grupoEstoque}</td>
                  <td className="border-r p-1 text-xs">{item.familia}</td>
                  <td className="border-r p-1 text-xs">{item.itCodigo}</td>
                  <td className="border-r p-1 text-xs">{item.codRefer}</td>
                  <td className="border-r p-1 text-xs">{item.descItem}</td>
                  <td className="border-r p-1 text-xs text-right">
                    {formatNumber(item.precoSug, 2)}
                  </td>
                  <td className="border-r p-1 text-xs text-right">
                    {formatNumber(item.precoBase, 2)}
                  </td>
                  <td className="border-r p-1 text-xs text-right">
                    {formatNumber(item.precoThuleStore, 2)}
                  </td>
                  <td className="border-r p-1 text-xs text-right">
                    {formatNumber(item.aliqIpi, 2)}
                  </td>
                  <td className="border-r p-1 text-xs">{item.ncm}</td>
                  <td className="border-r p-1 text-xs">{item.ean}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-between items-center mt-4">
            <span className="text-xs">
              Página {currentPage} de {totalPages == 0 ? 1 : totalPages}
            </span>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Anterior
              </Button>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Próxima
              </Button>
            </div>
          </div>
        </div>
      </div>
    </AppPageHeader>
  );
}
