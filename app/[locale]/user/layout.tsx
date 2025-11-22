import { Header } from "@/components/common/header";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      <section className="max-w-4xl w-full mx-auto px-8">{children}</section>;
    </div>
  );
}
