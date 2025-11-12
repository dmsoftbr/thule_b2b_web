import { useEffect, useState } from "react";
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
import { api, handleError } from "@/lib/api";
import type { UserPermissionModel } from "@/models/admin/user-permission.model";
import { check } from "zod";

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
  { id: "303", label: "Reintegrar Pedido com Erro" },
  { id: "304", label: "Confirmação de Pedidos" },
  { id: "305", label: "Alterar Preço" }, // nao tem
  // { id: "306", label: "Alterar Data de Entrega" },
  { id: "307", label: "Alterar Condição de Pagamento" }, // ok
  { id: "308", label: "Alterar Local de Entrega" }, // ok
  { id: "309", label: "Alterar Estabelecimento" }, // ok
  { id: "310", label: "Alterar Moeda" }, // nao tem
  { id: "311", label: "Alterar Transportadora" }, // nao tem
  { id: "312", label: "Alterar Datas Mínima/Máxima de Faturamento" }, // ok
  { id: "313", label: "Alterar Pedido Faturado Parcial" }, // ok
  { id: "314", label: "Alterar Frete Pago" }, // ok
  { id: "315", label: "Alterar Usa Transportadora do Cliente" }, // ok
  { id: "316", label: "Alterar Tabela de Preço" }, // ok
  { id: "317", label: "Alterar Classificação do Pedido" }, // ok
];

export const PermissionsModal = ({ user, isOpen, onClose }: Props) => {
  // state que mapeia cada checkbox por uma chave única (ex: "PAGE_1", "SALES_301", "REPORTS_201")
  const [permissionsMap, setPermissionsMap] = useState<UserPermissionModel[]>(
    []
  );

  useEffect(() => {
    if (!isOpen) return;
    getPermissions();
  }, [isOpen, user.id]);

  const getPermissions = async () => {
    const { data } = await api.get<UserPermissionModel[]>(
      `/admin/users/permissions/${user.id}`
    );
    const allPermissions: UserPermissionModel[] = [];

    PAGES.map((item) => {
      const dbItem = data.find((f) => f.permissionId == item.id);

      allPermissions.push({
        permissionId: item.id,
        userId: user.id,
        isPermitted: dbItem ? dbItem.isPermitted : false,
      });
    });

    PAGES_APP.map((item) => {
      const dbItem = data.find((f) => f.permissionId == item.id);

      allPermissions.push({
        permissionId: item.id,
        userId: user.id,
        isPermitted: dbItem ? dbItem.isPermitted : false,
      });
    });

    SALES.map((item) => {
      const dbItem = data.find((f) => f.permissionId == item.id);

      allPermissions.push({
        permissionId: item.id,
        userId: user.id,
        isPermitted: dbItem ? dbItem.isPermitted : false,
      });
    });

    REPORTS.map((item) => {
      const dbItem = data.find((f) => f.permissionId == item.id);

      allPermissions.push({
        permissionId: item.id,
        userId: user.id,
        isPermitted: dbItem ? dbItem.isPermitted : false,
      });
    });

    setPermissionsMap([...allPermissions]);
  };

  const toggle = (key: string, checked: boolean | "indeterminate") => {
    const sanitizedKey = key
      .replace("PAGE_", "")
      .replace("APP_", "")
      .replace("SALES_", "")
      .replace("REPORTS", "");
    const itemIndex = permissionsMap.findIndex(
      (f) => f.permissionId == sanitizedKey
    );

    if (itemIndex > -1) {
      permissionsMap[itemIndex].isPermitted = checked ? true : false;
      setPermissionsMap([...permissionsMap]);
      console.log(permissionsMap[itemIndex].isPermitted);
    }
  };

  const handleSave = async () => {
    try {
      // send the array directly (backend expects an array in the request body)
      await api.post(`/admin/users/permissions/${user.id}`, permissionsMap);
      toast.success("Permissões Gravadas!");
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(handleError(error));
    }
  };

  const getItemChecked = (permissionId: string) => {
    const sanitizedKey = permissionId
      .replace("PAGE_", "")
      .replace("APP_", "")
      .replace("SALES_", "")
      .replace("REPORTS", "");
    const item = permissionsMap.find((f) => f.permissionId == sanitizedKey);
    if (!item) return false;
    return item.isPermitted;
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
              <AccordionContent>
                <div className="flex flex-col gap-1 p-2">
                  {PAGES.map((page) => {
                    const key = `PAGE_${page.id}`;
                    return (
                      <Label
                        key={key}
                        className="flex items-center gap-2 cursor-pointer"
                        htmlFor={key}
                      >
                        <Checkbox
                          id={key}
                          checked={getItemChecked(key)}
                          onCheckedChange={(v) => toggle(key, v)}
                        />
                        {page.label}
                      </Label>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="app">
              <AccordionTrigger>App</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-1 p-2">
                  {PAGES_APP.map((page) => {
                    const key = `APP_${page.id}`;
                    return (
                      <Label
                        key={key}
                        className="flex items-center gap-2 cursor-pointer"
                        htmlFor={key}
                      >
                        <Checkbox
                          id={key}
                          checked={getItemChecked(key)}
                          onCheckedChange={(v) => toggle(key, v)}
                        />
                        {page.label}
                      </Label>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="sales">
              <AccordionTrigger>Vendas</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-1 p-2">
                  {SALES.map((page) => {
                    const key = `SALES_${page.id}`;
                    return (
                      <Label
                        key={key}
                        className="flex items-center gap-2 cursor-pointer"
                        htmlFor={key}
                      >
                        <Checkbox
                          id={key}
                          checked={getItemChecked(key)}
                          onCheckedChange={(v) => toggle(key, v)}
                        />
                        {page.label}
                      </Label>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="reports">
              <AccordionTrigger>Relatórios</AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-1 p-2">
                  {REPORTS.map((page) => {
                    const key = `REPORTS_${page.id}`;
                    return (
                      <Label
                        key={key}
                        className="flex items-center gap-2 cursor-pointer"
                        htmlFor={key}
                      >
                        <Checkbox
                          id={key}
                          checked={getItemChecked(key)}
                          onCheckedChange={(v) => toggle(key, v)}
                        />
                        {page.label}
                      </Label>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        <DialogFooter>
          <Button type="button" onClick={handleSave} variant="green">
            Gravar
          </Button>
          <Button type="button" onClick={onClose} variant="secondary">
            Fechar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
