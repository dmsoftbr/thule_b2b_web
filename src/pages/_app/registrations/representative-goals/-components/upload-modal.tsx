import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { api, handleError } from "@/lib/api";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: (refresh: boolean) => void;
}
export const UploadModal = ({ isOpen, onClose }: Props) => {
  const [ano, setAno] = useState(new Date().getFullYear());
  const [percentual, setPercentual] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<File[] | undefined>();
  const handleDrop = (files: File[]) => {
    console.log(files);
    setFiles(files);
  };

  const handleUpload = async () => {
    if (!files?.[0]) {
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("ano", ano.toString());
      formData.append("percentual", percentual.toString());

      await api.post(
        "/registrations/representative-goals/import-profitability",
        formData,
      );
      onClose(true);
    } catch (error) {
      console.error(error);
      toast.error(handleError(error));
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog
      open={isOpen}
      onOpenChange={() => {
        if (isLoading) return false;
        onClose(false);
      }}
    >
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Upload de Metas</DialogTitle>
          <DialogDescription>
            Utilize o Relatório Profitability do TOTVS (em .csv) para realizar a
            importação dos dados das metas.
          </DialogDescription>
        </DialogHeader>
        <div className="form-group">
          <Label>Considerar dados como sendo Ano:</Label>
          <Input
            type="number"
            min={2020}
            max={2072}
            step={1}
            value={ano.toString()}
            onChange={(e) => setAno(Number(e.target.value))}
          />
        </div>
        <div className="form-group">
          <Label>% de Reajuste:</Label>
          <NumericFormat
            decimalScale={2}
            decimalSeparator=","
            fixedDecimalScale
            min={0}
            max={1000}
            step={1}
            value={percentual}
            onValueChange={(value) => setPercentual(value.floatValue ?? 0)}
            className="form-input"
          />
        </div>
        <div>
          <Dropzone
            disabled={isLoading}
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
          <div></div>
          <div className="flex gap-x-2">
            <Button
              variant="blue"
              onClick={() => handleUpload()}
              disabled={isLoading}
            >
              {isLoading && (
                <div className="flex gap-x-2">
                  <Loader2Icon className="animate-spin" />
                  Aguarde...
                </div>
              )}
              {!isLoading && <span>Upload</span>}
            </Button>
            <Button
              variant="secondary"
              onClick={() => onClose(false)}
              disabled={isLoading}
            >
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
