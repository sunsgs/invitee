// ==================== API Route: /api/invite/route.ts ====================
import { db } from "@/db";
import { invite } from "@/db/schema";
import { auth } from "@/lib/auth";
import { count, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const MAX_INVITES = Number(process.env.NEXT_PUBLIC_MAX_INVITES);

async function getUserInviteCount(userId: string): Promise<number> {
  const result = await db
    .select({ count: count() })
    .from(invite)
    .where(eq(invite.creatorId, userId));

  return result[0]?.count ?? 0;
}

export async function POST(req: NextRequest) {
  const nanoid = customAlphabet("ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 10);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Block anonymous users from creating invites
  if (session.user.isAnonymous) {
    return NextResponse.json(
      {
        success: false,
        error: "ANONYMOUS_USER",
        message: "Please sign in to save your invitation",
      },
      { status: 403 }
    );
  }

  try {
    // Check invite limit BEFORE creating
    const inviteCount = await getUserInviteCount(session.user.id);

    if (inviteCount >= MAX_INVITES) {
      return NextResponse.json(
        {
          success: false,
          error: "ERRORS.INVITE_LIMIT_REACHED",
          message: `You've reached the maximum of ${MAX_INVITES} invitations`,
          currentCount: inviteCount,
          maxCount: MAX_INVITES,
        },
        { status: 403 }
      );
    }

    const data = await req.json();

    const newInvite = {
      id: nanoid(),
      ...data,
      date: new Date(data.date),
      rsvpRequired: Boolean(data.rsvpRequired),
      creatorId: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(invite).values(newInvite);

    return NextResponse.json({
      success: true,
      id: newInvite.id,
      inviteCount: inviteCount + 1,
      remainingSlots: MAX_INVITES - (inviteCount + 1),
    });
  } catch (error) {
    console.error("Error creating invite:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Block anonymous users from updating
  if (session.user.isAnonymous) {
    return NextResponse.json(
      {
        success: false,
        error: "ANONYMOUS_USER",
        message: "Please sign in to update your invitation",
      },
      { status: 403 }
    );
  }

  try {
    const data = await req.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Invite ID is required" },
        { status: 400 }
      );
    }

    const existingInvite = await db.query.invite.findFirst({
      where: (invite, { eq }) => eq(invite.id, id),
    });

    if (!existingInvite) {
      return NextResponse.json(
        { success: false, error: "Invite not found" },
        { status: 404 }
      );
    }

    if (existingInvite.creatorId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to edit this invite" },
        { status: 403 }
      );
    }

    const updatedInvite = {
      ...updateData,
      date: new Date(updateData.date),
      rsvpRequired: Boolean(updateData.rsvpRequired),
      updatedAt: new Date(),
    };

    await db.update(invite).set(updatedInvite).where(eq(invite.id, id));

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Error updating invite:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}

// ==================== GET: Check user limits ====================
export async function GET(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (session.user.isAnonymous) {
    return NextResponse.json({
      success: true,
      isAnonymous: true,
      inviteCount: 0,
      maxCount: MAX_INVITES,
      remainingSlots: MAX_INVITES,
      canCreateMore: false,
    });
  }

  const inviteCount = await getUserInviteCount(session.user.id);

  return NextResponse.json({
    success: true,
    isAnonymous: false,
    inviteCount,
    maxCount: MAX_INVITES,
    remainingSlots: MAX_INVITES - inviteCount,
    canCreateMore: inviteCount < MAX_INVITES,
  });
}

// ==================== API Route: /api/invite/route.ts (DELETE Handler) ====================

export async function DELETE(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  // Block anonymous users from deleting
  if (session.user.isAnonymous) {
    return NextResponse.json(
      {
        success: false,
        error: "ANONYMOUS_USER",
        message: "Please sign in to delete your invitation",
      },
      { status: 403 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id"); // Expect the ID as a query parameter

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Invite ID is required" },
        { status: 400 }
      );
    }

    // 1. Find the invite to check ownership
    const existingInvite = await db.query.invite.findFirst({
      where: (invite, { eq }) => eq(invite.id, id),
    });

    if (!existingInvite) {
      return NextResponse.json(
        { success: false, error: "Invite not found" },
        { status: 404 }
      );
    }

    // 2. Authorization check: Ensure the session user is the creator
    if (existingInvite.creatorId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Unauthorized to delete this invite" },
        { status: 403 }
      );
    }

    // 3. Delete the invite
    await db.delete(invite).where(eq(invite.id, id));

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Error deleting invite:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}
