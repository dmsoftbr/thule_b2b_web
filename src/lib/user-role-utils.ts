export function getUserRoleName(role: string) {
  if (role == "0" || role == "1") return "Administrativo";
  if (role == "2") return "Representante";
  if (role == "3") return "Cliente";

  return "N/D";
}
