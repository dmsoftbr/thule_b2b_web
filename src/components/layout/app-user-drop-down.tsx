"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDownIcon, LockIcon, LogOutIcon, UserIcon } from "lucide-react";
import { UserChangePasswordModal } from "./user-change-password-modal";
import { useState } from "react";
import { getInitials } from "@/lib/string-utils";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { getUserRoleName } from "@/lib/user-role-utils";

export const AppUserDropDown = () => {
  const { session } = useAuth();
  const navigate = useNavigate();

  const [showChangePasswordModal, setShowPasswordModal] = useState(false);

  const onLogout = () => {
    localStorage.clear();
    navigate({ to: "/auth/login", replace: true });
  };

  const onChangePassword = () => {
    setShowPasswordModal(true);
  };

  const isDomain = !!session?.user?.networkDomain;

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="h-12">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn1.png" />
              <AvatarFallback className="bg-black text-white">
                {getInitials(session?.user.name ?? "")}
              </AvatarFallback>
            </Avatar>
            {session?.user.name}
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-56">
          <DropdownMenuLabel className="text-xs font-semibold">
            Minha Conta
          </DropdownMenuLabel>
          <div className="flex items-center gap-2 px-2 py-1.5">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn1.png" />
              <AvatarFallback className="bg-black text-white">
                {getInitials(session?.user.name ?? "")}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">
                {session?.user.name}
              </span>
              <span className="text-muted-foreground text-xs">
                {session?.user.email}
              </span>
              <span className="text-muted-foreground text-xs">
                {getUserRoleName(String(session?.user.role ?? ""))}
              </span>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <UserIcon />
            Perfil
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={isDomain}
            onClick={() => onChangePassword()}
          >
            <LockIcon />
            Altere sua Senha
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onLogout()}>
            <LogOutIcon />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <UserChangePasswordModal
        isOpen={showChangePasswordModal}
        onClose={() => setShowPasswordModal(false)}
      />
    </>
  );
};
