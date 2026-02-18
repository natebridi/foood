import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AppRouterCacheProvider>{children}</AppRouterCacheProvider>;
}
