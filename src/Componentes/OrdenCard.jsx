import React, { useState } from "react";
import "../Routes/Css/OrdenCard.css";
import Button from "react-bootstrap/Button";

export const OrdenCard = ({ orden }) => {
  const { idOrden, articulo, estado, pasos, fechacCreacion } = orden;

  const [isFlipped, setIsFlipped] = useState(false);
  const [paso, setpaso] = useState(null);

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };

  const SetpasoTerm = async (paso)=>{
        try {
          const requestOptions = {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
          };
  
          const response = await fetch("/OrdenEp/PasoOrden/Completar/"+paso.idPasoOrden, requestOptions);
          const result = await response.json();
          console.log(result);
          paso.terminada=true;
          if (result.status!="OK") {

          } else {
            
          }

      } catch (error) {

      }

  }


  return (
    <div className="card-container" onClick={handleFlip}>
      { articulo.nombre==="Roller" &&
      <div className={`orden-card ${isFlipped ? "orden-card--flipped" : ""}`}>
        {/* Cara frontal */}
        <div className="orden-card__side orden-card__front">
          <h2 className="orden-card__titulo">Número {articulo.IdArticulo}</h2>
          <p>
            <strong>Artículo:</strong> {articulo.nombre}
          </p>
          <p>
            <strong>Ambiente:</strong> {articulo.Ambiente}
          </p>
          <p
            style={{
              fontSize: "24px",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              marginTop: "5px",
            }}
          >
            {articulo.AnchoTela} x {articulo.AltoTela}
          </p>
          <h3>Pasos:</h3>
          <ul className="orden-card__pasos">
            {pasos.map((paso, index) => (
              <li
                key={index}
                className={
                  paso.terminada ? "paso--completo" : "paso--pendiente"
                }
              >
                {paso.paso.replace("_"," ")} {paso.terminada ? "✔️" : "❌"}
              </li>
            ))}
          </ul>
        </div>
        {/* Cara trasera */}
        <div className="orden-card__side orden-card__back">
          <div className="volver-container">
            <Button>Volver</Button>
          </div>
          <div className="Ticket-container">
            <Button>Ticket</Button>
          </div>
          {pasos.map((paso) => {
            if (!paso.terminada) {
              return (
                <Button onClick={()=>SetpasoTerm(paso)} className="botonesPasos" key={paso.id}>
                  {paso.paso}
                </Button>
              );
            }
            return null;
          })}
        </div>
      </div>
    }
    { articulo.nombre==="Riel" &&
      <div className={`orden-card ${isFlipped ? "orden-card--flipped" : ""}`}>
        {/* Cara frontal */}
        <div className="orden-card__side orden-card__front">
          <h2 className="orden-card__titulo">Número {articulo.IdArticulo}</h2>
          <p>
            <strong>Artículo:</strong> {articulo.nombre}
          </p>
          <p>
            <strong>Ambiente:</strong> {articulo.Ambiente}
          </p>
          <p
            style={{
              fontSize: "24px",
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              marginTop: "5px",
            }}
          >
           Ancho {articulo.ancho}
          </p>
          <h3>Pasos:</h3>
          <ul className="orden-card__pasos">
            {pasos.map((paso, index) => (
              <li
                key={index}
                className={
                  paso.terminada ? "paso--completo" : "paso--pendiente"
                }
              >
                {paso.paso.replace("_"," ")} {paso.terminada ? "✔️" : "❌"}
              </li>
            ))}
          </ul>
        </div>
        {/* Cara trasera */}
        <div className="orden-card__side orden-card__back">
          <div className="volver-container">
            <Button>Volver</Button>
          </div>
          <div className="Ticket-container">
            <Button>Ticket</Button>
          </div>
          {pasos.map((paso) => {
            if (!paso.terminada) {
              return (
                <Button onClick={()=>SetpasoTerm(paso.paso)} className="botonesPasos" key={paso.id}>
                  {paso.paso}
                </Button>
              );
            }
            return null;
          })}
        </div>
      </div>
    }
    </div>
  );
};
