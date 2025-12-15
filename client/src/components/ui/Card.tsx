import { type ReactNode } from "react";
import { useTheme } from "../../context/index";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className = "",
  hover = false,
  onClick,
}: CardProps) {
  const { isDark } = useTheme();

  return (
    <div
      className={`
        backdrop-blur-sm border rounded-xl
        ${
          isDark
            ? "bg-gray-900/50 border-gray-800"
            : "bg-white border-gray-200 shadow-sm"
        }
        ${
          hover
            ? "hover:border-primary-600/50 hover:shadow-lg hover:shadow-primary-600/10 transition-all duration-300 cursor-pointer"
            : ""
        }
        ${className}
      `}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = "" }: CardHeaderProps) {
  const { isDark } = useTheme();

  return (
    <div
      className={`px-6 py-4 border-b ${
        isDark ? "border-gray-800" : "border-gray-200"
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
}

export function CardTitle({ children, className = "" }: CardTitleProps) {
  const { isDark } = useTheme();

  return (
    <h3
      className={`text-lg font-semibold ${
        isDark ? "text-white" : "text-gray-900"
      } ${className}`}
    >
      {children}
    </h3>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = "" }: CardContentProps) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

export default Card;
