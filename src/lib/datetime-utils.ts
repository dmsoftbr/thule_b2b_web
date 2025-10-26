import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function getTimeAgo(fromDate: Date) {
  return formatDistanceToNow(fromDate, { addSuffix: true, locale: ptBR });
}

export const formatDate = (dateString: string | Date | null | undefined) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("pt-BR");
};
