import ListInvites from "@/components/list-invites";
import { db } from "@/db";
import { auth } from "@/lib/auth";
import { InviteFormData } from "@/validation/schema";
import { headers } from "next/headers";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user.id;

  if (session && userId) {
    const invites: InviteFormData[] = await db.query.invite.findMany({
      where: (invite, { eq }) => eq(invite.creatorId, userId),
    });

    return <ListInvites data={invites} />;
  }
}
