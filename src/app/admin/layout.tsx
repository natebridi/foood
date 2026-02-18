import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import AdminThemeProvider from "@/components/admin/AdminThemeProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppRouterCacheProvider>
      <AdminThemeProvider>{children}</AdminThemeProvider>
    </AppRouterCacheProvider>
  );
}
