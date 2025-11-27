import { InvitationCard } from "@/components/invitation-card";
import RsvpForm from "@/components/RSVP-form";
import { Card, CardContent } from "@/components/ui/card";
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
    } = result;

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
        <RsvpForm inviteId={id} />

        <footer>
          <Card className="w-full p-0 fixed max-w-2xl bottom-5 left-0">
            <CardContent className="m-0! text-center flex justify-center items-center gap-2 mt-8 text-sm">
              <span className="flex">create your invite with</span>
              <span className="flex font-bagel text-2xl text-primary">
                SMOOU
              </span>
            </CardContent>
          </Card>
        </footer>
      </main>
    );
  } else {
    notFound();
  }
}
