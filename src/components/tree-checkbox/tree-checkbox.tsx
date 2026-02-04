import React, {
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef,
} from "react";
import {
  ChevronRight,
  ChevronDown,
  Search,
  X,
  CheckSquare,
  Square,
  FolderOpen,
  Folder,
  File,
} from "lucide-react";
import { Input } from "@/components/ui/input";

// --- TIPOS ---

export interface TreeNode {
  id: string;
  label: string;
  checked?: boolean;
  children?: TreeNode[];
  data?: any;
}

interface CheckboxState {
  checked: boolean;
  indeterminate: boolean;
}

interface TreeViewProps {
  data: TreeNode[];
  onSelectionChange?: (selectedIds: string[]) => void;
  className?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  showSelectAllButtons?: boolean;
  isReadOnly?: boolean;
  isLoading?: boolean;
}

interface TreeNodeProps {
  node: TreeNode;
  level: number;
  expandedNodes: Set<string>;
  checkedStates: Map<string, CheckboxState>;
  onToggleExpand: (nodeId: string) => void;
  onToggleCheck: (nodeId: string) => void;
  searchTerm?: string;
  filteredNodeIds?: Set<string>;
  isReadOnly?: boolean;
}

// --- UTILITÁRIOS ---

const toStr = (id: string | number): string => String(id);

const getInitialCheckedIds = (nodes: TreeNode[]): Set<string> => {
  const checkedIds = new Set<string>();
  // Carregamento ESTRITO: Respeita exatamente o que vem da API.
  // Se o pai vier checked=true e o filho checked=false (ou undefined),
  // apenas o pai entra no Set.
  const traverse = (nodeList: TreeNode[]) => {
    for (const node of nodeList) {
      if (node.checked) {
        checkedIds.add(toStr(node.id));
      }
      if (node.children) {
        traverse(node.children);
      }
    }
  };
  traverse(nodes);
  return checkedIds;
};

// --- COMPONENTES FILHOS ---

