import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppQuickActions } from "@/components/layout/app-quick-actions";
import { AppNotificationsDropDown } from "@/components/layout/app-notifications-drop-down";
import { AppUserDropDown } from "@/components/layout/app-user-drop-down";

export const AppHeader = () => {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 shadow-md">
        <SidebarTrigger className="" />
        <div className="flex items-center justify-between flex-1">
          <div>
            <AppQuickActions />
          </div>
          <div className="flex items-center gap-x-10">
            <AppNotificationsDropDown />
            <AppUserDropDown />
          </div>
        </div>
      </header>
    </SidebarInset>
  );
};
