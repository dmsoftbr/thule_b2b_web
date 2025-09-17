import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/ui/logo";
import { AppMenuItem } from "./app-menu-item";
import { MENU_MOCK } from "@/mock/menu-mock";

const items = MENU_MOCK;
export const AppSideBar = () => {
  return (
    <Sidebar className="bg-zinc-800">
      <SidebarHeader className="flex items-center justify-center border-b border-b-zinc-600 min-h-[64px] bg-zinc-800">
        <Logo inverse />
      </SidebarHeader>
      <SidebarContent className="bg-zinc-800 text-white">
        <SidebarGroup>
          <SidebarMenu>
            {items.map((item, index) => (
              <AppMenuItem key={item.id} item={item} index={index} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="flex items-center justify-center border-t border-t-zinc-600 bg-zinc-800 min-h-20">
        <div className="relative">
          <img
            width={180}
            height={100}
            src="/assets/images/thule_group-inv.png"
            alt="Thule Group"
          />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
