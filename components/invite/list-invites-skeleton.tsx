// components/list-invites-skeleton.tsx
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "../ui/card";

export function ListInvitesSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[...Array(3)].map((_, i) => (
        <Card key={i} className="group py-4">
          <CardContent className="p-0">
            <div className="flex items-center gap-6 py-4 px-5">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
