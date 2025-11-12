import ListInvites from "@/components/list-invites";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user.id;

  if (session && userId) {
    const rawInvites = await db.query.invite.findMany({
      where: (invite, { eq }) => eq(invite.creatorId, userId),
    });

    // Transform null to undefined
    const invites = rawInvites;

    console.log(invites);
    return <ListInvites data={invites} />;
  }
}
