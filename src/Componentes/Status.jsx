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
   const getText = () => {
    if(tipo==="Tela"){
      if (estado === true)
      return "Tela "
      if (estado === false)
      return "Tela Sin Cortar"
      if (estado === 0)
      return "Tela en Proceso"
    }
    if(tipo==="Armado"){
      if (estado === true)
      return "Armado"
      if (estado === false)
      return "Sin Armar"
      if (estado === 0)
      return "Armado en Proceso"
    }
    if(tipo==="Riel"){
      if (estado === true)
      return "Riel Cortado"
      if (estado === false)
      return "Riel sin Cortar"
      if (estado === 0)
      return "Rieles en Proceso"
    }
    if(tipo==="Cano"){
      if (estado === true)
      return "Caño Cortado"
      if (estado === false)
      return "Caño sin cortar"
      if (estado === 0)
      return "Caño en Proceso"
    }
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
