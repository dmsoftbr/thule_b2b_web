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
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>{getInitials("Administrador")}</AvatarFallback>
            </Avatar>
            Administrador
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel className="text-xs font-semibold">
            Minha Conta
          </DropdownMenuLabel>
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
