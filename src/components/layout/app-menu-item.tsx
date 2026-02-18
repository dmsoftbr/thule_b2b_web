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
import { Link, useLocation } from "@tanstack/react-router";

interface Props {
  item: MenuModel;
  index: number;
  level?: number; // controla o nível de aninhamento
}

export const AppMenuItem = ({ item, index, level = 0 }: Props) => {
  const location = useLocation();
  console.log(level);
  function getIsActive(item: MenuModel) {
    if (item.children?.length && !item.url) return false;
    if (!item.url) return false;

    // exact match
    if (location.pathname.endsWith(item.url)) return true;

    // se o pathname contiver parte do item.url (ex.: último segmento)
    const parts = item.url.split("/").filter(Boolean);
    const lastPart = parts.length ? parts[parts.length - 1] : "";
    if (lastPart && location.pathname.includes(lastPart)) return true;

    return false;
  }

  // Renderiza subitem recursivamente
  const renderSubItem = (subItem: MenuModel) => {
    // Se tem children, renderiza como Collapsible (subnível 2)
    if (subItem.children && subItem.children.length > 0) {
      return (
        <Collapsible
          key={subItem.id}
          defaultOpen={false}
          className="group/subcollapsible"
        >
          <SidebarMenuSubItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuSubButton
                className="group/subsubMenu cursor-pointer select-none"
                isActive={getIsActive(subItem)}
              >
                {subItem.icon && (
                  <DynamicIcon
                    iconName={subItem.icon as any}
                    className="!text-gray-500 group-hover/subsubMenu:!text-white group-hover/subsubMenu:!cursor-pointer"
                  />
                )}
                <span className="text-white">{subItem.title}</span>
                <ChevronDownIcon className="ml-auto group-data-[state=open]/subcollapsible:hidden" />
                <ChevronUpIcon className="ml-auto group-data-[state=closed]/subcollapsible:hidden" />
              </SidebarMenuSubButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub className="pl-4">
                {subItem.children.map((deepItem) => (
                  <SidebarMenuSubItem key={deepItem.id}>
                    <SidebarMenuSubButton
                      asChild
                      isActive={getIsActive(deepItem)}
                    >
                      <Link
                        to={deepItem.url}
                        onClick={() => (deepItem.isActive = true)}
                        className="text-sm text-white"
                      >
                        {deepItem.icon && (
                          <DynamicIcon iconName={deepItem.icon as any} />
                        )}
                        <span>{deepItem.title}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuSubItem>
        </Collapsible>
      );
    }

    // Se não tem children, renderiza como link simples
    return (
      <SidebarMenuSubItem key={subItem.id}>
        <SidebarMenuSubButton asChild isActive={getIsActive(subItem)}>
          <Link
            to={subItem.url}
            onClick={() => (subItem.isActive = true)}
            className="text-sm text-white"
          >
            {subItem.icon && <DynamicIcon iconName={subItem.icon as any} />}
            <span>{subItem.title}</span>
          </Link>
        </SidebarMenuSubButton>
      </SidebarMenuSubItem>
    );
  };

  // Nível 0: Item principal
  if (item.children && item.children.length > 0) {
    return (
      <Collapsible
        key={item.id}
        defaultOpen={index === 1}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              className="group/subMenu"
              isActive={getIsActive(item)}
            >
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
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.children.map((subItem) => renderSubItem(subItem))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  // Item sem children (link direto)
  return (
    <SidebarMenuItem className="">
      <SidebarMenuButton asChild isActive={getIsActive(item)} className="">
        <Link
          to={item.url}
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
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
