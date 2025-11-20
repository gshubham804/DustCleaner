import type { ReactNode } from "react";
import { enqueueSnackbar, closeSnackbar } from "notistack";
import type { OptionsObject } from "notistack";
import {
  X as XIcon,
  CheckCircle2,
  AlertCircle,
  Info,
  TriangleAlert,
} from "lucide-react";

type ToastVariant = "default" | "success" | "error" | "warning" | "info";

interface ToastOptions {
  duration?: number;
  persist?: boolean;
  preventDuplicate?: boolean;
  action?: (key: string | number) => ReactNode;
  dense?: boolean;
}

const getToastIcon = (variant: ToastVariant) => {
  const iconProps = { size: 18, className: "mr-2" };

  switch (variant) {
    case "success":
      return <CheckCircle2 {...iconProps} className="mr-2 text-green-400" aria-hidden="true" />;
    case "error":
      return <AlertCircle {...iconProps} className="mr-2 text-red-400" aria-hidden="true" />;
    case "warning":
      return <TriangleAlert {...iconProps} className="mr-2 text-yellow-400" aria-hidden="true" />;
    case "info":
      return <Info {...iconProps} className="mr-2 text-blue-400" aria-hidden="true" />;
    default:
      return null;
  }
};

const showToast = (
  message: string,
  variant: ToastVariant = "default",
  options: ToastOptions = {}
) => {
  const {
    duration = 3000,
    persist = false,
    preventDuplicate = true,
    action,
    dense = false,
  } = options;

  enqueueSnackbar(message, {
    variant,
    autoHideDuration: persist ? null : duration,
    preventDuplicate,
    dense,
    anchorOrigin: { vertical: "top", horizontal: "center" },
    action:
      action ||
      ((key) => (
        <button
          onClick={() => closeSnackbar(key)}
          className="ml-2 text-white hover:text-gray-300 transition-colors duration-200 p-1 rounded-full hover:bg-white/10"
          aria-label="Close notification"
        >
          <XIcon size={16} />
        </button>
      )),
    content: (key: string | number, message: string) => (
      <div className="flex items-center p-3 bg-gray-800/95 backdrop-blur-sm border border-white/10 rounded-lg shadow-xl animate-slide-in-down">
        {getToastIcon(variant)}
        <span className="text-white text-sm font-medium flex-1">{message}</span>
        <button
          onClick={() => closeSnackbar(key)}
          className="ml-3 text-white/60 hover:text-white transition-colors duration-200 p-1 rounded-full hover:bg-white/10"
          aria-label="Close notification"
        >
          <XIcon size={16} />
        </button>
      </div>
    ),
  } as OptionsObject);
};

// Convenience methods
showToast.success = (message: string, options?: ToastOptions) =>
  showToast(message, "success", options);

showToast.error = (message: string, options?: ToastOptions) =>
  showToast(message, "error", options);

showToast.warning = (message: string, options?: ToastOptions) =>
  showToast(message, "warning", options);

showToast.info = (message: string, options?: ToastOptions) =>
  showToast(message, "info", options);

export default showToast;
