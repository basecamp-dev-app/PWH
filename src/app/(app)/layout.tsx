import { AppHeader } from "@/features/shell/components/app-header";
import { AppSidebar } from "@/features/shell/components/app-sidebar";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="app-shell">
      <AppSidebar />
      <div className="app-shell__content">
        <AppHeader />
        <main className="app-main">{children}</main>
      </div>
    </div>
  );
}
