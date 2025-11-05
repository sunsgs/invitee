export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <section className="w-full mx-auto mt-6">{children}</section>
    </div>
  );
}
