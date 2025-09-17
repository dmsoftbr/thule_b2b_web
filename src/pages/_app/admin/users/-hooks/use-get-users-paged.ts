import { api } from "@/lib/api";
import type { PagedRequestModel } from "@/models/dto/requests/paged-request.model";
import type { PagedResponseModel } from "@/models/dto/responses/paged-response.model";
import type { UserModel } from "@/models/user.model";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Função para buscar usuários da API
const fetchUsers = async (
  params: PagedRequestModel
): Promise<PagedResponseModel<UserModel>> => {
  try {
    const response = await api.post<PagedResponseModel<UserModel>>(
      "/security/users/list-paged",
      params
    );
    return response.data;
  } catch (error) {
    // Re-throw o erro para que o React Query possa capturá-lo
    if (axios.isAxiosError(error)) {
      throw new Error(`Erro ao buscar usuários: ${error.message}`);
    }
    throw new Error("Erro desconhecido ao buscar usuários");
  }
};

// Hook personalizado para gerenciar a consulta de usuários
export const useGetUsersPaged = (params: PagedRequestModel) => {
  return useQuery({
    queryKey: ["users-paged"], // Chave única para o cache
    queryFn: () => fetchUsers(params), // Função que faz a requisição
  });
};
