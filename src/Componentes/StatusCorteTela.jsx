import React from "react";

export default function StatusCorteTela({ status }) {
  // Función que interpreta el estado textual
  const getStatusTela = () => {
    if (status === "TODOS TERMINADOS") return true;
    if (status === "EN PROCESO") return 0;
    if (status === "NINGUNO TERMINADO") return false;
    if (status?.includes("SIN PASOS")) return null;
    return null;
  };

  const estadoTela = getStatusTela();

  // Si no hay pasos, no mostrar nada
  if (estadoTela === null) return null;

  // Determinar ícono según estado
  const getIcon = () => {
    if (estadoTela === true)
      return <img src="/cheque.png" alt="Completado" style={{ width: 20, height: 20 }} />;
    if (estadoTela === false)
      return <img src="/eliminar.png" alt="No completado" style={{ width: 20, height: 20 }} />;
    if (estadoTela === 0)
      return <img src="/circulo.png" alt="En proceso" style={{ width: 20, height: 20 }} />;
  };

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
          fontWeight: estadoTela === true ? "600" : "400",
          fontSize: "14px",
        }}
      >
        Tela cortada
      </span>
    </div>
  );
}
