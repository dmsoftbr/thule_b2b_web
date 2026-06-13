import { AppPageHeader } from "@/components/layout/app-page-header";
import {
  createFileRoute,
  useNavigate,
  useParams,
} from "@tanstack/react-router";
import { Loader2Icon, StarIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { useAppDialog } from "@/components/app-dialog/use-app-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ProductsService,
  type ProductImageModel,
} from "@/services/registrations/products.service";
import { handleError } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  thumbChain,
  originalChain,
  onImageError,
} from "@/lib/product-images";

export const Route = createFileRoute(
  "/_app/registrations/products/$productId/"
)({
  component: ProductIdPageComponent,
});

function ProductIdPageComponent() {
  const navigate = useNavigate();
  const { productId } = useParams({
    from: "/_app/registrations/products/$productId/",
  });
  const { showAppDialog } = useAppDialog();
  const queryClient = useQueryClient();

  const [expanded, setExpanded] = useState<ProductImageModel | null>(null);
  const [expandedLoading, setExpandedLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const imagesQueryKey = ["product-images", productId] as const;

  const { data: images = [], isLoading } = useQuery({
    queryKey: imagesQueryKey,
    queryFn: () => ProductsService.getImages(productId),
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: imagesQueryKey });

  // Upload sequencial: o dropzone pode entregar vários arquivos de uma vez.
  async function handleDrop(accepted: File[]) {
    if (accepted.length === 0) return;
    setIsUploading(true);
    let ok = 0;
    for (const file of accepted) {
      try {
        await ProductsService.uploadImage(productId, file);
        ok++;
      } catch (error) {
        toast.error(handleError(error));
      }
    }
    setIsUploading(false);
    await invalidate();
    if (ok > 0)
      toast.success(ok === 1 ? "Foto enviada." : `${ok} fotos enviadas.`);
  }

  const setMainMutation = useMutation({
    mutationFn: (seq: number) => ProductsService.setMainImage(productId, seq),
    onSuccess: async () => {
      await invalidate();
      toast.success("Foto principal definida.");
    },
    onError: (error) => toast.error(handleError(error)),
  });

  async function handleRemovePhoto(image: ProductImageModel) {
    const confirmed = await showAppDialog({
      type: "confirm",
      message: image.isMain
        ? "Esta é a foto principal. Removê-la promoverá outra foto a principal (se houver). Continuar?"
        : "Remover esta Foto?",
      title: "Atenção",
      buttons: [
        { text: "Sim", value: true, variant: "primary" },
        { text: "Não", value: false, variant: "secondary" },
      ],
    });
    if (!confirmed) return;

    try {
      await ProductsService.deleteImage(productId, image.seq);
      await invalidate();
      toast.success("Foto removida.");
    } catch (error) {
      toast.error(handleError(error));
    }
  }

  return (
    <AppPageHeader titleSlot={`Informações Adicionais do Produto: ${productId}`}>
      <div className="p-2 sm:p-4">
        <div className="flex items-center justify-between gap-2 bg-neutral-100 border border-neutral-200 p-2 rounded-t-md">
          <p className="text-base sm:text-lg font-semibold">Fotos</p>
          <span className="text-xs text-neutral-500">
            {images.length} {images.length === 1 ? "foto" : "fotos"}
          </span>
        </div>

        <div className="border border-t-0 rounded-b-md p-3 sm:p-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-10 text-neutral-500">
              <Loader2Icon className="size-5 animate-spin mr-2" /> Carregando
              fotos...
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {images.map((image) => (
                <div
                  key={image.seq}
                  className={cn(
                    "group relative border rounded-lg overflow-hidden bg-white flex flex-col",
                    image.isMain && "ring-2 ring-blue-500"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setExpandedLoading(true);
                      setExpanded(image);
                    }}
                    className="relative aspect-square w-full flex items-center justify-center bg-neutral-50"
                    title="Ampliar imagem"
                  >
                    <img
                      src={image.thumbUrl}
                      data-step="0"
                      alt={`Foto ${image.seq} do produto ${productId}`}
                      className="w-full h-full object-contain"
                      onError={(e) => onImageError(e, thumbChain(image.thumbUrl))}
                    />
                    {image.isMain && (
                      <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-blue-600 text-white text-[10px] font-medium px-2 py-0.5">
                        <StarIcon className="size-3 fill-current" /> Principal
                      </span>
                    )}
                  </button>

                  <div className="flex items-center justify-between border-t px-2 py-1.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-xs"
                      disabled={image.isMain || setMainMutation.isPending}
                      onClick={() => setMainMutation.mutate(image.seq)}
                      title={
                        image.isMain
                          ? "Já é a foto principal"
                          : "Tornar foto principal"
                      }
                    >
                      <StarIcon
                        className={cn(
                          "size-4",
                          image.isMain && "fill-blue-500 text-blue-500"
                        )}
                      />
                      {!image.isMain && <span className="ml-1">Principal</span>}
                    </Button>
                    <button
                      type="button"
                      className="hover:bg-neutral-100 rounded-md p-1.5 transition"
                      onClick={() => handleRemovePhoto(image)}
                      title="Remover foto"
                    >
                      <TrashIcon className="text-red-500 size-4" />
                    </button>
                  </div>
                </div>
              ))}

              <Dropzone
                className="aspect-square h-auto min-h-0"
                maxFiles={20}
                maxSize={1024 * 1024 * 10}
                minSize={1024}
                accept={{ "image/*": [] }}
                disabled={isUploading}
                onDrop={handleDrop}
                onError={(e) => toast.error(e.message)}
              >
                {isUploading ? (
                  <div className="flex flex-col items-center justify-center gap-2 text-neutral-500">
                    <Loader2Icon className="size-5 animate-spin" />
                    <span className="text-xs">Enviando...</span>
                  </div>
                ) : (
                  <>
                    <DropzoneEmptyState />
                    <DropzoneContent />
                  </>
                )}
              </Dropzone>
            </div>
          )}
        </div>
      </div>

      <div className="my-2 px-2 sm:px-4">
        <Button
          variant="outline"
          onClick={() => navigate({ to: "/registrations/products" })}
        >
          Voltar p/Lista de Produtos
        </Button>
      </div>

      <Dialog open={!!expanded} onOpenChange={(o) => !o && setExpanded(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Produto {productId}</DialogTitle>
            <DialogDescription>Imagem em tamanho original</DialogDescription>
          </DialogHeader>
          {expanded && (
            <div className="w-full">
              {expandedLoading && (
                <div className="flex flex-col items-center justify-center gap-2 py-20 text-neutral-500">
                  <Loader2Icon className="size-6 animate-spin" />
                  <span className="text-sm">Aguarde, carregando imagem...</span>
                </div>
              )}
              <img
                key={expanded.seq}
                src={expanded.originalUrl}
                alt={`Imagem do produto ${productId}`}
                data-step="0"
                className={cn(
                  "w-full max-h-[70vh] object-contain",
                  expandedLoading && "hidden"
                )}
                onLoad={() => setExpandedLoading(false)}
                onError={(e) =>
                  onImageError(e, originalChain(expanded.originalUrl))
                }
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AppPageHeader>
  );
}
