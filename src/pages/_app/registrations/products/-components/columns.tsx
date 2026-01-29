import { ProductImage } from "@/components/app/product-image";
import type { ServerTableColumn } from "@/components/server-table/server-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ProductModel } from "@/models/product.model";
import { MenuIcon } from "lucide-react";

interface Props {
  fnDetails: (data: ProductModel) => void;
  fnMessage: (data: ProductModel) => void;
}

export const columns = ({
  fnDetails,
  fnMessage,
}: Props): ServerTableColumn[] => [
  {
    key: "imageUrl",
    dataIndex: "imageUrl",
    title: "Foto",
    renderItem: (product: ProductModel) => (
      <ProductImage
        alt={product.id}
        productId={product.id}
        className="!size-24"
      />
    ),
    sortable: true,
  },
  {
    key: "id",
    dataIndex: "id",
    title: "Código",
    renderItem: (product: ProductModel) => (
      <span className="font-semibold text-blue-600 ">{product.id}</span>
    ),
    sortable: true,
  },
  {
    key: "description",
    dataIndex: "description",
    title: "Descrição",
    renderItem: (product: ProductModel) => <span>{product.description}</span>,
    sortable: true,
  },
  {
    key: "referenceCode",
    dataIndex: "referenceCode",
    title: "Código Curto",
    sortable: true,
  },
  {
    key: "commercialFamilyId",
    dataIndex: "commercialFamilyId",
    title: "Família Comercial",
    renderItem: (product: ProductModel) => (
      <span>{product.commercialFamilyId}</span>
    ),
    sortable: true,
  },
  {
    key: "groupId",
    dataIndex: "groupId",
    title: "Grupo de Estoque",
    renderItem: (product: ProductModel) => (
      <span>{product.productGroup?.name}</span>
    ),
    sortable: true,
  },
  {
    key: "productFamilyId",
    dataIndex: "productFamilyId",
    title: "Família",
    renderItem: (product: ProductModel) => <span>{product.familyId}</span>,
    sortable: true,
  },
  {
    key: "orderMessage",
    dataIndex: "orderMessage",
    title: "Mensagem Ped/Simul.",
  },
  {
    key: "actions",
    dataIndex: "id",
    title: "Ações",
    renderItem: (product: ProductModel) => (
      <div className="flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="sm" variant="secondary">
              <MenuIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="">
            <DropdownMenuItem onClick={() => fnDetails(product)}>
              Fotos
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => fnMessage(product)}>
              Mensagem p/Pedidos e Simulações
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
  },
];
