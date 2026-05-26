import { Check, X } from "lucide-react";
import { Toast } from "@/lib/library/types";

export function ToastNotice({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  return (
    <div className="toast" role="status" aria-live="polite">
      <span>
        <Check size={18} />
      </span>
      <div>
        <strong>{toast.title}</strong>
        <p>{toast.message}</p>
      </div>
      <button className="icon-button" onClick={onClose} title="Cerrar aviso">
        <X size={18} />
      </button>
    </div>
  );
}

