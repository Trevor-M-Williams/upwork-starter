import Sidebar from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="absolute inset-0 flex">
      <Sidebar />
      <div className="flex-grow">{children}</div>
    </div>
  );
}
