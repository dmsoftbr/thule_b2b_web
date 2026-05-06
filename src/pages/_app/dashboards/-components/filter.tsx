import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { SearchCombo } from "@/components/ui/search-combo";
import { api } from "@/lib/api";
import { convertArrayToSearchComboItem } from "@/lib/search-combo-utils";
import type { ProductModel } from "@/models/product.model";
import type { CustomerGroupModel } from "@/models/registrations/customer-group.model";
import type { CustomerModel } from "@/models/registrations/customer.model";
import type { ProductCommercialFamilyModel } from "@/models/registrations/product-commercial-family.model";
import type { ProductGroupModel } from "@/models/registrations/product-group.model";
import type { RepresentativeModel } from "@/models/representative.model";
import { useQuery } from "@tanstack/react-query";
import { ChevronDownIcon, FilterIcon } from "lucide-react";
import { useMemo, useState } from "react";

const MESES = [
  { value: "1", label: "Janeiro" },
  { value: "2", label: "Fevereiro" },
  { value: "3", label: "Março" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Maio" },
  { value: "6", label: "Junho" },
  { value: "7", label: "Julho" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

const MARCAS = [
  { value: "THULE", label: "THULE" },
  { value: "CL", label: "CASE LOGIC" },
];

export type DashboardFiltro = {
  /** Mantido por compatibilidade: maior ano selecionado em `anos`. */
  ano: number;
  anos: number[];
  meses: number[];
  paises: string[];
  representantes: number[];
  gerentes: string[];
  gruposCliente: number[];
  clientes: number[];
  tiposItem: number[];
  gruposEstoque: number[];
  marcas: string[];
  famComerciais: string[];
  produtos: string[];
};

interface Props {
  onAplicar: (filtro: DashboardFiltro) => void;
}

export const DashboardsFilter = ({ onAplicar }: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [anos, setAnos] = useState<number[]>([new Date().getFullYear()]);
  const [meses, setMeses] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12,
  ]);
  const [representantes, setRepresentantes] = useState<number[]>([]);
  const [paises, setPaises] = useState<string[]>([]);
  const [gerentes, setGerentes] = useState<string[]>([]);
  const [gruposCliente, setGruposCliente] = useState<number[]>([]);
  const [clientes, setClientes] = useState<number[]>([]);
  const [tiposItem, setTiposItem] = useState<number[]>([]);
  const [gruposEstoque, setGruposEstoque] = useState<number[]>([]);
  const [marcas, setMarcas] = useState<string[]>([]);
  const [famComerciais, setFamComerciais] = useState<string[]>([]);
  const [produtos, setProdutos] = useState<string[]>([]);

  const { data: clientesData } = useQuery({
    queryKey: ["filter-customers"],
    queryFn: async () => {
      const { data } = await api.get<CustomerModel[]>(
        "/registrations/customers/all",
      );
      const clientes = data.map((cli) => cli.id);
      setClientes(clientes);
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const { data: produtosData } = useQuery({
    queryKey: ["filter-products"],
    queryFn: async () => {
      const { data } = await api.get<ProductModel[]>(
        "/registrations/products/all",
      );
      const produtos = data.map((prod) => prod.id);
      setProdutos(produtos);
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const { data: gruposClienteData } = useQuery({
    queryKey: ["filter-customer-groups"],
    queryFn: async () => {
      const { data } = await api.get<CustomerGroupModel[]>(
        "/registrations/customer-groups/all",
      );
      const grupos = data.map((grupo) => grupo.id);
      setGruposCliente(grupos);
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const { data: gerentesData } = useQuery({
    queryKey: ["filter-managers"],
    queryFn: async () => {
      const { data } = await api.get<string[]>(
        "/registrations/customer-groups/managers",
      );
      const newData = data.sort().map((item) => {
        return { manager: item };
      });
      setGerentes(data);
      return newData;
    },
    refetchOnWindowFocus: false,
  });

  const { data: anosData } = useQuery({
    queryKey: ["filter-anos"],
    queryFn: async () => {
      const { data } = await api.get<number[]>("/dashboards-thule/anos");
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const { data: paisesData } = useQuery({
    queryKey: ["filter-paises"],
    queryFn: async () => {
      const { data } = await api.get("/dashboards-thule/paises");
      setPaises(data);
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const { data: famComerciaisData } = useQuery({
    queryKey: ["filter-fam-comerciais"],
    queryFn: async () => {
      const { data } = await api.get<ProductCommercialFamilyModel[]>(
        "/registrations/product-commercial-families/all",
      );
      const ids = data.map((item) => item.id);
      setFamComerciais(ids);
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const { data: gruposEstoqueData } = useQuery({
    queryKey: ["filter-grupos-estoque"],
    queryFn: async () => {
      const { data } = await api.get<ProductGroupModel[]>(
        "/registrations/product-groups/all",
      );
      const ids = data.map((item) => item.id);
      setGruposEstoque(ids);
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const { data: tiposItemData } = useQuery({
    queryKey: ["filter-tipos-item"],
    queryFn: async () => {
      const { data } = await api.get<ProductGroupModel[]>(
        "/registrations/item-types/all",
      );
      const ids = data.map((item) => item.id);
      setTiposItem(ids);
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const { data: representantesData } = useQuery({
    queryKey: ["filter-reps"],
    queryFn: async () => {
      const { data } = await api.get<RepresentativeModel[]>(
        "/registrations/representatives/all",
      );
      const ids = data.map((item) => item.id);
      setRepresentantes(ids);
      return data;
    },
    refetchOnWindowFocus: false,
  });

  const anosItems = useMemo(
    () =>
      (anosData ?? []).map((ano) => ({
        value: String(ano),
        label: String(ano),
      })),
    [anosData],
  );

  const paisesItems = useMemo(
    () => convertArrayToSearchComboItem(paisesData ?? [], "pais", "pais", false),
    [paisesData],
  );
  const representantesItems = useMemo(
    () =>
      convertArrayToSearchComboItem(
        representantesData ?? [],
        "id",
        "abbreviation",
        false,
      ),
    [representantesData],
  );
  const gerentesItems = useMemo(
    () =>
      convertArrayToSearchComboItem(
        gerentesData ?? [],
        "manager",
        "manager",
        false,
      ),
    [gerentesData],
  );
  const gruposClienteItems = useMemo(
    () =>
      convertArrayToSearchComboItem(
        gruposClienteData ?? [],
        "id",
        "name",
        false,
      ),
    [gruposClienteData],
  );
  const clientesItems = useMemo(
    () =>
      convertArrayToSearchComboItem(
        clientesData ?? [],
        "id",
        "abbreviation",
        false,
      ),
    [clientesData],
  );
  const tiposItemItems = useMemo(
    () =>
      convertArrayToSearchComboItem(tiposItemData ?? [], "id", "name", false),
    [tiposItemData],
  );
  const gruposEstoqueItems = useMemo(
    () =>
      convertArrayToSearchComboItem(
        gruposEstoqueData ?? [],
        "id",
        "name",
        false,
      ),
    [gruposEstoqueData],
  );
  const famComerciaisItems = useMemo(
    () =>
      convertArrayToSearchComboItem(
        famComerciaisData ?? [],
        "id",
        "name",
        false,
      ),
    [famComerciaisData],
  );
  const produtosItems = useMemo(
    () =>
      convertArrayToSearchComboItem(
        produtosData ?? [],
        "id",
        "description",
        false,
      ),
    [produtosData],
  );

  const handleAplicar = () => {
    const anoAtual = new Date().getFullYear();
    const ano = anos.length > 0 ? Math.max(...anos) : anoAtual;
    const newFiltro: DashboardFiltro = {
      ano,
      anos,
      meses,
      paises,
      representantes,
      gerentes,
      gruposCliente,
      clientes,
      tiposItem,
      gruposEstoque,
      famComerciais,
      marcas,
      produtos,
    };

    onAplicar(newFiltro);
    setIsOpen(false);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button size="sm" className="text-xs">
          <span>
            <FilterIcon className="size-4 mr-1" />
          </span>
          Filtro
          <span>
            <ChevronDownIcon className="size-4" />
          </span>
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="bg-neutral-100 border shadow p-2 rounded-md">
        <div className="flex flex-col space-y-2">
          <div className="grid grid-cols-4 gap-x-4 py-2 px-1">
            <div className="form-group">
              <Label>Ano</Label>
              <SearchCombo
                multipleSelect
                showSelectButtons
                staticItems={anosItems}
                onSelectOption={(values) => {
                  const selecionados = values.map((v) => Number(v.value));
                  setAnos(
                    selecionados.length > 0
                      ? selecionados
                      : [new Date().getFullYear()],
                  );
                }}
              />
            </div>
            <div className="form-group">
              <Label>Mês</Label>
              <SearchCombo
                selectAllOnLoad
                staticItems={MESES}
                multipleSelect
                showSelectButtons
                onSelectOption={(values) => {
                  const meses = values.map((mes) => Number(mes.value));
                  setMeses(meses);
                }}
              />
            </div>
            <div className="form-group">
              <Label>País</Label>
              <SearchCombo
                selectAllOnLoad
                multipleSelect
                showSelectButtons
                staticItems={paisesItems}
                onSelectOption={(values) => {
                  const pais = values.map((pais) => pais.value);
                  setPaises(pais);
                }}
              />
            </div>
            <div className="form-group">
              <Label>Representante</Label>
              <SearchCombo
                selectAllOnLoad
                multipleSelect
                showSelectButtons
                staticItems={representantesItems}
                valueProp="id"
                labelProp="abbreviation"
                showValueInSelectedItem
                onSelectOption={(values) => {
                  const reps = values.map((rep) => Number(rep.value));
                  setRepresentantes(reps);
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-x-4 bg-blue-100 py-2 px-1">
            <div className="form-group">
              <Label>Gerente</Label>
              <SearchCombo
                selectAllOnLoad
                multipleSelect
                showSelectButtons
                staticItems={gerentesItems}
                onSelectOption={(values) => {
                  const gerente = values.map((ger) => ger.value);
                  setGerentes(gerente);
                }}
              />
            </div>
            <div className="form-group">
              <Label>Grupo Cliente</Label>
              <SearchCombo
                selectAllOnLoad
                multipleSelect
                showSelectButtons
                showValueInSelectedItem
                staticItems={gruposClienteItems}
                onSelectOption={(values) => {
                  const grupo = values.map((grupo) => Number(grupo.value));
                  setGruposCliente(grupo);
                }}
              />
            </div>

            <div className="form-group col-span-2">
              <Label>Cliente</Label>
              <SearchCombo
                selectAllOnLoad
                multipleSelect
                showSelectButtons
                showValueInSelectedItem
                staticItems={clientesItems}
                onSelectOption={(values) => {
                  const cliente = values.map((cli) => Number(cli.value));
                  setClientes(cliente);
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-x-4 py-2 px-1">
            <div className="form-group">
              <Label>Tipo Item</Label>
              <SearchCombo
                multipleSelect
                showSelectButtons
                selectAllOnLoad
                staticItems={tiposItemItems}
                valueProp="id"
                labelProp="name"
                showValueInSelectedItem
                onSelectOption={(values) => {
                  const tipos = values.map((item) => Number(item.value));
                  setTiposItem(tipos);
                }}
              />
            </div>
            <div className="form-group">
              <Label>Grupo de Estoque</Label>
              <SearchCombo
                multipleSelect
                selectAllOnLoad
                showSelectButtons
                staticItems={gruposEstoqueItems}
                valueProp="id"
                labelProp="name"
                showValueInSelectedItem
                onSelectOption={(values) => {
                  const grupos = values.map((gr) => Number(gr.value));
                  setGruposEstoque(grupos);
                }}
              />
            </div>

            <div className="form-group">
              <Label>Marca</Label>
              <SearchCombo
                selectAllOnLoad
                multipleSelect
                showSelectButtons
                staticItems={MARCAS}
                onSelectOption={(values) => {
                  const marcas = values.map((item) => item.value);
                  setMarcas(marcas);
                }}
              />
            </div>

            <div className="form-group">
              <Label>Família Comercial</Label>
              <SearchCombo
                selectAllOnLoad
                multipleSelect
                showSelectButtons
                staticItems={famComerciaisItems}
                valueProp="id"
                labelProp="name"
                showValueInSelectedItem
                onSelectOption={(values) => {
                  const familias = values.map((item) => item.value);
                  setMarcas(familias);
                }}
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-x-4 items-end py-2 px-1">
            <div className="form-group col-span-2">
              <Label>Produto</Label>
              <SearchCombo
                selectAllOnLoad
                multipleSelect
                showSelectButtons
                showValueInSelectedItem
                staticItems={produtosItems}
                onSelectOption={(values) => {
                  const prods = values.map((item) => item.value);
                  setMarcas(prods);
                }}
              />
            </div>
            <Button type="button" onClick={() => handleAplicar()}>
              Aplicar
            </Button>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
