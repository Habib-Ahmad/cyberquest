import { AlertCircle, CheckCircle, Info, XCircle, X } from "lucide-react";
import type { ReactNode } from "react";
import { useTheme } from "../../context/index";

interface AlertProps {
  variant?: "success" | "danger" | "warning" | "info";
  children: ReactNode;
  onClose?: () => void;
  className?: string;
}

export default function Alert({
  variant = "info",
  children,
  onClose,
  className = "",
}: AlertProps) {
  const { isDark } = useTheme();

  const styles = {
    success: {
      container: isDark
        ? "bg-primary-900/30 border-primary-700/50 text-primary-300"
        : "bg-green-50 border-green-200 text-green-800",
      icon: (
        <CheckCircle
          className={`h-5 w-5 ${
            isDark ? "text-primary-400" : "text-green-500"
          }`}
        />
      ),
    },
    danger: {
      container: isDark
        ? "bg-red-900/30 border-red-700/50 text-red-300"
        : "bg-red-50 border-red-200 text-red-800",
      icon: (
        <XCircle
          className={`h-5 w-5 ${isDark ? "text-red-400" : "text-red-500"}`}
        />
      ),
    },
    warning: {
      container: isDark
        ? "bg-yellow-900/30 border-yellow-700/50 text-yellow-300"
        : "bg-yellow-50 border-yellow-200 text-yellow-800",
      icon: (
        <AlertCircle
          className={`h-5 w-5 ${
            isDark ? "text-yellow-400" : "text-yellow-500"
          }`}
        />
      ),
    },
    info: {
      container: isDark
        ? "bg-blue-900/30 border-blue-700/50 text-blue-300"
        : "bg-blue-50 border-blue-200 text-blue-800",
      icon: (
        <Info
          className={`h-5 w-5 ${isDark ? "text-blue-400" : "text-blue-500"}`}
        />
      ),
    },
  };

  const currentStyle = styles[variant];

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-lg border ${currentStyle.container} ${className}`}
      role="alert"
    >
      <div className="shrink-0">{currentStyle.icon}</div>
      <div className="flex-1 min-w-0 text-sm">{children}</div>
      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 p-1 rounded hover:bg-black/10 transition-colors"
          aria-label="Close alert"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
