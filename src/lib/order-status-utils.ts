export function getOrderStatusName(statusId: number, creditStatusId: number) {
  if (statusId == -3) {
    return "Excluído";
  }
  if (statusId == -2) {
    return "Reprovado";
  }
  if (statusId == -1) {
    return "Aprovação";
  }
  if (statusId == 1) {
    if (creditStatusId == 1 || creditStatusId == 4) {
      return "Aprov. Financeira";
    }

    return "Aprovado";
  }
  if (statusId == 2) return "Faturado Parcial";
  if (statusId == 3) return "Faturado Total";
  if (statusId == 4) return "Pendente";
  if (statusId == 5) return "Suspenso";
  if (statusId == 6) return "Cancelado";
  if (statusId == 7) return "Faturado Balcão";
  return "N/D";
}

export const getOrderStatusColor = (
  statusId: number,
  creditStatusId: number
) => {
  if (statusId == 1) {
    if (creditStatusId == 1 || creditStatusId == 4) {
      return "bg-orange-400 text-white";
    }
    return "bg-emerald-600 text-white";
  }
  if (statusId == 2) return "bg-neutral-400 text-white";
  if (statusId == 3) return "bg-neutral-800 text-white";
  if (statusId == 4) return "bg-blue-300 text-white";
  if (statusId == 5) return "bg-purple-400 text-white";
  if (statusId == 6) return "bg-red-400 text-white";
  if (statusId == 7) return "";
  return "";
};
