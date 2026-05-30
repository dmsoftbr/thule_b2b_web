import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  PERMISSIONS_APP_ADMIN,
  PERMISSIONS_APPROVALS,
  PERMISSIONS_BUDGETS,
  PERMISSIONS_DASHBOARDS,
  PERMISSIONS_ORDERS,
  PERMISSIONS_ORDER_CONFIRMATION,
  PERMISSIONS_OUTLET,
  PERMISSIONS_PRICE_ADMIN,
  PERMISSIONS_QUERIES,
  PERMISSIONS_REGISTRATIONS,
  PERMISSIONS_REPORTS,
  PERMISSIONS_SALES,
  PERMISSIONS_SETTINGS,
  type PermissionItem,
} from "@/lib/permissions";

export type PermissionsFormValue = {
  permissionId: string;
  isPermitted: boolean;
  fromGroup?: boolean;
};

interface Props {
  value: PermissionsFormValue[];
  onChange: (next: PermissionsFormValue[]) => void;
  /**
   * `user`: itens herdados do grupo aparecem marcados e desabilitados.
   * `group`: todos os itens são editáveis.
   */
  mode: "user" | "group";
}

const SECTIONS: { title: string; prefix: string; items: PermissionItem[] }[] = [
  { title: "Dashboards", prefix: "DASH", items: PERMISSIONS_DASHBOARDS },
  { title: "Outlet", prefix: "OUTLET", items: PERMISSIONS_OUTLET },
  { title: "Pedidos", prefix: "ORDERS", items: PERMISSIONS_ORDERS },
  { title: "Simulações", prefix: "BUDGETS", items: PERMISSIONS_BUDGETS },
  {
    title: "Confirmação Pedido",
    prefix: "ORDER_CONFIRMATION",
    items: PERMISSIONS_ORDER_CONFIRMATION,
  },
  { title: "Consultas", prefix: "QUERIES", items: PERMISSIONS_QUERIES },
  { title: "Relatórios", prefix: "REPORTS", items: PERMISSIONS_REPORTS },
  { title: "Aprovações", prefix: "APPROVALS", items: PERMISSIONS_APPROVALS },
  {
    title: "Cadastros Gerais",
    prefix: "REGISTRATIONS",
    items: PERMISSIONS_REGISTRATIONS,
  },
  { title: "Adm. Preços", prefix: "PRICE_ADMIN", items: PERMISSIONS_PRICE_ADMIN },
  { title: "Adm. Aplicativo", prefix: "APP_ADMIN", items: PERMISSIONS_APP_ADMIN },
  { title: "Configurações", prefix: "SETTINGS", items: PERMISSIONS_SETTINGS },
  { title: "Vendas", prefix: "SALES", items: PERMISSIONS_SALES },
];

export const PermissionsForm = ({ value, onChange, mode }: Props) => {
  const findItem = (permissionId: string) =>
    value.find((v) => v.permissionId === permissionId);

  const isChecked = (permissionId: string) => {
    const item = findItem(permissionId);
    return item?.isPermitted ?? false;
  };

  const isDisabled = (permissionId: string) => {
    if (mode !== "user") return false;
    return findItem(permissionId)?.fromGroup === true;
  };

  const toggle = (permissionId: string, checked: boolean | "indeterminate") => {
    const next = [...value];
    const idx = next.findIndex((v) => v.permissionId === permissionId);
    const isPermitted = checked === true;
    if (idx > -1) {
      next[idx] = { ...next[idx], isPermitted };
    } else {
      next.push({ permissionId, isPermitted });
    }
    onChange(next);
  };

  return (
    <Accordion type="single" collapsible>
      {SECTIONS.map((section) => (
        <AccordionItem key={section.prefix} value={section.prefix.toLowerCase()}>
          <AccordionTrigger>{section.title}</AccordionTrigger>
          <AccordionContent>
            <div className="flex flex-col gap-1 p-2">
              {section.items.map((page) => {
                const key = `${section.prefix}_${page.id}`;
                const disabled = isDisabled(page.id);
                return (
                  <Label
                    key={key}
                    className="flex items-center gap-2 cursor-pointer"
                    htmlFor={key}
                    title={
                      disabled ? "Permissão herdada do grupo" : undefined
                    }
                  >
                    <Checkbox
                      id={key}
                      checked={isChecked(page.id)}
                      disabled={disabled}
                      onCheckedChange={(v) => toggle(page.id, v)}
                    />
                    {page.label}
                    {disabled && (
                      <span className="text-xs text-muted-foreground">
                        (herdada do grupo)
                      </span>
                    )}
                  </Label>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};
