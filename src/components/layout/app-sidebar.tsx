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
import { AppUserDropDown } from "./app-user-drop-down";
import { MENU_DATA } from "@/menu/menu-data";
import logoThule from "@/assets/images/thule_logo.png";
import { usePermissions } from "@/hooks/use-permissions";
import type { MenuModel } from "@/models/menu-model";

function filterMenuByPermissions(
  items: MenuModel[],
  has: (id?: string) => boolean,
  isAdmin: boolean,
): MenuModel[] {
  return items.flatMap((item) => {
    const originalHadChildren = (item.children?.length ?? 0) > 0;

    if (originalHadChildren) {
      const filteredChildren = filterMenuByPermissions(
        item.children!,
        has,
        isAdmin,
      );
      if (filteredChildren.length === 0) return [];
      return [{ ...item, children: filteredChildren }];
    }

    // Leaf: admin sempre vê; itens sem permissionId são públicos; demais exigem permissão concedida.
    if (isAdmin) return [item];
    if (!item.permissionId) return [item];
    if (!has(item.permissionId)) return [];
    return [item];
  });
}

export const AppSideBar = () => {
  const { has, isLoading, isAdmin } = usePermissions();
  const items = isLoading
    ? []
    : filterMenuByPermissions(MENU_DATA, has, isAdmin);

  return (
    <Sidebar className="bg-zinc-800">
      <SidebarHeader className="flex items-start pl-6 justify-center border-b border-b-zinc-600 min-h-[64px] bg-zinc-800 relative">
        <img
          className="w-auto max-h-[30px]"
          src={logoThule}
          alt="Thule Sweden"
        />
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
      <SidebarFooter className="flex flex-col items-stretch gap-3 px-4 justify-center border-t border-t-zinc-600 bg-zinc-800 min-h-20">
        {/* Usuário só aparece aqui em telas mobile; no desktop ele fica no
            header (ver AppHeader). */}
        <AppUserDropDown className="md:hidden h-12 w-full justify-start bg-zinc-700 text-white border-zinc-600 hover:bg-zinc-600 hover:text-white" />
        <div className="relative flex justify-center">
          <Logo inverse />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
