import { useState } from "react";

export function useToast(timeout = 3000) {
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });

    setTimeout(() => {
      setToast(null);
    }, timeout);
  };

  return { toast, showToast, clearToast: () => setToast(null) };
}

