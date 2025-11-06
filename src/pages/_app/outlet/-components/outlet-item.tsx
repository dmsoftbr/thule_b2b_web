import { ProductImage } from "@/components/app/product-image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatNumber } from "@/lib/number-utils";
import { useOutletCart } from "./outlet-context";

interface Props {
  productId: string;
  description: string;
  photo: string;
  priceTableId: string;
  price: number;
  className?: string;
}

export const OutletItem = ({
  productId,
  description,
  price,
  priceTableId,

  className,
}: Props) => {
  const { addItem } = useOutletCart();
  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardDescription className="text-center font-semibold">
            {description}
          </CardDescription>
          <CardTitle className="flex items-center relative justify-center">
            <ProductImage
              productId={productId}
              productName={description}
              alt={productId}
              className="w-[128px] h-[128px]"
              expandOnClick
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center flex-col">
          <div className="flex items-center justify-center w-full font-bold text-red-600 text-xl">
            R$ {formatNumber(price, 2)}
          </div>
          <div className="flex w-full gap-x-3 items-center justify-center">
            <span className="text-sm">SKU: {productId}</span>
            <div className="h-[16px] border-l"></div>
            <span className="text-sm">+ ICMS ST (quando houver)</span>
          </div>
          <div className="mt-1 text-xs">Outlet: {priceTableId}</div>
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          <Button
            onClick={() =>
              addItem({
                id: productId,
                name: description,
                price,
                priceTableId,
              })
            }
          >
            Adicionar ao carrinho
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};
