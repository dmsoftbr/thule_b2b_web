import React, { useState, useCallback, useMemo, memo, useEffect } from "react";
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

// Tipos
export interface TreeNode {
  id: string;
  label: string;
  checked?: boolean; // true = checked, false = unchecked, undefined = indeterminate
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

// Componente de Checkbox customizado e otimizado
const OptimizedCheckbox = memo(
  ({
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
        disabled={isReadOnly}
        onClick={(e) => {
          e.stopPropagation();
          onChange();
        }}
        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
          checked
            ? "bg-blue-600 border-blue-600"
            : indeterminate
              ? "bg-blue-600 border-blue-600"
              : "bg-white border-gray-300 hover:border-gray-400"
        }`}
      >
        {isReadOnly}
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
  }
);

// Componente do nó - MEMOIZADO
const TreeNodeComponent = memo<TreeNodeProps>(
  ({
    node,
    level,
    expandedNodes,
    checkedStates,
    onToggleExpand,
    onToggleCheck,
    searchTerm,
    filteredNodeIds,
    isReadOnly = false,
  }) => {
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node.id);
    const checkboxState = checkedStates.get(node.id) || {
      checked: false,
      indeterminate: false,
    };
    const paddingLeft = level * 20;

    const shouldShow = !filteredNodeIds || filteredNodeIds.has(node.id);

    // Memoizar função de highlight
    const highlightedLabel = useMemo(() => {
      if (!searchTerm) return node.label;

      const parts = node.label.split(new RegExp(`(${searchTerm})`, "gi"));
      return (
        <>
          {parts.map((part, i) =>
            part.toLowerCase() === searchTerm.toLowerCase() ? (
              <span key={i} className="bg-yellow-200 font-semibold">
                {part}
              </span>
            ) : (
              part
            )
          )}
        </>
      );
    }, [node.label, searchTerm]);

    const handleCheckboxChange = useCallback(() => {
      onToggleCheck(node.id);
    }, [node.id, onToggleCheck]);

    const handleExpandToggle = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        if (hasChildren) {
          onToggleExpand(node.id);
        }
      },
      [hasChildren, node.id, onToggleExpand]
    );

    if (!shouldShow) return null;

    return (
      <div className="select-none">
        <div
          className="flex items-center py-1 px-2 hover:bg-gray-50 rounded-sm group"
          style={{ paddingLeft: `${paddingLeft + 8}px` }}
        >
          <button
            onClick={handleExpandToggle}
            className={`w-4 h-4 flex items-center justify-center mr-1 rounded-sm hover:bg-gray-200 ${
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

          <span className="text-sm text-gray-700 flex-1 truncate">
            {highlightedLabel}
          </span>
        </div>

        {hasChildren && isExpanded && (
          <div>
            {node.children!.map((childNode) => (
              <TreeNodeComponent
                key={childNode.id}
                node={childNode}
                level={level + 1}
                expandedNodes={expandedNodes}
                checkedStates={checkedStates}
                onToggleExpand={onToggleExpand}
                onToggleCheck={onToggleCheck}
                searchTerm={searchTerm}
                filteredNodeIds={filteredNodeIds}
              />
            ))}
          </div>
        )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Comparação customizada para evitar re-renders
    return (
      prevProps.node.id === nextProps.node.id &&
      prevProps.level === nextProps.level &&
      prevProps.expandedNodes === nextProps.expandedNodes &&
      prevProps.checkedStates === nextProps.checkedStates &&
      prevProps.searchTerm === nextProps.searchTerm &&
      prevProps.filteredNodeIds === nextProps.filteredNodeIds
    );
  }
);

// Funções auxiliares otimizadas
const getAllNodeIds = (
  node: TreeNode,
  result: Set<string> = new Set()
): Set<string> => {
  result.add(node.id);
  if (node.children) {
    for (const child of node.children) {
      getAllNodeIds(child, result);
    }
  }
  return result;
};

// Função para extrair IDs marcados inicialmente da árvore
const getInitialCheckedIds = (nodes: TreeNode[]): Set<string> => {
  const checkedIds = new Set<string>();

  const traverse = (nodeList: TreeNode[]) => {
    for (const node of nodeList) {
      // Se o nó está explicitamente marcado como checked
      if (node.checked === true) {
        checkedIds.add(node.id);
      }

      if (node.children) {
        traverse(node.children);
      }
    }
  };

  traverse(nodes);
  return checkedIds;
};

// Componente principal
export const TreeView: React.FC<TreeViewProps> = ({
  data,
  onSelectionChange,
  className = "",
  searchable = true,
  isReadOnly = false,
  searchPlaceholder = "Buscar...",
  showSelectAllButtons = true,
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Inicializar checkedNodes com base na propriedade 'checked' dos nós
  const [checkedNodes, setCheckedNodes] = useState<Set<string>>(() => {
    return getInitialCheckedIds(data);
  });

  // Atualizar checkedNodes quando data mudar
  useEffect(() => {
    setCheckedNodes(getInitialCheckedIds(data));
  }, [data]);

  // Memoizar mapa de todos os nós
  const allNodesMap = useMemo(() => {
    const nodes = new Map<string, TreeNode>();
    const traverse = (nodeList: TreeNode[]) => {
      for (const node of nodeList) {
        nodes.set(node.id, node);
        if (node.children) {
          traverse(node.children);
        }
      }
    };
    traverse(data);
    return nodes;
  }, [data]);

  // Busca otimizada com debounce implícito via useMemo
  const filteredNodeIds = useMemo(() => {
    if (!searchTerm.trim()) return new Set<string>();

    const filteredIds = new Set<string>();
    const normalizedTerm = searchTerm.toLowerCase();

    const searchInTree = (
      nodeList: TreeNode[],
      parentPath: string[] = []
    ): boolean => {
      let hasMatch = false;

      for (const node of nodeList) {
        const currentPath = [...parentPath, node.id];
        const nodeMatches = node.label.toLowerCase().includes(normalizedTerm);
        let childMatches = false;

        if (node.children) {
          childMatches = searchInTree(node.children, currentPath);
        }

        if (nodeMatches || childMatches) {
          for (const id of currentPath) {
            filteredIds.add(id);
          }
          hasMatch = true;
        }
      }

      return hasMatch;
    };

    searchInTree(data);
    return filteredIds;
  }, [data, searchTerm]);

  // Auto-expandir resultados de busca
  React.useEffect(() => {
    if (searchTerm.trim() && filteredNodeIds.size > 0) {
      setExpandedNodes(new Set(filteredNodeIds));
    }
  }, [searchTerm, filteredNodeIds]);

  // Calcular estados dos checkboxes - OTIMIZADO
  const checkedStates = useMemo(() => {
    const states = new Map<string, CheckboxState>();

    const calculateState = (node: TreeNode): CheckboxState => {
      if (!node.children || node.children.length === 0) {
        // Nó folha - verifica no Set de checkedNodes
        const isChecked = checkedNodes.has(node.id);
        const state = { checked: isChecked, indeterminate: false };
        states.set(node.id, state);
        return state;
      }

      // Nó com filhos
      let checkedCount = 0;
      let indeterminateCount = 0;
      const total = node.children.length;

      for (const child of node.children) {
        const childState = calculateState(child);
        if (childState.checked) checkedCount++;
        if (childState.indeterminate) indeterminateCount++;
      }

      // Se a propriedade checked do nó está definida explicitamente, usa ela
      // Caso contrário, calcula baseado nos filhos
      let state: CheckboxState;

      if (checkedCount === total) {
        state = { checked: true, indeterminate: false };
      } else if (checkedCount > 0 || indeterminateCount > 0) {
        state = { checked: false, indeterminate: true };
      } else {
        state = { checked: false, indeterminate: false };
      }

      states.set(node.id, state);
      return state;
    };

    for (const node of data) {
      calculateState(node);
    }

    return states;
  }, [checkedNodes, data]);

  // Toggle expand otimizado
  const handleToggleExpand = useCallback((nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  // Toggle check MUITO otimizado
  const handleToggleCheck = useCallback(
    (nodeId: string) => {
      setCheckedNodes((prev) => {
        const node = allNodesMap.get(nodeId);
        if (!node) return prev;

        const next = new Set(prev);
        const isCurrentlyChecked = next.has(nodeId);

        // Coletar IDs de forma otimizada
        const allIds = getAllNodeIds(node);

        if (isCurrentlyChecked) {
          for (const id of allIds) {
            next.delete(id);
          }
        } else {
          for (const id of allIds) {
            next.add(id);
          }
        }

        return next;
      });
    },
    [allNodesMap]
  );

  // Notificar mudanças
  React.useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(Array.from(checkedNodes));
    }
  }, [checkedNodes, onSelectionChange]);

  const clearSearch = useCallback(() => setSearchTerm(""), []);

  const selectAll = useCallback(() => {
    setCheckedNodes(new Set(allNodesMap.keys()));
  }, [allNodesMap]);

  const selectNone = useCallback(() => {
    setCheckedNodes(new Set());
  }, []);

  const allSelected =
    allNodesMap.size > 0 && checkedNodes.size === allNodesMap.size;
  const noneSelected = checkedNodes.size === 0;

  return (
    <div className={`bg-white border border-gray-200 rounded-md ${className}`}>
      <div className="border-b border-gray-200">
        {searchable && (
          <div className="p-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {searchTerm && (
              <div className="mt-2 text-xs text-gray-500">
                {filteredNodeIds.size > 0
                  ? `${filteredNodeIds.size} resultado(s)`
                  : "Nenhum resultado"}
              </div>
            )}
          </div>
        )}

        {showSelectAllButtons && (
          <div className="p-3 flex gap-2">
            <button
              onClick={selectAll}
              disabled={allSelected}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CheckSquare className="w-4 h-4" />
              Marcar Tudo
            </button>
            <button
              onClick={selectNone}
              disabled={noneSelected}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Square className="w-4 h-4" />
              Desmarcar Tudo
            </button>
            <div className="flex items-center ml-auto text-xs text-gray-500">
              {checkedNodes.size} de {allNodesMap.size} selecionados
            </div>
          </div>
        )}
      </div>

      <div className="p-2">
        <div className="max-h-96 overflow-y-auto">
          {data.map((node) => (
            <TreeNodeComponent
              key={node.id}
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
          ))}
        </div>
      </div>
    </div>
  );
};
