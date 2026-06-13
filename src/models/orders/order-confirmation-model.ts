export type OrderConfirmation = {
  id: string; // "pedido-sequencia" (chave de seleção)
  pedido: string;
  sequencia: number;
  clienteAbrev: string;
  clienteNome: string;
  item: string;
  descricao: string;
  saldoPedido: number;
  qtEstoque: number;
  valorTotal: number;
  dtEmissao: string;
  dtUltFat?: string | null;
  representante: string;
};
