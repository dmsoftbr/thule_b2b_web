import { createFileRoute, useParams } from "@tanstack/react-router";
import { UserGroupForm } from "../-components/user-group-form";
import { Suspense, useEffect, useState } from "react";
import { type UserGroupModel } from "@/models/user-group.model";
import { UserGroupsService } from "@/services/security/user-groups.service";

export const Route = createFileRoute("/_app/admin/user-groups/$groupId/")({
  component: UserGroupIdPage,
});

function UserGroupIdPage() {
  const { groupId } = useParams({ from: "/_app/admin/user-groups/$groupId/" });
  const [groupData, setGroupData] = useState<UserGroupModel>();

  useEffect(() => {
    getData();
  }, []);

  async function getData() {
    const userGroupService = new UserGroupsService();
    const data = await userGroupService.getById(groupId);
    setGroupData(data);
  }

  if (!groupData) return null;

  return (
    <Suspense fallback={<div>Aguarde</div>}>
      <div className="m-2 bg-white border shadow rounded w-full relative">
        <h1 className="font-semibold text-lg px-2 bg-neutral-200">
          Manutenção de Grupo de Usuário
        </h1>
        <UserGroupForm action="EDIT" initialData={groupData} />
      </div>
    </Suspense>
  );
}
