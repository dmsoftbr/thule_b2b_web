export function mergeRefs(...refs: any) {
  return (instance: any) => {
    refs.forEach((ref: any) => {
      if (typeof ref === "function") {
        ref(instance);
      } else if (ref != null) {
        ref.current = instance;
      }
    });
  };
}

export function mergeRefsNew<T>(
  ...inputRefs: (React.Ref<T> | undefined)[]
): React.Ref<T> | React.RefCallback<T> {
  const filteredInputRefs = inputRefs.filter(Boolean);

  if (filteredInputRefs.length <= 1) {
    const firstRef = filteredInputRefs[0];

    return firstRef || null;
  }

  return function mergedRefs(ref) {
    for (const inputRef of filteredInputRefs) {
      if (typeof inputRef === "function") {
        inputRef(ref);
      } else if (inputRef) {
        (inputRef as React.MutableRefObject<T | null>).current = ref;
      }
    }
  };
}

export function delay(timeout: number) {
  return new Promise(function (resolve) {
    setTimeout(resolve, timeout);
  });
}

export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  fileName: string = "dados.csv",
) {
  if (!data || data.length === 0) {
    console.warn("Nenhum dado para exportar.");
    return;
  }

  // Pega os headers a partir das chaves do primeiro objeto
  const headers = Object.keys(data[0]);

  // Converte valores para string segura (escapa aspas e vírgulas)
  const escapeCSVValue = (value: any) => {
    if (value === null || value === undefined) return "";

    const stringValue = String(value).replace(/"/g, '""');

    // Se tiver vírgula, quebra de linha ou aspas, envolve em aspas
    if (stringValue.search(/("|,|\n)/g) >= 0) {
      return `"${stringValue}"`;
    }

    return stringValue;
  };

  // Monta o conteúdo CSV
  const csvContent = [
    headers.join(","), // cabeçalho
    ...data.map((row) =>
      headers.map((header) => escapeCSVValue(row[header])).join(","),
    ),
  ].join("\n");

  // Cria Blob e força download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
