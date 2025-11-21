import ListInvites from "@/components/list-invites";
import { db } from "@/db";
import { invite } from "@/db/schema";
import { auth } from "@/lib/auth";
import { InviteFormData } from "@/validation/schema";
import { desc } from "drizzle-orm";
import { headers } from "next/headers";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user.id;

  if (session && userId) {
    const invites: InviteFormData[] = await db.query.invite.findMany({
      where: (invite, { eq }) => eq(invite.creatorId, userId),
      orderBy: [desc(invite.date)],
    });

    return <ListInvites data={invites} />;
  }
}
