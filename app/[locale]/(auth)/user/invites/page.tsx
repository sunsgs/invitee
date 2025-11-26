// (auth)/user/invites/page.tsx
import { InvitesHeader } from "@/components/invite/invites-header";
import { InvitesHeaderSkeleton } from "@/components/invite/invites-header-skeleton";
import { ListInvitesSkeleton } from "@/components/invite/list-invites-skeleton";
import ListInvites from "@/components/list-invites";
import { auth } from "@/lib/auth";
import { getUserInvites } from "@/lib/invites";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const MAX_INVITES = Number(process.env.NEXT_PUBLIC_MAX_INVITES);

async function InvitesContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    redirect("/login");
  }

  const invites = await getUserInvites(session.user.id);
  const canCreate = invites.length < MAX_INVITES;

  return (
    <>
      <InvitesHeader
        count={invites.length}
        maxInvites={MAX_INVITES}
        canCreate={canCreate}
      />
      <ListInvites data={invites} />
    </>
  );
}

export default function Page() {
  return (
    <div className="flex flex-col w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <Suspense
        fallback={
          <>
            <InvitesHeaderSkeleton />
            <ListInvitesSkeleton />
          </>
        }
      >
        <InvitesContent />
      </Suspense>
    </div>
  );
}
