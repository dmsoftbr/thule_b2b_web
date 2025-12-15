import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function getTimeAgo(fromDate: Date) {
  return formatDistanceToNow(fromDate, { addSuffix: true, locale: ptBR });
}

export const formatDate = (dateString: string | Date | null | undefined) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("pt-BR");
};

export function parseDate(date: string | Date): Date {
  let strDate = "";

  if (date instanceof Date) {
    strDate = format(date, "yyyy-MM-dd");
  } else {
    strDate = date;
  }

  const splittedDate = strDate.split("T");
  const [y, m, d] = splittedDate[0].split("-").map(Number);
  console.log(date, splittedDate[0], y, m, d);
  return new Date(Date.UTC(y, m - 1, d));
}
