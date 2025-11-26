// components/invites-header-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";

export function InvitesHeaderSkeleton() {
  return (
    <div className="mb-8 sm:mb-10">
      <div className="flex items-end justify-between mb-3">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-5 w-48" />
    </div>
  );
}
