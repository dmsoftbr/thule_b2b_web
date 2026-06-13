import { Skeleton } from "@/components/ui/skeleton";

// Placeholder no formato do MlaPendenciaCard, exibido enquanto as pendências carregam.
export function MlaPendenciaSkeleton() {
  return (
    <div className="rounded-md border bg-white p-3 shadow-sm">
      <div className="flex items-start gap-3">
        <Skeleton className="mt-1 size-4 rounded" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
}
