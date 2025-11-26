import InvitationBuilder from "@/components/invitation-builder";

export default async function Page() {
  return (
    <div className="max-w-2xl flex mx-auto px-4">
      <InvitationBuilder inviteEmoji="😀" />
    </div>
  );
}
