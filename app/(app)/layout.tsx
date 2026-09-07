import type { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-white">
      <Sidebar />
      <div className="flex-1">{children}</div>
    </div>
  );
}