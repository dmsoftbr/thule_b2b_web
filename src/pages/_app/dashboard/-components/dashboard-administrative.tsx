import { Label } from "recharts";
import { DashboardProvider } from "./dashboard-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { SearchCombo } from "@/components/ui/search-combo";
import { Button } from "@/components/ui/button";
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";
import { TopCommercialFamilies } from "./top-commercial-families";
import { TopRepresentatives } from "./top-representatives";
import { convertArrayToSearchComboItem } from "@/lib/search-combo-utils";
import { useEffect, useRef, useState } from "react";
import IMask from "imask";
import type { RepresentativeModel } from "@/models/representative.model";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { DashboardFilter } from "../types/dashboard-filter";
import { toast } from "sonner";
import { AppPageHeader } from "@/components/layout/app-page-header";

export const DashboardAdministrative = () => {
  const yearInputRef = useRef<HTMLInputElement | null>(null);
  const [filter, setFilter] = useState<DashboardFilter>({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    representatives: [],
  });

  const { data: representativesData } = useQuery({
    queryKey: ["representatives"],
    queryFn: async () => {
      const { data } = await api.get<RepresentativeModel[]>(
        "/registrations/representatives/all"
      );
      const allReps = data.map((rep) => rep.id);
      setFilter({ ...filter, representatives: allReps });
      return data;
    },
  });

  const getSelectedRepsAsSearchComboItem = () => {
    if (!representativesData) return [];

    const reps = representativesData.filter((f) =>
      filter.representatives.includes(f.id)
    );

    const options = convertArrayToSearchComboItem(
      reps ?? [],
      "id",
      "abbreviation"
    );
    return options;
  };

  useEffect(() => {
    if (yearInputRef.current) {
      const maskInstance = IMask(yearInputRef.current, {
        mask: Number,
        scale: 0,
        thousandsSeparator: "",
        padFractionalZeros: false,
        normalizeZeros: false,
      });
      return () => {
        maskInstance.destroy();
      };
    }
  }, []);

  const handleApplyFilter = () => {
    //
  };

  return (
    <AppPageHeader titleSlot="Dashboard Administrativo">
      <div className="p-4 space-y-2">
        <DashboardProvider>
          <div className="flex gap-x-2 items-end">
            <div className="flex gap-x-2">
              <div className="flex flex-col gap-y-1">
                <Label className="text-xs text-muted-foreground">Mês:</Label>
                <Select
                  value={filter.month.toString()}
                  onValueChange={(value) =>
                    setFilter({ ...filter, month: parseInt(value) })
                  }
                >
                  <SelectTrigger className="bg-white w-32">
                    <SelectValue placeholder="Mês" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Janeiro</SelectItem>
                    <SelectItem value="2">Fevereiro</SelectItem>
                    <SelectItem value="3">Março</SelectItem>
                    <SelectItem value="4">Abril</SelectItem>
                    <SelectItem value="5">Maio</SelectItem>
                    <SelectItem value="6">Junho</SelectItem>
                    <SelectItem value="7">Julho</SelectItem>
                    <SelectItem value="8">Agosto</SelectItem>
                    <SelectItem value="9">Setembro</SelectItem>
                    <SelectItem value="10">Outubro</SelectItem>
                    <SelectItem value="11">Novembro</SelectItem>
                    <SelectItem value="12">Dezembro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-y-1">
                <Label className="text-xs text-muted-foreground">Ano:</Label>

                <Input
                  type="text"
                  ref={yearInputRef}
                  className="w-32 text-right"
                  value={filter.year.toString()}
                  onChange={(e) => {
                    const newYear = parseInt(e.target.value);
                    if (newYear >= 1900 && newYear <= 2072) {
                      setFilter({ ...filter, year: parseInt(e.target.value) });
                    } else {
                      toast.warning("Ano Inválido!");
                    }
                  }}
                />
              </div>
            </div>
            <div className="flex flex-col gap-y-1 flex-1">
              <Label className="text-xs text-muted-foreground">
                Representantes:
              </Label>
              <SearchCombo
                className="flex-1"
                multipleSelect
                placeholder="Selecione um Representante"
                defaultValue={getSelectedRepsAsSearchComboItem()}
                onChange={() => {}}
                onSelectOption={(values) => {
                  const reps = values.map((item) => Number(item.value));
                  setFilter({ ...filter, representatives: reps });
                }}
                staticItems={convertArrayToSearchComboItem(
                  representativesData ?? [],
                  "id",
                  "abbreviation"
                )}
                showSelectButtons
              />
            </div>
            <Button variant="blue" onClick={() => handleApplyFilter()}>
              Aplicar Filtro
            </Button>
          </div>
          {/* content */}
          <div className="bg-slate-100 flex flex-col gap-4 p-2 border rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-lg shadow border flex flex-col justify-center  space-y-2 bg-white p-6">
                <p className="text-muted-foreground font-semibold">
                  Faturamento{" "}
                  <span className="text-xs text-muted-foreground">
                    (Valor Bruto)
                  </span>
                </p>
                <p className="text-3xl font-bold">R$ 2.54M</p>
                <p className="flex items-center text-xs text-emerald-600 font-semibold">
                  <ArrowUpIcon className="size-3 mr-1.5 stroke-[4px]" />
                  12,5%
                </p>
              </div>

              <div className="rounded-lg shadow border flex flex-col justify-center  space-y-2 bg-white p-6">
                <p className="text-muted-foreground font-semibold">
                  Quantidade de Pedidos
                </p>
                <p className="text-3xl font-bold">2.540</p>
                <p className="flex items-center text-xs text-emerald-600 font-semibold">
                  <ArrowUpIcon className="size-3 mr-1.5 stroke-[4px]" />
                  5,5%
                </p>
              </div>

              <div className="rounded-lg shadow border flex flex-col justify-center space-y-2 bg-white p-6">
                <p className="text-muted-foreground font-semibold">
                  Ticket Médio
                </p>
                <p className="text-3xl font-bold">R$ 2.000,00</p>
                <p className="flex items-center text-xs text-red-500">
                  <ArrowDownIcon className="size-3 text-red-500 mr-1.5 stroke-[4px]" />
                  -5,5%
                </p>
              </div>

              <div className="rounded-lg shadow border flex flex-col justify-center  space-y-2 bg-white p-6">
                <p className="text-muted-foreground font-semibold">
                  Faturamento Anual{" "}
                  <span className="text-xs text-muted-foreground">
                    (Valor Bruto)
                  </span>
                </p>
                <p className="text-3xl font-bold">R$ 12.54M</p>
                <p className="flex items-center text-xs text-emerald-600 font-semibold">
                  <ArrowUpIcon className="size-3 mr-1.5 stroke-[4px]" />
                  12,5%
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg shadow bg-white flex-1 p-6">
                <p className="text-muted-foreground font-semibold">
                  Top Famílias Comerciais
                </p>
                <TopCommercialFamilies />
              </div>
              <div className="rounded-lg shadow bg-white flex-1 p-6">
                <p className="text-muted-foreground font-semibold">
                  Top Representantes
                </p>
                <TopRepresentatives />
              </div>
            </div>
          </div>

          <div>
            <span className="italic text-sm font-semibold text-red-400">
              * Informações do período selecionado
            </span>
          </div>
        </DashboardProvider>
      </div>
    </AppPageHeader>
  );
};
