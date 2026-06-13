export type NotaFiscal = {
  estabel: string;
  notaFiscal: string;
  serie: string;
  emissao: string;
  valorTotal: number;
  transportadora: string;
  embarque: number;
  dtEmbarque?: string | null;
  pedido: string;
  clienteAbrev: string;
};
