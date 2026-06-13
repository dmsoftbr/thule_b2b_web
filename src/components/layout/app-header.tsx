import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppQuickActions } from "@/components/layout/app-quick-actions";
import { AppNotificationsDropDown } from "@/components/layout/app-notifications-drop-down";
import { AppUserDropDown } from "@/components/layout/app-user-drop-down";

export const AppHeader = () => {
  return (
    <SidebarInset>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 shadow-md">
        <SidebarTrigger className="shrink-0" />
        <div className="flex items-center justify-between flex-1 min-w-0 gap-x-2">
          <div className="min-w-0">
            <AppQuickActions />
          </div>
          <div className="flex items-center gap-x-3 lg:gap-x-6 min-w-0">
            <AppNotificationsDropDown />
            {/* Em telas md+ o usuário fica no header; no mobile ele é movido
                para o rodapé da sidebar (ver AppSideBar). */}
            <AppUserDropDown className="hidden md:flex min-w-0 max-w-[220px]" />
          </div>
        </div>
      </header>
    </SidebarInset>
  );
};
