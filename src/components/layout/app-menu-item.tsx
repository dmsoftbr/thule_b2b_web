import { DynamicIcon } from "@/components/ui/dynamic-lucide-icon";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { type MenuModel } from "@/models/menu-model";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useLocation } from "@tanstack/react-router";

interface Props {
  item: MenuModel;
  index: number;
}
export const AppMenuItem = ({ item, index }: Props) => {
  const location = useLocation();
  function getIsActive(item: MenuModel) {
    if (item.children && item.url) return false;
    return location.pathname.endsWith(item.url);
  }

  if (item.children && item.children.length > 0) {
    return (
      <Collapsible
        key={item.id}
        defaultOpen={index === 1}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="group/subMenu">
              {item.icon && (
                <DynamicIcon
                  iconName={item.icon as any}
                  className="text-gray-500 group-hover/subMenu:text-white"
                />
              )}

              <span>{item.title}</span>
              {item.children && item.children.length > 0 && (
                <ChevronDownIcon className="ml-auto group-data-[state=open]/collapsible:hidden" />
              )}
              {item.children && item.children.length > 0 && (
                <ChevronUpIcon className="ml-auto group-data-[state=closed]/collapsible:hidden" />
              )}
            </SidebarMenuButton>
          </CollapsibleTrigger>
          {item.children?.length ? (
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.children.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.id}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={getIsActive(subItem)}
                    >
                      <a
                        href={subItem.url}
                        onClick={() => (subItem.isActive = true)}
                        className="text-sm text-white"
                      >
                        {subItem.icon && (
                          <DynamicIcon iconName={subItem.icon as any} />
                        )}
                        <span>{subItem.title}</span>
                      </a>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          ) : null}
        </SidebarMenuItem>
      </Collapsible>
    );
  }
  return (
    <SidebarMenuItem className="">
      <SidebarMenuButton asChild isActive={item.isActive} className="">
        <a
          href={item.url}
          className="text-sm group/menuItem"
          onClick={() => {}}
        >
          {item.icon && (
            <DynamicIcon
              iconName={item.icon as any}
              className=" text-gray-500 group-hover/menuItem:text-white group-data-[active=true]/menuItem:text-white"
            />
          )}

          <span>{item.title}</span>
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