const OptimizedCheckbox = ({
  checked,
  indeterminate,
  onChange,
  isReadOnly,
}: {
  checked: boolean;
  indeterminate: boolean;
  isReadOnly: boolean;
  onChange: () => void;
}) => {
  return (
    <button
      type="button"
      disabled={isReadOnly}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors focus:outline-none ${
        checked
          ? "bg-blue-600 border-blue-600"
          : indeterminate
            ? "bg-blue-600 border-blue-600"
            : "bg-white border-gray-300 hover:border-gray-400"
      } ${isReadOnly ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {checked && (
        <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
          <path
            d="M10 3L4.5 8.5L2 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
      {indeterminate && !checked && <div className="w-2 h-0.5 bg-white" />}
    </button>
  );
};

// Removido React.memo para garantir atualizações visuais consistentes
const TreeNodeComponent = ({
  node,
  level,
  expandedNodes,
  checkedStates,
  onToggleExpand,
  onToggleCheck,
  searchTerm,
  filteredNodeIds,
  isReadOnly = false,
}: TreeNodeProps) => {
  const nodeIdStr = toStr(node.id);
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(nodeIdStr);
  const checkboxState = checkedStates.get(nodeIdStr) || {
    checked: false,
    indeterminate: false,
  };
  const paddingLeft = level * 20;
  const shouldShow = !filteredNodeIds || filteredNodeIds.has(nodeIdStr);

  const highlightedLabel = useMemo(() => {
    if (!searchTerm) return node.label;
    const parts = node.label.split(new RegExp(`(${searchTerm})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === searchTerm.toLowerCase() ? (
            <span key={i} className="bg-yellow-200 font-semibold text-black">
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </>
    );
  }, [node.label, searchTerm]);

  const handleCheckboxChange = useCallback(() => {
    onToggleCheck(nodeIdStr);
  }, [nodeIdStr, onToggleCheck]);

  const handleExpandToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (hasChildren) {
        onToggleExpand(nodeIdStr);
      }
    },
    [hasChildren, nodeIdStr, onToggleExpand],
  );

  if (!shouldShow) return null;

  return (
    <div className="select-none" id={node.id}>
      <div
        className="flex items-center py-1 px-2 hover:bg-gray-50 rounded-sm group transition-colors"
        style={{ paddingLeft: `${paddingLeft + 8}px` }}
      >
        <button
          type="button"
          onClick={handleExpandToggle}
          className={`w-4 h-4 flex items-center justify-center mr-1 rounded-sm hover:bg-gray-200 transition-colors focus:outline-none ${
            !hasChildren ? "invisible" : ""
          }`}
          disabled={!hasChildren}
        >
          {hasChildren &&
            (isExpanded ? (
              <ChevronDown className="w-3 h-3 text-gray-600" />
            ) : (
              <ChevronRight className="w-3 h-3 text-gray-600" />
            ))}
        </button>

        <div className="mr-2">
          <OptimizedCheckbox
            checked={checkboxState.checked}
            indeterminate={checkboxState.indeterminate}
            onChange={handleCheckboxChange}
            isReadOnly={isReadOnly}
          />
        </div>

        <div className="mr-2">
          {hasChildren ? (
            isExpanded ? (
              <FolderOpen className="w-4 h-4 text-yellow-500" />
            ) : (
              <Folder className="w-4 h-4 text-yellow-500" />
            )
          ) : (
            <File className="w-4 h-4 text-gray-500" />
          )}
        </div>

        <span
          className="text-sm text-gray-700 flex-1 truncate cursor-pointer"
          onClick={handleExpandToggle}
        >
          {highlightedLabel}
        </span>
      </div>

      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((childNode) => (
            <TreeNodeComponent
              key={toStr(childNode.id)}
              node={childNode}
              level={level + 1}
              expandedNodes={expandedNodes}
              checkedStates={checkedStates}
              onToggleExpand={onToggleExpand}
              onToggleCheck={onToggleCheck}
              searchTerm={searchTerm}
              filteredNodeIds={filteredNodeIds}
              isReadOnly={isReadOnly}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// --- COMPONENTE PRINCIPAL ---

export const TreeView: React.FC<TreeViewProps> = ({
  data,
  onSelectionChange,
  className = "",
  searchable = true,
  isReadOnly = false,
  searchPlaceholder = "Buscar...",
  showSelectAllButtons = true,
  isLoading = false,
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [checkedNodes, setCheckedNodes] = useState<Set<string>>(() =>
    getInitialCheckedIds(data),
  );

  // Assinatura da estrutura dos dados (IDs concatenados).
  // Usada para detectar se 'data' representa uma NOVA árvore ou apenas um re-render da mesma.
  const dataSignature = useMemo(() => {
    const ids: string[] = [];
    const traverse = (nodes: TreeNode[]) => {
      for (const node of nodes) {
        ids.push(toStr(node.id));
        if (node.children) traverse(node.children);
      }
    };
    traverse(data);
    return ids.join("|");
  }, [data]);

  const lastSignatureRef = useRef(dataSignature);

  useEffect(() => {
    // Se a assinatura mudou, significa que carregamos uma nova árvore (ou novos dados relevantes).
    // Nesse caso, reinicializamos a seleção com o que vem na prop 'data'.
    if (dataSignature !== lastSignatureRef.current) {
      const initial = getInitialCheckedIds(data);
      setCheckedNodes(initial);
      lastSignatureRef.current = dataSignature;
    }
    // Se a assinatura for igual, ignoramos a prop 'checked' para preservar a seleção local do usuário
    // durante re-renders do pai (que poderiam resetar o estado).
  }, [dataSignature, data]);

  const allNodesMap = useMemo(() => {
    const nodes = new Map<string, TreeNode>();
    const traverse = (nodeList: TreeNode[]) => {
      for (const node of nodeList) {
        nodes.set(toStr(node.id), node);
        if (node.children) traverse(node.children);
      }
    };
    traverse(data);
    return nodes;
  }, [data]);

  const nodeParentMap = useMemo(() => {
    const map = new Map<string, TreeNode>();
    const traverse = (nodes: TreeNode[], parent?: TreeNode) => {
      for (const node of nodes) {
        if (parent) map.set(toStr(node.id), parent);
        if (node.children) traverse(node.children, node);
      }
    };
    traverse(data);
    return map;
  }, [data]);

  // Busca
  const filteredNodeIds = useMemo(() => {
    if (!searchTerm.trim()) return new Set<string>();
    const filteredIds = new Set<string>();
    const normalizedTerm = searchTerm.toLowerCase();

    const searchInTree = (
      nodeList: TreeNode[],
      parentPath: string[] = [],
    ): boolean => {
      let hasMatch = false;
      for (const node of nodeList) {
        const nodeId = toStr(node.id);
        const currentPath = [...parentPath, nodeId];
        const nodeMatches = node.label.toLowerCase().includes(normalizedTerm);
        let childMatches = false;
        if (node.children)
          childMatches = searchInTree(node.children, currentPath);

        if (nodeMatches || childMatches) {
          currentPath.forEach((id) => filteredIds.add(id));
          hasMatch = true;
        }
      }
      return hasMatch;
    };
    searchInTree(data);
    return filteredIds;
  }, [data, searchTerm]);

  useEffect(() => {
    if (searchTerm.trim() && filteredNodeIds.size > 0) {
      setExpandedNodes(new Set(filteredNodeIds));
    }
  }, [searchTerm, filteredNodeIds]);

  // --- CÁLCULO VISUAL ---
  const checkedStates = useMemo(() => {
    const states = new Map<string, CheckboxState>();

    // Lógica Visual:
    // - Checkbox Marcado (Tick): Se nó está no Set E (é folha OU todos os filhos estão check/indeterminate).
    // - Checkbox Indeterminado (Traço):
    //   1. Nó está no Set mas filhos incompletos (Sticky Parent).
    //   2. Nó não está no Set mas tem descendentes marcados.
    const computeVisuals = (node: TreeNode) => {
      const nodeId = toStr(node.id);
      const isSelfChecked = checkedNodes.has(nodeId);

      let allChildrenChecked = true;
      let someChildrenChecked = false;
      let hasIndeterminateChild = false;

      if (node.children && node.children.length > 0) {
        for (const child of node.children) {
          const childVisual = computeVisuals(child);
          if (!childVisual.checked) allChildrenChecked = false;
          if (childVisual.checked) someChildrenChecked = true;
          if (childVisual.indeterminate) hasIndeterminateChild = true;
        }
      } else {
        // Folha
        allChildrenChecked = isSelfChecked;
        someChildrenChecked = isSelfChecked;
      }

      const finalChecked =
        node.children && node.children.length > 0
          ? allChildrenChecked
          : isSelfChecked;

      // Se o próprio nó foi marcado (isSelfChecked), mas não atende aos critérios de 'checked' visual (todos os filhos),
      // então ele deve ser mostrado como Indeterminate. Isso representa a seleção da categoria.
      const isStickySelection = isSelfChecked && !finalChecked;

      const finalIndeterminate =
        !finalChecked &&
        (someChildrenChecked || hasIndeterminateChild || isStickySelection);

      const state = {
        checked: finalChecked,
        indeterminate: finalIndeterminate,
      };
      states.set(nodeId, state);
      return state;
    };

    data.forEach((node) => computeVisuals(node));
    return states;
  }, [checkedNodes, data]);

  // --- TOGGLE CHECK ---
  const handleToggleCheck = useCallback(
    (nodeId: string) => {
      if (isReadOnly) return;

      const next = new Set(checkedNodes);
      const targetNode = allNodesMap.get(nodeId);
      if (!targetNode) return;

      const currentState = checkedStates.get(nodeId);
      const isCurrentlyChecked = currentState?.checked ?? false;

      const addSubtreeToSet = (n: TreeNode) => {
        next.add(toStr(n.id));
        if (n.children) n.children.forEach(addSubtreeToSet);
      };

      const removeSubtreeFromSet = (n: TreeNode) => {
        next.delete(toStr(n.id));
        if (n.children) n.children.forEach(removeSubtreeFromSet);
      };

      if (isCurrentlyChecked) {
        // --- DESMARCAR ---
        removeSubtreeFromSet(targetNode);

        // Sticky Logic: Ao desmarcar um nó, adiciona explicitamente todos os ancestrais
        // ao Set. Isso garante que a hierarquia superior permaneça "Selecionada" (Indeterminada)
        // mesmo que o último filho seja removido.
        let curr: TreeNode | undefined = targetNode;
        while (curr) {
          const parent = nodeParentMap.get(toStr(curr.id));
          if (parent) {
            next.add(toStr(parent.id));
          }
          curr = parent;
        }
      } else {
        // --- MARCAR ---
        addSubtreeToSet(targetNode);
      }

      setCheckedNodes(next);
      if (onSelectionChange) {
        onSelectionChange(Array.from(next));
      }
    },
    [
      checkedNodes,
      allNodesMap,
      nodeParentMap,
      isReadOnly,
      checkedStates,
      onSelectionChange,
    ],
  );

  // --- CONTROLES ---
  const clearSearch = useCallback(() => setSearchTerm(""), []);

  const selectAll = useCallback(() => {
    const allIds = new Set<string>();
    const traverse = (nodes: TreeNode[]) => {
      for (const node of nodes) {
        allIds.add(toStr(node.id));
        if (node.children) traverse(node.children);
      }
    };
    traverse(data);
    setCheckedNodes(allIds);
    if (onSelectionChange) {
      onSelectionChange(Array.from(allIds));
    }
  }, [data, onSelectionChange]);

  const selectNone = useCallback(() => {
    const empty = new Set<string>();
    setCheckedNodes(empty);
    if (onSelectionChange) {
      onSelectionChange([]);
    }
  }, [onSelectionChange]);

  const handleToggleExpand = useCallback((nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  }, []);

  const allSelected =
    data.length > 0 &&
    data.every((n) => checkedStates.get(toStr(n.id))?.checked);
  const noneSelected =
    checkedNodes.size === 0 &&
    !data.some((n) => checkedStates.get(toStr(n.id))?.indeterminate);

  return (
    <div
      className={`bg-white border border-gray-200 rounded-md flex flex-col h-full ${className}`}
    >
      {/* Header */}
      <div className="flex-none border-b border-gray-200 bg-gray-50/50">
        {searchable && (
          <div className="p-2 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-8 h-9 text-sm"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}

        {showSelectAllButtons && !isReadOnly && (
          <div className="p-2 flex gap-2 justify-between items-center bg-white">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={selectAll}
                disabled={allSelected || isLoading}
                className="text-xs flex items-center gap-1 px-2 py-1 text-blue-700 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 disabled:opacity-50 transition-colors"
              >
                <CheckSquare className="w-3 h-3" />
                Todos
              </button>
              <button
                type="button"
                onClick={selectNone}
                disabled={noneSelected || isLoading}
                className="text-xs flex items-center gap-1 px-2 py-1 text-gray-700 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 disabled:opacity-50 transition-colors"
              >
                <Square className="w-3 h-3" />
                Nenhum
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Lista */}
      <div className="flex-1 p-2 relative overflow-hidden min-h-[200px]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
              <span className="text-xs text-gray-500">Carregando...</span>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto pr-1 custom-scrollbar">
            {data.length > 0 ? (
              data.map((node) => (
                <TreeNodeComponent
                  key={toStr(node.id)}
                  node={node}
                  level={0}
                  isReadOnly={isReadOnly}
                  expandedNodes={expandedNodes}
                  checkedStates={checkedStates}
                  onToggleExpand={handleToggleExpand}
                  onToggleCheck={handleToggleCheck}
                  searchTerm={searchTerm}
                  filteredNodeIds={searchTerm ? filteredNodeIds : undefined}
                />
              ))
            ) : (
              <div className="py-8 text-center text-gray-400 text-sm">
                Nenhum item encontrado
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
