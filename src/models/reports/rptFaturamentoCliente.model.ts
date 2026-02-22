export type RptFaturamentoClienteModel = {
  notas: RptFaturamentoClienteNotaModel[];
  itens: RptFaturamentoClienteItemModel[];
};

export type RptFaturamentoClienteNotaModel = {
  nomeAbRep: string;
  nomeAbrev: string;
  nomeEmit: string;
  nrNotaFis: string;
  serie: string;
  codEstabel: string;
  desStatus: string;
  vlTotal: number;
  vlMercad: number;
  dtEmissao: Date;
};

export type RptFaturamentoClienteItemModel = {
  codEstabel: string;
  serie: string;
  nrNotaFis: string;
  nrPedCli: string;
  natOoperacao: string;
  itCodigo: string;
  descItem: string;
  qtFatur: number;
  vlUn: number;
  vlMerc: number;
  vlST: number;
  vlTotal: number;
  sequencia: number;
};
