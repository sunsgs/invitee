import { Header } from "@/components/common/header";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main>
      <Header />
      {children};
    </main>
  );
}
