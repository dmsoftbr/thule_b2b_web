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
import { AppTooltip } from "@/components/layout/app-tooltip";

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

  const getItemToolTip = (sku: string, priceTableId: string) => {
    if (priceTableId == "Outlet1") {
      return (
        <div className="max-w-[200px]">
          SKU: {sku} | + ICMS ST Quando Houver
          <br />
          Tabela Preço: Outlet1
          <br />
          <p>
            Os produtos desta categoria são novos. Tanto podem ser produtos de
            anos anteriores, produtos que saíram de linha ou produtos com
            excesso de estoque. Estes produtos tem a mesma garantia Thule de
            acordo com o seu Grupo de Produto. <br />
            <br />
            <span className="font-semibold">
              Atenção: A imagem é meramente ilustrativa.
            </span>
          </p>
        </div>
      );
    }

    if (priceTableId == "Outlet2") {
      return (
        <div className="max-w-[200px]">
          SKU: {sku} | + ICMS ST Quando Houver
          <br />
          Tabela Preço: Outlet2
          <br />
          <p>
            Os produtos da categoria 2 são novos e nunca foram utilizados, no
            entanto, podem apresentar a sua embalagem amassada ou danificada,
            mas os produtos não tem marcas e tampouco riscos. Por esse motivo,
            são produtos que não podem ser expostos como novos na loja. Estes
            produtos tem a mesma garantia Thule de acordo com o seu Grupo de
            Produto.
            <br />
            <br />
            <span className="font-semibold">
              Atenção: A imagem é meramente ilustrativa.
            </span>
          </p>
        </div>
      );
    }

    if (priceTableId == "Outlet3") {
      return (
        <div className="max-w-[200px]">
          SKU: {sku} | + ICMS ST Quando Houver
          <br />
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
            <br />
            <br />
            <span className="font-semibold">
              Atenção: A imagem é meramente ilustrativa.
            </span>
          </p>
        </div>
      );
    }

    if (priceTableId == "Outlet4") {
      return (
        <div className="max-w-[200px]">
          SKU: {sku} | + ICMS ST Quando Houver
          <br />
          Tabela Preço: Outlet4
          <br />
          <p>
            Nesta categoria 4, o produto pode apresentar marcas, riscos mais
            visíveis ou apresentar sinais claros que já foi utilizado de alguma
            forma. Todos os produtos Outlet passam por uma revisão e os seus
            defeitos não comprometem a sua utilização. Estes produtos tem a
            mesma garantia Thule, mas apenas para o seu funcionamento e não para
            defeitos visuais. O Prazo de Garantia é de acordo com o seu Grupo de
            Produto. <br />
            <br />
            <span className="font-semibold">
              Atenção: A imagem é meramente ilustrativa.
            </span>
          </p>
        </div>
      );
    }

    return "";
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardDescription className="text-center font-semibold">
            {description}
          </CardDescription>
          <AppTooltip
            message={getItemToolTip(productId, priceTableId)}
            className="bg-black text-white"
            indicatorClassName="bg-black text-black fill-black"
          >
            <CardTitle className="flex items-center relative justify-center">
              <ProductImage
                productId={productId}
                productName={description}
                alt={productId}
                className="w-[128px] h-[128px]"
                expandOnClick
              />
            </CardTitle>
          </AppTooltip>
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
