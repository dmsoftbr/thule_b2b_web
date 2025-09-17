import { FormInput } from "@/components/form/form-input";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { UserGroupSchema } from "./schemas";
import { useEffect } from "react";
import { UserGroupsService } from "@/services/security/user-groups.service";
import { toast } from "sonner";
import { isAxiosError } from "axios";
import type { UserGroupModel } from "@/models/user-group.model";

interface Props {
  action: "ADD" | "EDIT";
  initialData?: UserGroupModel;
}

export const UserGroupForm = ({ action, initialData }: Props) => {
  const navigate = useNavigate();
  const userGroupService = new UserGroupsService();

  const form = useForm<z.infer<typeof UserGroupSchema>>({
    defaultValues: {
      id: "",
      name: "",
    },
  });

  async function onSubmit(values: z.infer<typeof UserGroupSchema>) {
    try {
      if (action === "ADD") await userGroupService.create(values);
      if (action === "EDIT") await userGroupService.update(values);
      navigate({ to: "/admin/user-groups" });
    } catch (error) {
      console.log(error);
      if (isAxiosError(error)) toast.error(error.response?.data);
    }
  }

  useEffect(() => {
    if (action === "EDIT" && initialData) {
      form.reset(initialData);
    }
  }, [initialData]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full flex items-center justify-center flex-col"
        >
          <div className="flex flex-col w-full space-y-2 p-4 container max-w-lg">
            <FormInput
              readOnly={action === "EDIT"}
              label="Código"
              control={form.control}
              name="id"
            />
            <FormInput label="Nome" control={form.control} name="name" />
          </div>
          <div className="bg-neutral-100 border-t px-2 py-2 flex items-center justify-end gap-x-2 w-full">
            <Button
              variant="outline"
              size="sm"
              type="button"
              onClick={() => navigate({ to: "/admin/user-groups" })}
            >
              Cancelar
            </Button>

            <Button size="sm" type="submit">
              Gravar
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
