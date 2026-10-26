import React from "react";
export default function Campo({
  nombre,
  etiqueta,
  valor,
  onChange,
  error,
  multilinea = false,
  ...props
}) {
  const Control = multilinea ? "textarea" : "input";
  return (
    <div className="field">
      <label htmlFor={nombre}>
        {etiqueta}
        {props.required ? " *" : ""}
      </label>
      <Control
        id={nombre}
        name={nombre}
        value={valor}
        onChange={(e) => onChange(nombre, e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? nombre + "-error" : undefined}
        {...props}
      />
      {error && (
        <span className="field-error" id={nombre + "-error"}>
          {error}
        </span>
      )}
    </div>
  );
}
