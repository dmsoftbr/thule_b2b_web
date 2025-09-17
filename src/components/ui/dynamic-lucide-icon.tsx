import React from "react";
import * as LucideIcons from "lucide-react";

// Tipo que representa todos os ícones do Lucide
type LucideIconName = keyof typeof LucideIcons;

// Tipo para o componente de ícone do Lucide
type LucideIconComponent = React.ComponentType<
  React.SVGProps<SVGSVGElement> & {
    color?: string;
    size?: number | string;
  }
>;

// Interface para as props do componente
interface DynamicIconProps extends Omit<React.SVGProps<SVGSVGElement>, "ref"> {
  iconName: LucideIconName;
  color?: string;
  size?: number | string;
  className?: string;
}

/**
 * Componente que renderiza dinamicamente um ícone do pacote lucide-react
 * @param iconName - Nome do ícone a ser renderizado (deve corresponder ao nome no pacote lucide-react)
 * @param color - Cor do ícone (opcional)
 * @param size - Tamanho do ícone em pixels (opcional)
 * @param className - Classes CSS adicionais (opcional)
 * @param restProps - Outras propriedades SVG suportadas pelos ícones
 * @returns O componente do ícone ou null se não encontrado
 */
export const DynamicIcon: React.FC<DynamicIconProps> = ({
  iconName,
  color = "currentColor",
  size = 24,
  className = "",
  ...restProps
}) => {
  // Verifica se o nome do ícone foi fornecido
  if (!iconName) {
    console.error("Nome do ícone não fornecido");
    return null;
  }

  // Obtém o componente de ícone correspondente ao nome
  // Usamos type assertion para informar ao TypeScript que este é um componente válido
  const IconComponent = LucideIcons[iconName] as LucideIconComponent;

  // Verifica se o ícone existe
  if (!IconComponent) {
    console.error(`Ícone "${iconName}" não encontrado no pacote lucide-react`);
    return null;
  }

  // Renderiza o componente do ícone com as propriedades fornecidas
  return (
    <IconComponent
      color={color}
      size={size}
      className={className}
      {...restProps}
    />
  );
};
