export function getInitials(name: string): string {
  if (!name) return "";
  const words = name.trim().split(/\s+/);
  let initials = "";

  if (words.length === 1) {
    initials = words[0].substring(0, 2).toUpperCase();
    if (initials.length === 1 && words[0].length > 1) {
      initials += words[0].charAt(1).toUpperCase();
    }
    return initials;
  }

  initials =
    words[0].charAt(0).toUpperCase() +
    words[words.length - 1].charAt(0).toUpperCase();

  return initials;
}

export function formatCpfCnpj(value: string): string {
  // Remove qualquer caractere que não seja número
  const cleaned = value.replace(/\D/g, "");

  if (cleaned.length === 11) {
    // Formato CPF: 000.000.000-00
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  if (cleaned.length === 14) {
    // Formato CNPJ: 00.000.000/0000-00
    return cleaned.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
      "$1.$2.$3/$4-$5"
    );
  }

  // Retorna valor original se não for CPF nem CNPJ
  return value;
}
