import { requireEntitlement } from "@/lib/access";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireEntitlement();
  return children;
}
