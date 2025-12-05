import { PromoFooter } from "@/components/homepage/footer";
import { InvitationCard } from "@/components/invitation-card";
import RsvpForm from "@/components/RSVP-form";
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
      iconId,
      startTime,
      endTime,
      isBabyCountEnabled,
      isMaxGuestsCountEnabled,
      maxGuestsBabyNumber,
      maxGuestsNumber,
    } = result;


    const settings = {
      isBabyCountEnabled,
      isMaxGuestsCountEnabled,
      maxGuestsBabyNumber,
      maxGuestsNumber,
    };

    return (
      <main className="max-w-2xl mx-auto px-4 pb-16 mt-16 relative">
        <section>
          <InvitationCard
            iconId={iconId || ""}
            bgColor={bgColor}
            textColor={textColor}
            fontValue={fontValue}
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
        <RsvpForm inviteId={id} settings={settings} />

        {/* <Footer/> */}
        <PromoFooter/>
      </main>
    );
  } else {
    notFound();
  }
}
