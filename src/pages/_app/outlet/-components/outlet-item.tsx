import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  productId: string;
  description: string;
  photo: string;
  className?: string;
}

export const OutletItem = ({
  productId,
  description,
  photo,
  className,
}: Props) => {
  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardDescription className="text-center font-semibold">
            {description}
          </CardDescription>
          <CardTitle className="flex items-center relative justify-center">
            <img src={photo} alt={productId} width={256} height={256} />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center flex-col">
          <div className="flex items-center justify-center w-full font-bold text-red-600 text-xl">
            R$ 1.232,00
          </div>
          <div className="flex w-full gap-x-3 items-center justify-center">
            <span className="text-sm">SKU: {productId}</span>
            <div className="h-[16px] border-l"></div>
            <span className="text-sm">+ ICMS ST (quando houver)</span>
          </div>
          <div className="mt-1 text-xs">Outlet: Outlet3</div>
        </CardContent>
        <CardFooter className="flex items-center justify-center">
          <Button>Adicionar ao carrinho</Button>
        </CardFooter>
      </Card>
    </div>
  );
};
