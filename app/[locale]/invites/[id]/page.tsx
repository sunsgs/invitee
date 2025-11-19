import { InvitationCard } from "@/components/invitation-card";
import { db } from "@/db";
import { notFound } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await db.query.invite.findFirst({
    where: (invite, { eq }) => eq(invite.id, id),
  });

  if (result) {
    const {
      bgColor,
      textColor,
      fontValue,
      title,
      name,
      location,
      date,
      emoji,
      startTime,
      endTime,
      emojiDensity,
    } = result;

    return (
      <section className="max-w-2xl mx-auto px-4 pb-16 mt-8">
        <InvitationCard
          emoji={emoji || ""}
          bgColor={bgColor}
          textColor={textColor}
          fontValue={fontValue}
          emojiIntensity={emojiDensity || 2}
          data={{
            title: title || "",
            location: location || "",
            name,
            date: date,
            startTime: startTime || "",
            endTime: endTime || "",
          }}
        />
      </section>
    );
  } else {
    notFound();
  }
}
