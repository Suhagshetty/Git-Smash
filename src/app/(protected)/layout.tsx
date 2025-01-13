import { UserButton } from "@clerk/nextjs";
import App from "next/app";
import React from "react";
import { SidebarProvider } from "~/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
type Props = {
  children: React.ReactNode;
};
const Sidebarlayout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="m-2 w-full">
        <div className="flex items-center gap-2 rounded-md border border-sidebar-border bg-sidebar p-2 px-4 shadow">
          <div className="ml-auto">
            <UserButton />
          </div>
        </div>
        <div className="h-4">
          <div className="shdadow h-[calc(100vh-6rem)] overflow-y-scroll rounded-md border border-sidebar-border bg-sidebar p-4">
            {children}
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
};

export default Sidebarlayout;
