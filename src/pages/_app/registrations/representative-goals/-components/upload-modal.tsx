import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { useState } from "react";

interface Props {
  isOpen: boolean;
  onClose: (refresh: boolean) => void;
}
export const UploadModal = ({ isOpen, onClose }: Props) => {
  const [files, setFiles] = useState<File[] | undefined>();
  const handleDrop = (files: File[]) => {
    console.log(files);
    setFiles(files);
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload de Metas</DialogTitle>
          <DialogDescription>
            Utilize o modelo para realizar a importação da planilha com Dados
            das metas.
          </DialogDescription>
        </DialogHeader>
        <div>
          <Dropzone
            className=""
            maxSize={1024 * 1024 * 100}
            minSize={1024}
            onDrop={handleDrop}
            onError={console.error}
            src={files}
          >
            <DropzoneEmptyState />
            <DropzoneContent />
          </Dropzone>
        </div>
        <div className="flex justify-between w-full flex-1">
          <Button className="self-start" asChild>
            <a href="/modelo_metas_representante.xlsx" download>
              Baixar Modelo
            </a>
          </Button>
          <div className="flex gap-x-2">
            <Button variant="blue">Upload</Button>
            <Button variant="secondary" onClick={() => onClose(false)}>
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
