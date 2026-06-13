import { Skeleton } from "@/components/ui/skeleton";
import { Logo } from "@/components/ui/logo";
import logoThule from "@/assets/images/thule_logo.png";
import RouteSkeleton from "./route-skeleton";

// Larguras variadas para as linhas de menu (Tailwind, sem estilo inline).
const MENU_ITEM_WIDTHS = [
  "w-3/4",
  "w-1/2",
  "w-2/3",
  "w-3/5",
  "w-4/5",
  "w-1/2",
  "w-2/3",
  "w-3/4",
];

/**
 * Esqueleto FIEL do shell autenticado, exibido enquanto a sessão de auth
 * resolve (F5). Imita sidebar escura + header branco + conteúdo cinza, para
 * evitar o flash de boilerplate antigo. Não usa estilos inline; só Tailwind.
 */
const AppSkeleton = () => {
  return (
    <div className="flex min-h-svh w-full">
      {/* Sidebar escura — mesma largura (16rem) e cores do AppSideBar */}
      <aside className="hidden h-svh w-64 shrink-0 flex-col bg-zinc-800 md:flex">
        {/* Header da sidebar: logo Thule real */}
        <div className="flex min-h-[64px] items-center justify-start border-b border-b-zinc-600 pl-6">
          <img
            className="max-h-[30px] w-auto"
            src={logoThule}
            alt="Thule Sweden"
          />
        </div>

        {/* Itens de menu em skeleton (tons que contrastam no fundo escuro) */}
        <div className="flex flex-1 flex-col gap-2 px-3 py-4">
          {MENU_ITEM_WIDTHS.map((width, i) => (
            <div key={i} className="flex items-center gap-3 px-2 py-2">
              <Skeleton className="size-5 shrink-0 rounded-md bg-zinc-700" />
              <Skeleton className={`h-4 bg-zinc-700 ${width}`} />
            </div>
          ))}
        </div>

        {/* Footer da sidebar: marca B2B */}
        <div className="flex min-h-20 items-center justify-center border-t border-t-zinc-600 px-4">
          <Logo inverse />
        </div>
      </aside>

      {/* Coluna principal */}
      <div className="flex w-full flex-col">
        {/* Header branco h-16 */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 shadow-md">
          <Skeleton className="size-7 bg-neutral-300" />
          <div className="flex flex-1 items-center justify-between">
            <Skeleton className="h-8 w-40 bg-neutral-200" />
            <div className="flex items-center gap-x-10">
              <Skeleton className="size-8 rounded-full bg-neutral-200" />
              <Skeleton className="size-9 rounded-full bg-neutral-300" />
            </div>
          </div>
        </header>

        {/* Conteúdo cinza — reaproveita o skeleton de rota */}
        <main className="flex w-full flex-1 bg-neutral-100">
          <RouteSkeleton />
        </main>
      </div>
    </div>
  );
};

export default AppSkeleton;
