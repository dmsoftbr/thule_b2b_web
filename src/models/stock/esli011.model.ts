export interface Esli011Model {
  productId: string;
  description: string;
  productStatus: string;
  orders: Esli011CarteiraModel[];
  stock: Esli011EstoqueModel[];
  purchaseOrders: Esli011OCModel[];
}

export interface Esli011CarteiraModel {
  nrPedido: number;
  codEstabel: string;
  nrPedcli: string;
  sequencia: number;
  nomeAbrev: string;
  dtEntrega?: Date;
  dtMinFat?: Date;
  dtMaxFat?: Date;
  qtPedida: number;
  qtAtendida: number;
  qtLogAloc: number;
  qtAlocada: number;
}

export interface Esli011EstoqueModel {
  codEstabel: string;
  codDepos: string;
  codLocaliz: string;
  qtAtu: number;
  qtAlocada: number;
  qtAlocPed: number;
  qtAlocProd: number;
  outlet: boolean;
}

export interface Esli011OCModel {
  codEstabel: string;
  itCodigo: string;
  numeroOrdem: number;
  parcela: number;
  quantidade: number;
  quantSaldo: number;
  dataEntrega?: Date;
  situacao: string;
  numPedido: number;
  embarque: string;
}
