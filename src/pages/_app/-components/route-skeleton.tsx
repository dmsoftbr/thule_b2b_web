import { Skeleton } from "@/components/ui/skeleton";

/**
 * Moldura que imita o `AppPageHeader`: card branco com borda/sombra e a barra
 * de título cinza no topo. Usada pelas variantes de skeleton das telas que
 * envolvem o conteúdo nesse cabeçalho (dashboards e listagens).
 */
const PageHeaderShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="m-2 w-full overflow-hidden rounded border bg-white shadow">
      <div className="flex items-center border-b border-neutral-300 bg-neutral-200 px-3 py-2">
        <Skeleton className="h-5 w-48 bg-neutral-300" />
      </div>
      {children}
    </div>
  );
};

/**
 * Skeleton dedicado às telas de Dashboard (`/_app/dashboard`, `/_app/dashboards/*`).
 * Imita a barra de filtros, a faixa de 4 cards de KPI e os 2 grandes blocos de
 * gráfico (Recharts) — bem mais fiel que o genérico baseado em tabela.
 */
export const DashboardSkeleton = () => {
  return (
    <PageHeaderShell>
      <div className="space-y-2 p-4">
        {/* Barra de filtros: mês / ano / representantes + ação */}
        <div className="flex flex-wrap items-end gap-2">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-10 bg-neutral-200" />
            <Skeleton className="h-9 w-32 bg-neutral-200" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-10 bg-neutral-200" />
            <Skeleton className="h-9 w-32 bg-neutral-200" />
          </div>
          <div className="flex flex-1 flex-col gap-1">
            <Skeleton className="h-3 w-24 bg-neutral-200" />
            <Skeleton className="h-9 w-full bg-neutral-200" />
          </div>
          <Skeleton className="h-9 w-28 bg-neutral-300" />
        </div>

        {/* Painel de indicadores */}
        <div className="flex flex-col gap-4 rounded-lg border bg-slate-100 p-2">
          {/* 4 cards de KPI */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col justify-center gap-2 rounded-lg border bg-white p-6 shadow"
              >
                <Skeleton className="h-4 w-32 bg-neutral-200" />
                <Skeleton className="h-8 w-28 bg-neutral-300" />
                <Skeleton className="h-3 w-16 bg-neutral-200" />
              </div>
            ))}
          </div>

          {/* 2 blocos de gráfico */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col gap-4 rounded-lg bg-white p-6 shadow"
              >
                <Skeleton className="h-4 w-44 bg-neutral-200" />
                <Skeleton className="h-56 w-full bg-neutral-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageHeaderShell>
  );
};

/**
 * Skeleton dedicado às listagens com `ServerTable` (ex.: Pedidos de Venda).
 * Imita o cabeçalho de página, a toolbar (busca + filtros + botão "Adicionar")
 * e a tabela com várias linhas — mais fiel à tela real que o genérico.
 */
export const TableSkeleton = () => {
  return (
    <PageHeaderShell>
      <div className="p-2">
        <div className="rounded-md border bg-white p-3">
          {/* Toolbar: campo de busca + seletor de campo + botão Adicionar */}
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <Skeleton className="h-9 w-72 bg-neutral-200" />
            <Skeleton className="h-9 w-40 bg-neutral-200" />
            <Skeleton className="h-9 w-9 bg-neutral-200" />
            <Skeleton className="ml-auto h-9 w-28 bg-neutral-300" />
          </div>

          {/* Cabeçalho da tabela */}
          <div className="mb-2 grid grid-cols-12 gap-4 border-b pb-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton
                key={i}
                className="col-span-2 h-4 bg-neutral-300"
              />
            ))}
          </div>

          {/* Linhas da tabela */}
          <div className="flex flex-col">
            {Array.from({ length: 10 }).map((_, row) => (
              <div
                key={row}
                className="grid grid-cols-12 items-center gap-4 border-b py-3 last:border-b-0"
              >
                {Array.from({ length: 6 }).map((_, col) => (
                  <Skeleton
                    key={col}
                    className="col-span-2 h-4 bg-neutral-200"
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Rodapé de paginação */}
          <div className="mt-3 flex items-center justify-between">
            <Skeleton className="h-4 w-40 bg-neutral-200" />
            <div className="flex gap-2">
              <Skeleton className="h-8 w-8 bg-neutral-200" />
              <Skeleton className="h-8 w-8 bg-neutral-200" />
              <Skeleton className="h-8 w-8 bg-neutral-200" />
            </div>
          </div>
        </div>
      </div>
    </PageHeaderShell>
  );
};

/**
 * Skeleton genérico para a área de conteúdo (<main>) durante transições de
 * rota. NÃO repete sidebar/header — eles permanecem montados durante a
 * navegação. Serve tanto para telas de tabela (pedidos) quanto dashboards.
 */
const RouteSkeleton = () => {
  return (
    <div className="w-full p-6">
      {/* Cabeçalho da página: título + ação primária */}
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-56 bg-neutral-300" />
          <Skeleton className="h-4 w-72 bg-neutral-200" />
        </div>
        <Skeleton className="h-9 w-32 bg-neutral-300" />
      </div>

      {/* Linha de cards/indicadores (dashboards) */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-lg border bg-white p-4 shadow-sm"
          >
            <Skeleton className="h-4 w-24 bg-neutral-200" />
            <Skeleton className="h-8 w-32 bg-neutral-300" />
            <Skeleton className="h-3 w-20 bg-neutral-200" />
          </div>
        ))}
      </div>

      {/* Bloco principal: tabela/listagem */}
      <div className="rounded-lg border bg-white p-4 shadow-sm">
        {/* Barra de filtros */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <Skeleton className="h-9 w-64 bg-neutral-200" />
          <Skeleton className="h-9 w-36 bg-neutral-200" />
          <Skeleton className="ml-auto h-9 w-24 bg-neutral-300" />
        </div>

        {/* Cabeçalho da tabela */}
        <div className="mb-2 grid grid-cols-12 gap-4 border-b pb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              className="col-span-2 h-4 bg-neutral-300 last:col-span-4"
            />
          ))}
        </div>

        {/* Linhas da tabela */}
        <div className="flex flex-col">
          {Array.from({ length: 8 }).map((_, row) => (
            <div
              key={row}
              className="grid grid-cols-12 items-center gap-4 border-b py-3 last:border-b-0"
            >
              {Array.from({ length: 5 }).map((_, col) => (
                <Skeleton
                  key={col}
                  className="col-span-2 h-4 bg-neutral-200 last:col-span-4"
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RouteSkeleton;
