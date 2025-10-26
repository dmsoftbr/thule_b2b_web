import React, { useState, useCallback, useMemo } from "react";
import {
  ChevronRight,
  ChevronDown,
  Search,
  X,
  CheckSquare,
  Square,
  FolderOpenIcon,
  FolderIcon,
  BoxesIcon,
} from "lucide-react";
import { Checkbox } from "../ui/checkbox";

// Tipos para o TreeView
export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
  data?: any; // dados adicionais do banco
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
}

// Componente do nó individual
export const TreeNodeComponent: React.FC<TreeNodeProps> = ({
  node,
  level,
  expandedNodes,
  checkedStates,
  onToggleExpand,
  onToggleCheck,
  searchTerm,
  filteredNodeIds,
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(node.id);
  const checkboxState = checkedStates.get(node.id) || {
    checked: false,
    indeterminate: false,
  };
  const paddingLeft = level * 20;

  // Se há busca ativa, verificar se este nó ou seus filhos devem ser mostrados
  const shouldShow = !filteredNodeIds || filteredNodeIds.has(node.id);

  // Destacar texto da busca
  const highlightText = (text: string, highlight: string) => {
    if (!highlight) return text;

    const parts = text.split(new RegExp(`(${highlight})`, "gi"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <span key={i} className="bg-yellow-200 font-semibold">
              {part}
            </span>
          ) : (
            part
          )
        )}
      </>
    );
  };

  const handleCheckboxChange = useCallback(() => {
    onToggleCheck(node.id);
  }, [node.id, onToggleCheck]);

  const handleExpandToggle = useCallback(() => {
    if (hasChildren) {
      onToggleExpand(node.id);
    }
  }, [hasChildren, node.id, onToggleExpand]);

  if (!shouldShow) return null;

  return (
    <div className="select-none">
      <div
        className="flex items-center py-1 px-2 hover:bg-gray-50 rounded-sm cursor-pointer group"
        style={{ paddingLeft: `${paddingLeft + 8}px` }}
      >
        {/* Botão de expansão */}
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

        {/* Checkbox */}
        <div className="relative mr-2">
          <Checkbox
            checked={checkboxState.checked}
            onCheckedChange={handleCheckboxChange}
            ref={(input) => {
              if (input) {
                // If indeterminate, set data-state to "indeterminate", else leave as is
                if (checkboxState.indeterminate) {
                  input.setAttribute("data-state", "indeterminate");
                } else {
                  input.setAttribute(
                    "data-state",
                    checkboxState.checked ? "checked" : "unchecked"
                  );
                }
              }
            }}
          />
        </div>

        {/* Ícone */}
        <div className="mr-2">
          {hasChildren ? (
            isExpanded ? (
              <FolderOpenIcon className="w-4 h-4 fill-yellow-300 stroke-yellow-500" />
            ) : (
              <FolderIcon className="w-4 h-4 fill-yellow-300 stroke-yellow-500" />
            )
          ) : (
            <BoxesIcon className="w-4 h-4 text-gray-500 stroke-[1.5px]" />
          )}
        </div>

        {/* Label com destaque de busca */}
        <span className="text-sm text-gray-700 flex-1 truncate">
          {highlightText(node.label, searchTerm || "")}
        </span>
      </div>

      {/* Nós filhos */}
      {hasChildren && isExpanded && (
        <div className="ml-2">
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
};

// Função para coletar todos os IDs de uma subárvore
const getAllNodeIds = (node: TreeNode): string[] => {
  const ids = [node.id];
  if (node.children) {
    node.children.forEach((child) => {
      ids.push(...getAllNodeIds(child));
    });
  }
  return ids;
};

// Função para encontrar o nó pai
const findParentNode = (
  nodes: TreeNode[],
  targetId: string,
  parent?: TreeNode
): TreeNode | null => {
  for (const node of nodes) {
    if (node.children?.some((child) => child.id === targetId)) {
      return node;
    }
    if (node.children) {
      const found = findParentNode(node.children, targetId, node);
      if (found) return found;
    }
  }
  return parent || null;
};

// Componente principal TreeView
export const TreeView: React.FC<TreeViewProps> = ({
  data,
  onSelectionChange,
  className = "",
  searchable = true,
  searchPlaceholder = "Buscar...",
  showSelectAllButtons = true,
}) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [checkedNodes, setCheckedNodes] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Função para encontrar nós que correspondem à busca e seus pais
  const getFilteredNodes = useCallback(
    (nodes: TreeNode[], term: string): Set<string> => {
      if (!term.trim()) return new Set();

      const filteredIds = new Set<string>();
      const normalizedTerm = term.toLowerCase();

      const searchInTree = (
        nodeList: TreeNode[],
        parentPath: string[] = []
      ): boolean => {
        let hasMatchingChild = false;

        for (const node of nodeList) {
          const currentPath = [...parentPath, node.id];
          let nodeMatches = node.label.toLowerCase().includes(normalizedTerm);
          let childMatches = false;

          if (node.children) {
            childMatches = searchInTree(node.children, currentPath);
          }

          if (nodeMatches || childMatches) {
            // Adicionar todos os nós no caminho até a raiz
            currentPath.forEach((id) => filteredIds.add(id));
            hasMatchingChild = true;
          }
        }

        return hasMatchingChild;
      };

      searchInTree(nodes);
      return filteredIds;
    },
    []
  );

  // Nós filtrados pela busca
  const filteredNodeIds = useMemo(() => {
    return getFilteredNodes(data, searchTerm);
  }, [data, searchTerm, getFilteredNodes]);

  // Auto-expandir nós que contêm resultados da busca
  React.useEffect(() => {
    if (searchTerm.trim() && filteredNodeIds.size > 0) {
      setExpandedNodes((prev) => {
        const newExpanded = new Set(prev);
        filteredNodeIds.forEach((id) => {
          const node = allNodes.get(id);
          if (node?.children && node.children.length > 0) {
            newExpanded.add(id);
          }
        });
        return newExpanded;
      });
    }
  }, [searchTerm, filteredNodeIds]);

  // Memoizar todos os nós para otimização
  const allNodes = useMemo(() => {
    const nodes = new Map<string, TreeNode>();
    const traverse = (nodeList: TreeNode[]) => {
      nodeList.forEach((node) => {
        nodes.set(node.id, node);
        if (node.children) {
          traverse(node.children);
        }
      });
    };
    traverse(data);
    return nodes;
  }, [data]);

  // Calcular estados dos checkboxes
  const checkedStates = useMemo(() => {
    const states = new Map<string, CheckboxState>();

    const calculateState = (node: TreeNode): CheckboxState => {
      if (!node.children || node.children.length === 0) {
        // Nó folha - verifica diretamente no Set
        const isChecked = checkedNodes.has(node.id);
        const state = { checked: isChecked, indeterminate: false };
        states.set(node.id, state);
        return state;
      }

      // Nó com filhos
      const childStates = node.children.map((child) => calculateState(child));
      const checkedChildren = childStates.filter(
        (state) => state.checked
      ).length;
      const indeterminateChildren = childStates.filter(
        (state) => state.indeterminate
      ).length;

      let checked = false;
      let indeterminate = false;

      if (checkedChildren === childStates.length) {
        // Todos os filhos estão marcados
        checked = true;
      } else if (checkedChildren > 0 || indeterminateChildren > 0) {
        // Alguns filhos estão marcados ou indeterminados
        indeterminate = true;
      }

      const state = { checked, indeterminate };
      states.set(node.id, state);
      return state;
    };

    data.forEach((node) => calculateState(node));
    return states;
  }, [checkedNodes, data]);

  // Função para alternar expansão
  const handleToggleExpand = useCallback((nodeId: string) => {
    setExpandedNodes((prev) => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(nodeId)) {
        newExpanded.delete(nodeId);
      } else {
        newExpanded.add(nodeId);
      }
      return newExpanded;
    });
  }, []);

  // Função para alternar checkbox
  const handleToggleCheck = useCallback(
    (nodeId: string) => {
      setCheckedNodes((prev) => {
        const newChecked = new Set(prev);
        const node = allNodes.get(nodeId);

        if (!node) return prev;

        // Verificar se o nó está atualmente marcado
        const isCurrentlyChecked = newChecked.has(nodeId);

        if (isCurrentlyChecked) {
          // Desmarcar o nó e todos os filhos
          const allDescendantIds = getAllNodeIds(node);
          allDescendantIds.forEach((id) => newChecked.delete(id));
        } else {
          // Marcar o nó e todos os filhos
          const allDescendantIds = getAllNodeIds(node);
          allDescendantIds.forEach((id) => newChecked.add(id));
        }

        return newChecked;
      });
    },
    [allNodes]
  );

  // Notificar mudanças de seleção
  React.useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(Array.from(checkedNodes));
    }
  }, [checkedNodes, onSelectionChange]);

  // Limpar busca
  const clearSearch = useCallback(() => {
    setSearchTerm("");
  }, []);

  // Marcar todos os nós
  const selectAll = useCallback(() => {
    const allIds = new Set<string>();
    const traverse = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        allIds.add(node.id);
        if (node.children) {
          traverse(node.children);
        }
      });
    };
    traverse(data);
    setCheckedNodes(allIds);
  }, [data]);

  // Desmarcar todos os nós
  const selectNone = useCallback(() => {
    setCheckedNodes(new Set());
  }, []);

  // Verificar se todos estão selecionados
  const allSelected = useMemo(() => {
    const totalNodes = allNodes.size;
    return totalNodes > 0 && checkedNodes.size === totalNodes;
  }, [checkedNodes.size, allNodes.size]);

  // Verificar se nenhum está selecionado
  const noneSelected = useMemo(() => {
    return checkedNodes.size === 0;
  }, [checkedNodes.size]);

  return (
    <div className={`bg-white border border-gray-200 rounded-md ${className}`}>
      {/* Barra superior com busca e botões */}
      <div className="border-b border-gray-200">
        {/* Campo de busca */}
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
                  ? `${filteredNodeIds.size} resultado(s) encontrado(s)`
                  : "Nenhum resultado encontrado"}
              </div>
            )}
          </div>
        )}

        {/* Botões de seleção */}
        {showSelectAllButtons && (
          <div className="p-3 flex gap-2">
            <button
              onClick={selectAll}
              disabled={allSelected}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <CheckSquare className="w-4 h-4" />
              Marcar Tudo
            </button>
            <button
              onClick={selectNone}
              disabled={noneSelected}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-md hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Square className="w-4 h-4" />
              Desmarcar Tudo
            </button>
            <div className="flex items-center ml-auto text-xs text-gray-500">
              {checkedNodes.size} de {allNodes.size} selecionados
            </div>
          </div>
        )}
      </div>

      {/* Árvore */}
      <div className="p-2">
        <div className="max-h-96 overflow-y-auto">
          {data.map((node) => (
            <TreeNodeComponent
              key={node.id}
              node={node}
              level={0}
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
