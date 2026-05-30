import {
  TreeView,
  type TreeNode,
} from "@/components/tree-checkbox/tree-checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  SearchCombo,
  type SearchComboItem,
} from "@/components/ui/search-combo";
import { api, handleError } from "@/lib/api";
import { convertArrayToSearchComboItem } from "@/lib/search-combo-utils";
import { PriceExceptionTablesService } from "@/services/registrations/price-exception-tables.service";
import { Loader2Icon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

interface NodeConfig {
  marginPercent: number;
  branchIds: string[];
}

interface NodeData {
  marginPercent?: number | null;
  branchIds?: string[];
}

interface Props {
  exceptionTableId: string;
}

const EMPTY_DATA: TreeNode[] = [];

export const ExceptionTreeEditor = ({ exceptionTableId }: Props) => {
  const [treeData, setTreeData] = useState<TreeNode[]>([]);
  const [configured, setConfigured] = useState<Record<string, NodeConfig>>({});
  const [activeNodeId, setActiveNodeId] = useState<string | undefined>();
  const [branches, setBranches] = useState<SearchComboItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Mapa path -> nó (para mostrar o rótulo do nó ativo no painel).
  const nodeLabelByPath = useMemo(() => {
    const map = new Map<string, string>();
    const traverse = (nodes: TreeNode[]) => {
      for (const n of nodes) {
        map.set(n.id, n.label);
        if (n.children) traverse(n.children);
      }
    };
    traverse(treeData);
    return map;
  }, [treeData]);

  // Decora a árvore com badge de margem nos nós configurados. Reconstrói quando
  // `configured` muda; como os ids permanecem iguais, o TreeView preserva a
  // seleção local (checkbox) e apenas atualiza os badges.
  const decoratedTree = useMemo(() => {
    const decorate = (nodes: TreeNode[]): TreeNode[] =>
      nodes.map((node) => {
        const cfg = configured[node.id];
        const children = node.children ? decorate(node.children) : node.children;
        return {
          ...node,
          checked: !!cfg,
          badge: cfg
            ? {
                text: `${cfg.marginPercent}%`,
                className: "bg-blue-100 text-blue-700 border-blue-200",
              }
            : undefined,
          children,
        };
      });
    return decorate(treeData);
  }, [treeData, configured]);

  const loadBranches = async () => {
    try {
      const { data } = await api.get(`/registrations/branches/all`);
      setBranches(convertArrayToSearchComboItem(data, "id", "name", true));
    } catch (error) {
      toast.error(handleError(error));
    }
  };

  const loadTree = async () => {
    try {
      const data = await PriceExceptionTablesService.getTree(exceptionTableId);
      setTreeData(data);

      // Semeia a configuração a partir dos nós já marcados (margem/estab. vindos do banco).
      const seed: Record<string, NodeConfig> = {};
      const traverse = (nodes: TreeNode[]) => {
        for (const n of nodes) {
          if (n.checked) {
            const d = (n.data ?? {}) as NodeData;
            seed[n.id] = {
              marginPercent: d.marginPercent ?? 0,
              branchIds: d.branchIds ?? [],
            };
          }
          if (n.children) traverse(n.children);
        }
      };
      traverse(data);
      setConfigured(seed);
    } catch (error) {
      toast.error(handleError(error));
    }
  };

  useEffect(() => {
    loadBranches();
    loadTree();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exceptionTableId]);

  // Sincroniza a inclusão/remoção de nós (checkbox) com o mapa de configuração.
  const handleSelectionChange = useCallback((ids: string[]) => {
    setConfigured((prev) => {
      const next: Record<string, NodeConfig> = {};
      for (const id of ids) {
        next[id] = prev[id] ?? { marginPercent: 0, branchIds: [] };
      }
      return next;
    });
  }, []);

  const handleNodeClick = useCallback((nodeId: string) => {
    setActiveNodeId(nodeId);
  }, []);

  const updateActiveMargin = (value: number) => {
    if (!activeNodeId) return;
    setConfigured((prev) => {
      if (!prev[activeNodeId]) return prev;
      return {
        ...prev,
        [activeNodeId]: { ...prev[activeNodeId], marginPercent: value },
      };
    });
  };

  const updateActiveBranches = (items: SearchComboItem[]) => {
    if (!activeNodeId) return;
    setConfigured((prev) => {
      if (!prev[activeNodeId]) return prev;
      return {
        ...prev,
        [activeNodeId]: {
          ...prev[activeNodeId],
          branchIds: items.map((i) => i.value),
        },
      };
    });
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const rules = Object.entries(configured).map(([selectionPath, cfg]) => ({
        selectionPath,
        marginPercent: Number(cfg.marginPercent) || 0,
        branchIds: cfg.branchIds,
      }));
      await PriceExceptionTablesService.saveGrid(exceptionTableId, rules);
      toast.success("Regras gravadas com sucesso!");
    } catch (error) {
      toast.error(handleError(error));
    } finally {
      setIsSaving(false);
    }
  };

  const activeConfig = activeNodeId ? configured[activeNodeId] : undefined;

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs bg-amber-200 rounded py-1 px-2 w-fit">
        Marque o nó (checkbox) para incluí-lo no grupo; clique no nome para
        configurar margem e estabelecimentos. O nó mais específico prevalece.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-4">
        {/* Árvore */}
        <div className="min-h-[420px]">
          <TreeView
            data={decoratedTree ?? EMPTY_DATA}
            selectionMode="node"
            onSelectionChange={handleSelectionChange}
            onNodeClick={handleNodeClick}
            activeNodeId={activeNodeId}
            className="shadow-sm h-[60vh]"
            searchable
            searchPlaceholder="Buscar..."
            showSelectAllButtons={false}
          />
        </div>

        {/* Painel lateral */}
        <div className="border rounded-md p-4 bg-white h-fit space-y-4">
          <h3 className="font-semibold text-sm">Configuração do nó</h3>

          {!activeNodeId && (
            <p className="text-xs text-gray-500">
              Selecione um nó na árvore para ver/editar sua configuração.
            </p>
          )}

          {activeNodeId && (
            <>
              <div className="space-y-1">
                <Label className="text-xs text-gray-500">Nó selecionado</Label>
                <p className="text-sm font-medium break-words">
                  {nodeLabelByPath.get(activeNodeId) ?? activeNodeId}
                </p>
              </div>

              {!activeConfig && (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
                  Este nó não está incluído no grupo. Marque o checkbox dele na
                  árvore para configurar a margem.
                </p>
              )}

              {activeConfig && (
                <>
                  <div className="space-y-1">
                    <Label htmlFor="margin">Margem (%)</Label>
                    <Input
                      id="margin"
                      type="number"
                      min={0}
                      max={100}
                      step={0.01}
                      value={activeConfig.marginPercent}
                      onChange={(e) =>
                        updateActiveMargin(Number(e.target.value))
                      }
                    />
                    <p className="text-[11px] text-gray-500">
                      Preço de venda = PreçoSug − (PreçoSug × Margem / 100)
                    </p>
                  </div>

                  <div className="space-y-1">
                    <Label>Estabelecimentos permitidos</Label>
                    <SearchCombo
                      key={activeNodeId}
                      multipleSelect
                      staticItems={branches}
                      defaultValue={activeConfig.branchIds}
                      onSelectOption={updateActiveBranches}
                      placeholder="Selecione os estabelecimentos"
                    />
                    <p className="text-[11px] text-gray-500">
                      O produto só pode ser vendido pelos estabelecimentos
                      listados. Vazio = bloqueia a venda em todos.
                    </p>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>

      <div className="flex items-center justify-end gap-x-2">
        <Button disabled={isSaving} onClick={handleSave}>
          {isSaving ? (
            <span className="flex items-center gap-1">
              <Loader2Icon className="size-3 animate-spin" />
              Gravando...
            </span>
          ) : (
            <span>Gravar</span>
          )}
        </Button>
      </div>
    </div>
  );
};
