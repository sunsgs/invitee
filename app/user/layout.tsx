import { Header } from "@/components/common/header";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col">
      <Header />
      <section className=" max-w-2xl mx-auto">{children}</section>;
    </div>
  );
}
