import { useSearch } from "@tanstack/react-router";

/**
 * Destino do botão "Voltar" de telas de detalhe (visualizar/editar pedido,
 * simulação, aprovação, etc.), de forma PARAMETRIZÁVEL e reutilizável.
 *
 * Convenção: a tela de origem navega passando o search param `from` com a rota
 * de retorno — ex.: `navigate({ to: "/orders/view/$orderId", params, search: {
 * from: "/approvals" } })`. A tela de destino chama `useReturnTo(fallback)` e o
 * botão Voltar navega para esse caminho. Sem `from`, usa o fallback informado.
 *
 * `strict: false` permite ler o search sem acoplar a uma rota específica, então
 * o mesmo hook serve para qualquer tela.
 */
export function useReturnTo(fallback: string): string {
  const search = useSearch({ strict: false }) as { from?: string };
  const from = typeof search?.from === "string" ? search.from.trim() : "";
  // Só aceita caminhos internos (começando com "/") — evita open-redirect.
  return from.startsWith("/") ? from : fallback;
}
