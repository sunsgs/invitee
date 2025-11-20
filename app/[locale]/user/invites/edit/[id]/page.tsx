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

  console.log(result);
  if (result) {
    const {
      bgColor,
      textColor,
      fontValue,
      title,
      description,
      name,
      location,
      date,
      emoji,
      startTime,
      endTime,
      emojiDensity,
      rsvpRequired,
      isBabyCountEnabled,
      isMaxGuestsCountEnabled,
      maxGuestsBabyNumber,
      maxGuestsNumber,
    } = result;

    return (
      <InvitationBuilder
        inviteId={id}
        inviteDescription={description || ""}
        inviteBgColor={bgColor}
        inviteTextColor={textColor}
        inviteFontValue={fontValue}
        inviteEmoji={emoji || ""}
        inviteEmojiDensity={emojiDensity || 2}
        inviteRSVPRequired={rsvpRequired || false}
        inviteIsBabyCountEnabled={isBabyCountEnabled || false}
        inviteIsMaxGuestsCountEnabled={isMaxGuestsCountEnabled || false}
        inviteMaxGuestsBabyNumber={maxGuestsBabyNumber || 1}
        inviteMaxGuestsNumber={maxGuestsNumber || 2}
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
