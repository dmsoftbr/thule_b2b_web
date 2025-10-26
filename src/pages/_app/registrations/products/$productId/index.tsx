import { AppPageHeader } from "@/components/layout/app-page-header";
import { createFileRoute, useParams } from "@tanstack/react-router";
import { TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { useAppDialog } from "@/components/app-dialog/use-app-dialog";
import { ProductImage } from "@/components/app/product-image";

export const Route = createFileRoute(
  "/_app/registrations/products/$productId/"
)({
  component: ProductIdPageComponent,
});

function ProductIdPageComponent() {
  const { productId } = useParams({
    from: "/_app/registrations/products/$productId/",
  });
  const { showAppDialog } = useAppDialog();
  const [existingFiles, setExistingFiles] = useState<string[]>([]);
  const [files, setFiles] = useState<File[] | undefined>();
  const handleDrop = (files: File[]) => {
    console.log(files);
    setFiles(files);
  };

  useEffect(() => {
    setExistingFiles(["532002.jpg"]);
  }, []);

  async function handleRemovePhoto(id: string) {
    const confirmed = await showAppDialog({
      type: "confirm",
      message: "Remover esta Foto?",
      title: "Atenção",
      buttons: [
        { text: "Sim", value: true, variant: "primary" },
        { text: "Não", value: false, variant: "secondary" },
      ],
    });

    if (confirmed) {
      console.log(id);
    }
  }

  return (
    <AppPageHeader
      titleSlot={`Informações Adicionais do Produto: ${productId}`}
    >
      <div className="p-2">
        <h2 className="bg-neutral-100 border border-neutral-200 p-2 rounded-tl-md rounded-tr-md flex items-center justify-between">
          <p className="text-lg font-semibold">Fotos</p>
        </h2>
        <div className="grid grid-cols-8 w-full gap-4 border p-4">
          {existingFiles?.map((file) => (
            <div className="group">
              <div className="border rounded-lg h-full relative">
                <ProductImage productId={productId} alt="Imagem do Produto" />
                <div
                  className="absolute right-4 top-4 hover:bg-neutral-200 cursor-pointer transition rounded-md p-2"
                  role="button"
                  onClick={() => handleRemovePhoto(file)}
                >
                  <TrashIcon className="text-red-500 size-4" />
                </div>
              </div>
            </div>
          ))}
          <Dropzone
            className=""
            maxSize={1024 * 1024 * 10}
            minSize={1024}
            onDrop={handleDrop}
            onError={console.error}
            src={files}
          >
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>
        </div>
      </div>
    </AppPageHeader>
  );
}
