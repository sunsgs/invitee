import { db } from "@/db";
import { invite } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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
  try {
    const data = await req.json();
    const newInvite = {
      id: nanoid(),
      ...data,
      date: new Date(data.date),
      rsvpRequired: Boolean(data.rsvpRequired),
      creatorId: session?.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.insert(invite).values(newInvite);

    return NextResponse.json({ success: true, id: newInvite.id });
  } catch (error) {
    console.log(error);
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

  try {
    const data = await req.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Invite ID is required" },
        { status: 400 }
      );
    }

    // Verify the invite exists and belongs to the user
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

    return NextResponse.json({ success: true, id: id });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}
