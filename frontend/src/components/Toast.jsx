import React, { useEffect } from "react";

export default function Toast({ mensaje, onCerrar }) {
  useEffect(() => {
    if (!mensaje) return undefined;
    const timer = setTimeout(onCerrar, 4000);
    return () => clearTimeout(timer);
  }, [mensaje, onCerrar]);

  if (!mensaje) return null;

  return (
    <div className="toast" role="status" aria-live="polite">
      <span>{mensaje}</span>
      <button type="button" onClick={onCerrar} aria-label="Cerrar aviso">
        ×
      </button>
    </div>
  );
}
