import React from 'react';

export default function StatusInline({ statuses = {} }) {
  // --- Función para interpretar el estado de "telaCortada" ---
  const getStatusTela = () => {
    const estado = statuses.telaCortada;

    if (estado === "TODOS TERMINADOS") return true;
    if (estado === "EN PROCESO") return 0;
    if (estado === "NINGUNO TERMINADO") return false;
    if (estado?.includes("SIN PASOS")) return null;
    return null;
  };

  // --- Estados por defecto (pueden venir del prop 'statuses') ---
  const defaultStatuses = {
    telaCortada: getStatusTela(),
    canoCortado: statuses.canoCortado ?? null,
    armado: statuses.armado ?? null,
    probado: statuses.probado ?? null,
  };

  // --- Lista de pasos ---
  const items = [
    { key: 'telaCortada', label: 'Tela' },
    { key: 'canoCortado', label: 'Caño' },
    { key: 'armado', label: 'Armado' },
    { key: 'probado', label: 'Probado' },
  ];

  // --- Render del componente ---
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        padding: "6px 10px",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        fontSize: "12px",
      }}
    >
      {items.map((it) => {
        const status = defaultStatuses[it.key];
        if (status === null) return null; // No renderiza si no tiene pasos

        return (
          <div
            key={it.key}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              padding: "4px 8px",
              border: "1px solid #000",
              borderRadius: "6px",
              backgroundColor: status === true ? "#e6ffed" : "#fff",
              fontWeight: status === true ? "600" : "400",
            }}
          >
            {status === true ? (
              <img src="/cheque.png" alt="Cheque" style={{ width: 20, height: 20 }} />
            ) : status === false ? (
              <img src="/eliminar.png" alt="Eliminar" style={{ width: 20, height: 20 }} />
            ) : (
              <img src="/circulo.png" alt="En proceso" style={{ width: 20, height: 20 }} />
            )}
            <span>{it.label}</span>
          </div>
        );
      })}
    </div>
  );
}
