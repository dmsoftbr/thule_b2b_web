import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Props {
  productId: string;
  productName?: string;
  alt: string;
  className?: string;
  onClick?: (url: string) => void;
  isThumb?: boolean;
  expandOnClick?: boolean;
}

const DEFAULT_URL = `https://remote.thule.com/imgrepo/`;
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
  const productUrl = `${DEFAULT_URL}${productId}.jpg`;
  const thumbUrl = `products/thumbs/${productId}.jpeg`;
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
          alt={alt}
          onLoad={() => setLoaded(true)}
          className={`w-full h-full object-contain transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          onError={(e) => {
            e.currentTarget.src = `products/sem_imagem.jpg`;
            setHasError(true);
          }}
        />
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="w-6/12">
          <DialogHeader>
            <DialogTitle>
              {productId} - {productName}
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div>
            <img
              src={productUrl}
              alt={alt}
              onLoad={() => setLoaded(true)}
              className={`w-full h-full object-contain transition-opacity duration-300 ${
                loaded ? "opacity-100" : "opacity-0"
              }`}
              onError={(e) => {
                e.currentTarget.src = `products/sem_imagem.jpg`;
                setHasError(true);
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
