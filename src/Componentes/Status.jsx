import React from "react";

export default function Status({ status,tipo }) {

  const getStatus = () => {
    if (status === "TODOS TERMINADOS") return true;
    if (status === "EN PROCESO") return 0;
    if (status === "NINGUNO TERMINADO") return false;
    if (status?.includes("SIN PASOS")) return null;
    return null;
  };

  const estado = getStatus();

  // Si no hay pasos o el estado es nulo → no mostrar nada
  if (estado === null) return null;

  // Elegir ícono según estado
  const getIcon = () => {
    if (estado === true)
      return <img src="/cheque.png" alt="Completado" style={{ width: 20, height: 20 }} />;
    if (estado === false)
      return <img src="/eliminar.png" alt="No completado" style={{ width: 20, height: 20 }} />;
    if (estado === 0)
      return <img src="/circulo.png" alt="En proceso" style={{ width: 20, height: 20 }} />;
  };
  // Render
  return (
    <div
      style={{
        display: "flex",
        gap: "8px",
        padding: "6px 10px",
        borderRadius: "8px",
        backgroundColor: "#f9f9f9",
        fontSize: "12px",
        alignItems: "center",
        border: "1px solid #ddd",
        width: "fit-content",
      }}
    >
      {getIcon()}
      <span
        style={{
          fontWeight: estado === true ? "600" : "400",
          fontSize: "14px",
        }}
      >
        {tipo}
      </span>
    </div>
  );
}
