import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { UserModel } from "@/models/user.model";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  user: UserModel;
}

const PAGES = [
  { id: "1", label: "Metas de Representantes" },
  { id: "2", label: "Condições de Pagamento" },
  { id: "3", label: "Tabelas de Preço por Cliente" },
  { id: "4", label: "Grupos de Venda" },
  { id: "5", label: "Avisos" },
  { id: "6", label: "Alçadas de Aprovação" },
  { id: "7", label: "Produtos" },
  { id: "8", label: "Clientes" },
  { id: "9", label: "Aprovações" },
  { id: "10", label: "Aprovações" },
  { id: "11", label: "Grupos de Usuário" },
  { id: "12", label: "Usuários" },
  { id: "13", label: "Configurações do Portal" },
  { id: "14", label: "Sincronização" },
];

const PAGES_APP = [
  { id: "101", label: "Notificações" },
  { id: "102", label: "Comunicados" },
  { id: "103", label: "Links Úteis" },
];

const REPORTS = [
  { id: "201", label: "Lista de Clientes" },
  { id: "202", label: "Lista de Pedidos" },
  { id: "203", label: "Produtos Vendidos" },
  { id: "204", label: "Faturamento" },
  { id: "205", label: "Análise de Desempenho" },
  { id: "206", label: "Comissão" },
  { id: "207", label: "Títulos Financeiros" },
  { id: "208", label: "Itens sem Saldo" },
];

const SALES = [
  { id: "301", label: "Alterar Pedido Aprovado" },
  { id: "302", label: "Reprovar Pedido Aprovado" },
  { id: "302", label: "Reintegrar pedido com Erro" },
  { id: "302", label: "Confirmação de Pedidos" },
  { id: "302", label: "Alterar Preço" },
  { id: "302", label: "Alterar Data de Entrega" },
  { id: "302", label: "Alterar Condição de Pagamento" },
  { id: "302", label: "Alterar Local de Entrega" },
  { id: "302", label: "Alterar Estabelecimento" },
  { id: "302", label: "Alterar Moeda" },
  { id: "302", label: "Alterar Transportadora" },
  { id: "302", label: "Alterar Datas Mínima/Máxima de Faturamento" },
  { id: "302", label: "Alterar Pedido Faturado Parcial" },
  { id: "302", label: "Alterar Frete Pago" },
  { id: "302", label: "Alterar Usa Transportadora do Cliente" },
  { id: "302", label: "Alterar Tabela de Preço" },
];

export const PermissionsModal = ({ user, isOpen, onClose }: Props) => {
  const handleSave = async () => {
    toast.success("Permissões Gravadas!");
    onClose();
  };
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Permissões do Usuário:{" "}
            <span className="text-blue-600 font-semibold">{user.id}</span>
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          <Accordion type="single" collapsible>
            <AccordionItem value="pages">
              <AccordionTrigger>Páginas</AccordionTrigger>
              <AccordionContent className="space-y-2">
                {PAGES.map((page, index) => (
                  <Label className="cursor-pointer" key={index}>
                    <Checkbox />
                    {page.label}
                  </Label>
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="app">
              <AccordionTrigger>App</AccordionTrigger>
              <AccordionContent className="space-y-2">
                {PAGES_APP.map((page, index) => (
                  <Label className="cursor-pointer" key={index}>
                    <Checkbox />
                    {page.label}
                  </Label>
                ))}
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sales">
              <AccordionTrigger>Vendas</AccordionTrigger>
              <AccordionContent className="space-y-2">
                {SALES.map((page, index) => (
                  <Label className="cursor-pointer" key={index}>
                    <Checkbox />
                    {page.label}
                  </Label>
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="reports">
              <AccordionTrigger>Relatórios</AccordionTrigger>
              <AccordionContent className="space-y-2">
                {REPORTS.map((page, index) => (
                  <Label className="cursor-pointer" key={index}>
                    <Checkbox />
                    {page.label}
                  </Label>
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <DialogFooter>
          <Button type="button" onClick={() => handleSave()} variant="green">
            Gravar
          </Button>
          <Button type="button" onClick={() => onClose()} variant="secondary">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
