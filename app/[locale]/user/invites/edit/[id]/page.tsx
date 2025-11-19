import InvitationBuilder from "@/components/invitation-builder";
import { db } from "@/db";

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
      <InvitationBuilder
        inviteId={id}
        inviteBgColor={bgColor}
        inviteTextColor={textColor}
        inviteFontValue={fontValue}
        inviteEmoji={emoji || ""}
        inviteEmojiDensity={emojiDensity || 2}
        data={{
          title: title || "",
          name: name || "",
          location: location || "",
          date: date || "",
          startTime: startTime || "",
          endTime: endTime || "",
        }}
      />
    );
  }
}
