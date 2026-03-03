export interface VendaRaw {
  representante: string;
  nomeAbrev: string;
  data: string;
  totalVendaSimp: number;
}

// Estrutura para guardar os 12 meses
export interface BaseValores {
  valoresMensais: number[];
}

export interface ClienteComissao extends BaseValores {
  id: string;
  nome: string;
}

export interface RepresentanteComissao extends BaseValores {
  id: string;
  nome: string;
  clientes: ClienteComissao[];
}

export const agruparVendasPorMes = (
  dados: VendaRaw[],
): RepresentanteComissao[] => {
  const mapaRepresentantes = new Map<string, RepresentanteComissao>();

  dados.forEach((item) => {
    const repNome = item.representante?.trim() || "Sem Representante";
    const cliNome = item.nomeAbrev?.trim() || "Sem Cliente";
    const dataObj = new Date(item.data);
    const mesIndex = dataObj.getMonth(); // 0 (Jan) a 11 (Dez)
    const valor = item.totalVendaSimp || 0;

    // 1. Inicializa o Representante se não existir
    if (!mapaRepresentantes.has(repNome)) {
      mapaRepresentantes.set(repNome, {
        id: repNome,
        nome: repNome,
        valoresMensais: new Array(12).fill(0),
        clientes: [],
      });
    }

    const representante = mapaRepresentantes.get(repNome)!;

    // Soma o valor no total do representante
    representante.valoresMensais[mesIndex] += valor;

    // 2. Busca ou inicializa o Cliente dentro do Representante
    let cliente = representante.clientes.find((c) => c.nome === cliNome);
    if (!cliente) {
      cliente = {
        id: `${repNome}-${cliNome}`,
        nome: cliNome,
        valoresMensais: new Array(12).fill(0),
      };
      representante.clientes.push(cliente);
    }

    // Soma o valor no total do cliente específico
    cliente.valoresMensais[mesIndex] += valor;
  });

  // Ordena alfabeticamente Representantes e, em seguida, seus Clientes
  const resultado = Array.from(mapaRepresentantes.values()).sort((a, b) =>
    a.nome.localeCompare(b.nome),
  );

  resultado.forEach((rep) => {
    rep.clientes.sort((a, b) => a.nome.localeCompare(b.nome));
  });

  return resultado;
};
