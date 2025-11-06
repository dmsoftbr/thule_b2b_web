import { Skeleton } from "@/components/ui/skeleton";

export const OutletItemSkeleton = () => {
  return (
    <div className="flex gap-x-4 w-full items-center justify-center">
      <Skeleton className="h-[376px] w-[340px] rounded-lg bg-neutral-200" />
      <Skeleton className="h-[376px] w-[340px] rounded-lg bg-neutral-200" />
      <Skeleton className="h-[376px] w-[340px] rounded-lg bg-neutral-200" />
    </div>
  );
};
