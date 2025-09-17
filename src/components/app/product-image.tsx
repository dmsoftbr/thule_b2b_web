import { cn } from "@/lib/utils";
import { useState } from "react";

interface Props {
  productId: string;
  alt: string;
  className?: string;
  onClick?: (url: string) => void;
}

const DEFAULT_URL = `https://remote.thule.com/imgrepo/`;
export const ProductImage = ({ productId, alt, className, onClick }: Props) => {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const productUrl = `${DEFAULT_URL}${productId}.jpg`;
  return (
    <div
      className={cn(
        "w-[128px] h-[128px] rounded-md overflow-hidden bg-white",
        onClick && !hasError && "cursor-pointer",
        hasError && "cursor-not-allowed",
        className
      )}
      onClick={() => {
        !hasError ? onClick?.(productUrl) : null;
      }}
    >
      {!loaded && <div className="w-full h-full animate-pulse bg-gray-300" />}
      <img
        src={productUrl}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-contain transition-opacity duration-300 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onError={(e) => {
          e.currentTarget.src = `/products/sem_imagem.jpg`;
          setHasError(true);
        }}
      />
    </div>
  );
};
