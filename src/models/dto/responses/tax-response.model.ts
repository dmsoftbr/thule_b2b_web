export type TaxResponseDto = {
  seguro: number;
  desconto: number;
  frete: number;
  despesas_acessorias: number;

  valor_contabil: number;
  valor_mercadoria: number;
  base_duplicada: number;

  total_impostos: number;
  total_impostos_sem_incidencia: number;
  total_impostos_embutidos: number;

  itens: ItemDocumento[];
  TaxesDetail: TaxDetail[];
};

export type ItemDocumento = {
  produto: Produto;
};

export type Produto = {
  codigo_produto: string;
  sequencia: string;
  tes: string;

  quantidade: number;
  valor_unitario: number;
  valor_total: number;
  valor_mercadoria: number;

  desconto: number;
  frete: number;
  seguro: number;
  despesas_acessorias: number;

  aliquota_icms: number;
  valor_icms: number;
  base_calculo_icms: number;

  aliquota_ipi: number;
  valor_ipi: number;
  base_calculo_ipi: number;

  aliquota_pis: number;
  valor_pis: number;
  base_calculo_pis: number;

  aliquota_cofins: number;
  valor_cofins: number;
  base_calculo_cofins: number;

  aliquota_csll: number;
  valor_csll: number;

  aliquota_st: number;
  valor_st: number;
  base_calculo_st: number;

  reforma: ReformaTributaria[];
};

export type ReformaTributaria = {
  tipo_tributo: number;
  tipo_tributo_descricao: "CBS" | "IBS UF" | "IBS Mun";

  class_trib: string;
  cod_cst: string;

  aliquota: number;
  base_tributo: number;
  valor_tributo: number;

  aliquota_regular: number;
  base_regular: number;
  vl_regular: number;

  percentual_reducao: number;
  perc_reducao_governamental: number;

  perc_diferimento: number;
  vl_diferimento: number;

  compra_governamental: boolean;
  item_monofasico: boolean;

  cClass_regular: string;
  cst_regular: string;

  cClass_presumido: string;
  vl_cred_presumido: number;
  perc_cred_presumido: number;
  vl_cred_presumido_suspenso: number;
};

export type TaxDetail = {
  imposto: string;
  descricao: string;
  base_calculo: number;
  aliquota: number;
  valor: number;
};
