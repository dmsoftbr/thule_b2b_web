"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertTriangleIcon, BellIcon } from "lucide-react";

import { subMinutes } from "date-fns";
import * as uuid from "uuid";
import { getTimeAgo } from "@/lib/datetime-utils";

import { Link } from "@tanstack/react-router";

const notifications = [
  {
    id: uuid.v4(),
    title: "Solicitou aprovação de Pedido",
    content: "Pedido Nº P12312321",
    createdAt: subMinutes(new Date(), 60),
    isSystem: false,
    user: {
      id: "aaa",
      name: "José da Silva",
      email: "jose.silva@portal.com",
      imageUrl: "https://github.com/shadcn.png",
    },
  },
  {
    id: uuid.v4(),
    title: "Possui Pedidos a Confirmar",
    content: "Pedido Nº P12312321",
    createdAt: subMinutes(new Date(), 120),
    isSystem: false,
    user: {
      id: "aaa",
      name: "José da Silva",
      email: "jose.silva@portal.com",
      imageUrl: "https://github.com/shadcn.png",
    },
  },
  {
    id: uuid.v4(),
    title: "Problemas na sincronização de Dados",
    content: "Pedido Nº P12312321",
    createdAt: subMinutes(new Date(), 10),
    isSystem: true,
    user: null,
  },
];

export const AppNotificationsDropDown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="data-[state=open]:border-border border border-transparent rounded p-1 data-[state=open]:bg-neutral-100">
        <BellIcon className="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {notifications.map((item) => (
          <div key={item.id}>
            <DropdownMenuItem asChild>
              <div>
                {item.user && item.user.imageUrl && (
                  <Avatar>
                    <AvatarImage src={item.user.imageUrl} />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                )}
                {item.isSystem && (
                  <AlertTriangleIcon className="size-6 fill-orange-300 border-orange-400 stroke-orange-700 stroke-[1.5px]" />
                )}
                <div className="flex flex-col">
                  <p>{item.title}</p>
                  <p className="font-semibold">{item.content}</p>
                  <p className="text-xs font-semibold">
                    {getTimeAgo(item.createdAt)}
                  </p>
                </div>
              </div>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
          </div>
        ))}
        <DropdownMenuItem
          className="text-center flex items-center justify-center"
          asChild
        >
          <Link to={"/notifications"}>Todas as Notificações</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
