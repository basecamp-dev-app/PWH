import { AppHeader } from "@/features/shell/components/app-header";
import { AppSidebar } from "@/features/shell/components/app-sidebar";
import { requireUser } from "@/lib/auth";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await requireUser();

  return (
    <div className="app-shell">
      <AppSidebar userEmail={user.email ?? "Authenticated user"} />
      <div className="app-shell__content">
        <AppHeader userEmail={user.email ?? "Authenticated user"} />
        <main className="app-main">{children}</main>
      </div>
    </div>
  );
}
