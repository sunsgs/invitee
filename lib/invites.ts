// lib/queries/invites.ts
import { db } from "@/db";
import { invite } from "@/db/schema";
import { InviteFormData } from "@/validation/schema";
import { desc } from "drizzle-orm";

export async function getUserInvites(
  userId: string
): Promise<InviteFormData[]> {
  return db.query.invite.findMany({
    where: (invite, { eq }) => eq(invite.creatorId, userId),
    orderBy: [desc(invite.date)],
  });
}
