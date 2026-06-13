export type MlaGradeContabil = {
  conta: string;
  descConta: string;
  cCusto: string;
  descCC: string;
  valor: number;
  narrativa: string;
  itCodigo: string;
  adic1: string;
  adic2: string;
  qtde: number;
};

export type MlaPendencia = {
  nrTransacao: number;
  chaveDoc: string;
  tipoID: number;
  nrDocumento: string;
  codAprovador: string;
  dtGeracao: string;
  detalhe: string;
  valor: number;
  codSolicit: string;
  lotacaoDoc: string;
  transacoes: string;
  chaves: string;
  gradeContabil: MlaGradeContabil[];
};

export type MlaTipoDocumento = {
  codTipDoc: number;
  desTipDoc: string;
};

export type MlaAprovacaoResult = {
  success: boolean;
  total: number;
  sucessos: number;
  erros: string[];
};
