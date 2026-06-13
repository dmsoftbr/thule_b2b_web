import { cn } from "@/lib/utils";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { ProductsService } from "@/services/registrations/products.service";
import { thumbChain, originalChain, onImageError } from "@/lib/product-images";

interface Props {
  productId: string;
  productName?: string;
  alt: string;
  className?: string;
  onClick?: (url: string) => void;
  isThumb?: boolean;
  expandOnClick?: boolean;
}

export const ProductImage = ({
  productId,
  productName,
  alt,
  className,
  onClick,
  expandOnClick,
  isThumb = true,
}: Props) => {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const productUrl = `products/originals/${productId}.jpg`;
  const thumbUrl = `products/thumbs/${productId}.jpeg`;

  // Galeria só é buscada quando o dialog abre (componente é usado em listas grandes).
  const { data: images } = useQuery({
    queryKey: ["product-images", productId],
    queryFn: () => ProductsService.getImages(productId),
    enabled: isOpen && !!expandOnClick,
    staleTime: 5 * 60 * 1000,
  });

  const gallery = images ?? [];
  const hasGallery = gallery.length > 1;

  return (
    <>
      <div
        className={cn(
          "w-[128px] h-[128px] rounded-md overflow-hidden bg-white",
          onClick && !hasError && "cursor-pointer",
          hasError && "cursor-not-allowed",
          className
        )}
        onClick={() => {
          if (!hasError && onClick) onClick(productUrl);
          if (!hasError && expandOnClick) setIsOpen(true);
        }}
      >
        {!loaded && <div className="w-full h-full animate-pulse bg-gray-300" />}
        <img
          src={isThumb ? thumbUrl : productUrl}
          data-step="0"
          alt={alt}
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-contain transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onError={(e) => {
            const chain = isThumb ? thumbChain(thumbUrl) : originalChain(productUrl);
            onImageError(e, chain);
            // Esgotou a cadeia (chegou ao placeholder): marca erro p/ desabilitar clique.
            if (Number(e.currentTarget.dataset.step ?? "0") >= chain.length - 1)
              setHasError(true);
          }}
        />
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-6/12">
          <DialogHeader>
            <DialogTitle>
              {productName ? `${productId} - ${productName}` : productId}
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {hasGallery ? (
            // Mais de uma foto cadastrada: carrossel navegável. As setas ficam
            // ancoradas DENTRO do card (o padrão do shadcn é -left-12/-right-12,
            // que as jogaria pra fora do dialog).
            <Carousel className="w-full">
              <CarouselContent>
                {gallery.map((img) => {
                  const chain = originalChain(img.originalUrl);
                  return (
                    <CarouselItem key={img.seq}>
                      <img
                        src={chain[0]}
                        data-step="0"
                        alt={alt}
                        className="w-full max-h-[70vh] object-contain"
                        onError={(e) => onImageError(e, chain)}
                      />
                    </CarouselItem>
                  );
                })}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          ) : (
            // Uma única foto (ou galeria ainda não carregada): imagem principal.
            <div>
              {(() => {
                const chain = originalChain(gallery[0]?.originalUrl ?? productUrl);
                return (
                  <img
                    src={chain[0]}
                    data-step="0"
                    alt={alt}
                    className="w-full max-h-[70vh] object-contain"
                    onError={(e) => onImageError(e, chain)}
                  />
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
