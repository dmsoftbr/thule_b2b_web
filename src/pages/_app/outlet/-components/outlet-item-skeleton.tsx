import { Skeleton } from "@/components/ui/skeleton";

export const OutletItemSkeleton = () => {
  return (
    <div className="flex flex-col w-full border">
      <Skeleton className="h-10" />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </div>
  );
};
