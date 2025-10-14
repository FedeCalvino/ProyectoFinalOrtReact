import React from 'react';

// StatusInline.jsx
// Componente React (Tailwind o estilos inline) que muestra un rectángulo chico en línea
// con 4 pasos: Tela cortada, Caño cortado, Armado, Probado.
// Solo visualización, con ticks si está completado.

export default function StatusInline(statuses) {
  console.log("statuses", statuses)
  const getstatustela = () => {
    if (statuses.statuses.telaCortada === "TODOS TERMINADOS") return true;
    if (statuses.statuses.telaCortada === "EN PROCESO") return 0;
    if (statuses.statuses.telaCortada === "NINGUNO TERMINADO") return false;
    if (statuses.statuses.telaCortada.includes("SIN PASOS")) return null;
    return null;
  };


  const defaultStatuses = {
    telaCortada: getstatustela(),
    canoCortado: null,
    armado: null,
    probado: null,
    ...statuses,
  };

  const items = [
    { key: 'telaCortada', label: 'Tela' }
  ];

  return (
    <div style={{
      display: "flex",
      gap: "8px",
      padding: "6px 10px",
      borderRadius: "8px",
      backgroundColor: "#f9f9f9",
      fontSize: "12px",
    }}>
      {items.map((it) => (
        
        <div
          key={it.key}
          style={{
            display: "flex",
            fontSize: "15px",
            alignItems: "center",
            gap: "4px",
            padding: "4px 6px",
            border: "1px solid black",
            borderRadius: "6px",
            backgroundColor: defaultStatuses[it.key] ? "#e6ffed" : "#fff",
            fontWeight: defaultStatuses[it.key] ? "600" : "400",
          }}
        >
          <span>
            {defaultStatuses[it.key] === null ? null : (
              defaultStatuses[it.key] === true ? (
                <img
                  src="/cheque.png"
                  alt="Cheque"
                  style={{ width: "20px", height: "20px" }}
                />
              ) : defaultStatuses[it.key] === false ? (
                <img
                  src="/eliminar.png"
                  alt="Eliminar"
                  style={{ width: "20px", height: "20px" }}
                />
              ) : (
                <img
                  src="/circulo.png"
                  alt="Circulo"
                  style={{ width: "20px", height: "20px" }}
                />
              )
            )}
          </span>
          <span><span>{ it.label}</span></span>
        </div>
      ))}
    </div>
  );
}


/*
  Ejemplo de uso:

  <StatusInline
    statuses={{ telaCortada: true, canoCortado: false, armado: true, probado: false }}
  />
*/