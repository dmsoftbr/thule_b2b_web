import { api } from "@/lib/api";
import type { PagedRequestModel } from "@/models/dto/requests/paged-request.model";
import type { PagedResponseModel } from "@/models/dto/responses/paged-response.model";
import type { UserGroupModel } from "@/models/user-group.model";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Função para buscar usuários da API
const fetchUserGroups = async (
  params: PagedRequestModel
): Promise<PagedResponseModel<UserGroupModel>> => {
  try {
    const response = await api.post<PagedResponseModel<UserGroupModel>>(
      "/security/user-groups/list-paged",
      params
    );
    return response.data;
  } catch (error) {
    // Re-throw o erro para que o React Query possa capturá-lo
    if (axios.isAxiosError(error)) {
      throw new Error(`Erro ao buscar grupos de usuários: ${error.message}`);
    }
    throw new Error("Erro desconhecido ao buscar grupos de usuários");
  }
};

// Hook personalizado para gerenciar a consulta de usuários
export const useGetUserGroupsPaged = (params: PagedRequestModel) => {
  return useQuery({
    queryKey: ["user-groups-paged"], // Chave única para o cache
    queryFn: () => fetchUserGroups(params), // Função que faz a requisição
  });
};
