import { Header } from "@/components/common/header";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <section className="max-w-3xl mx-auto mt-6">{children}</section>
    </div>
  );
}
