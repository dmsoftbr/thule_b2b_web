Crie um componente reutilizável de Pivot Table para React/TypeScript, com visual e comportamento inspirado em Excel/Power BI.

Contexto:

- Projeto React com TypeScript.
- Usar componentes existentes do projeto quando possível.
- Priorizar arquitetura limpa, reutilização e facilidade de manutenção.
- O componente deve ser genérico e aceitar qualquer dataset tabular.

Objetivo:
Criar um componente chamado `PivotTable` que permita ao usuário montar uma tabela dinâmica arrastando ou selecionando campos para:

- Linhas
- Colunas
- Valores
- Filtros

Funcionalidades obrigatórias:

1. Receber dados via props:
   - `data: T[]`
   - `fields: PivotField[]`
   - `initialConfig?: PivotConfig`
   - `onConfigChange?: (config: PivotConfig) => void`

2. Permitir configurar:
   - Campos de linha
   - Campos de coluna
   - Campos de valor
   - Campos de filtro

3. Agregações para valores:
   - Soma
   - Média
   - Contagem
   - Mínimo
   - Máximo

4. Interface:
   - Painel lateral com lista de campos disponíveis
   - Áreas para Linhas, Colunas, Valores e Filtros
   - Tabela renderizada com totais e subtotais
   - Layout responsivo
   - Visual limpo, moderno e parecido com ferramentas BI

5. Tipagem:
   - Criar tipos como:
     - `PivotField`
     - `PivotConfig`
     - `PivotValueConfig`
     - `AggregationType`

6. Requisitos técnicos:
   - Separar lógica de cálculo da UI.
   - Criar função utilitária para gerar a matriz da pivot table.
   - Evitar acoplamento com dados específicos.
   - Usar memoização com `useMemo`.
   - Garantir boa performance para datasets médios.
   - Código bem organizado em arquivos separados.

7. Entregar:
   - Componente `PivotTable`
   - Tipos TypeScript
   - Hook ou utilitário de cálculo da pivot
   - Exemplo de uso com dados fictícios
   - Comentários apenas onde forem úteis

Sugestão de estrutura:

src/components/pivot-table/
PivotTable.tsx
PivotTableBuilder.tsx
PivotTableGrid.tsx
PivotTableFieldList.tsx
PivotTableDropZone.tsx
pivot.types.ts
pivot.utils.ts
index.ts

Modelo conceitual dos tipos:

type AggregationType = "sum" | "avg" | "count" | "min" | "max";

type PivotField<T = any> = {
key: keyof T | string;
label: string;
type: "string" | "number" | "date" | "boolean";
};

type PivotValueConfig = {
field: string;
aggregation: AggregationType;
label?: string;
};

type PivotConfig = {
rows: string[];
columns: string[];
values: PivotValueConfig[];
filters: Record<string, any[]>;
};

Importante:

- Não faça apenas uma tabela HTML simples.
- O componente precisa permitir montagem dinâmica da pivot pelo usuário.
- A lógica da pivot deve funcionar mesmo sem a interface.
- Evite bibliotecas pesadas, a menos que já existam no projeto.
- Caso o projeto use shadcn/ui, use Card, Button, Select, Badge, DropdownMenu e ScrollArea.
- Caso o projeto use Tailwind, estilize com classes Tailwind.
- Caso não exista drag-and-drop instalado, implemente primeiro com seleção/botões simples e deixe a arquitetura preparada para DnD depois.

Antes de codar:

1. Inspecione o projeto.
2. Identifique o padrão de componentes.
3. Veja se existe shadcn/ui, Tailwind e bibliotecas de tabela.
4. Depois implemente seguindo o padrão existente.

Após implementar:

- Rode typecheck/build.
- Corrija erros.
- Mostre um exemplo de uso do componente.

Faça uma primeira versão MVP funcional, simples e extensível. Não tente copiar 100% do Excel; priorize linhas, colunas, valores, filtros, totais e boa organização do código.
