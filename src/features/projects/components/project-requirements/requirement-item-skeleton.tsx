import { Skeleton } from "@/components/ui/skeleton";

export const RequirementItemSkeleton = () => {
  return (
    <div className="flex items-start gap-3 rounded-lg border p-3 text-left text-sm mb-2">
      <Skeleton className="h-8 w-8 rounded-md" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-10" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-3 w-4" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      </div>
    </div>
  );
};
