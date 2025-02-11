import React, { useState } from "react";
import "../Routes/Css/OrdenCard.css";
import Button from "react-bootstrap/Button";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { TicketCortina } from "./TicketCortina";
import {
  selectRollerConfig,
  selectConfigRiel,
  selectConfigTradicional,
} from "../Features/ConfigReducer";
import { useSelector } from "react-redux";
import { pdf } from "@react-pdf/renderer";

export const OrdenCard = ({ orden ,cli}) => {
  const { idOrden, articulo, estado, pasos, fechacCreacion,CliNomb } = orden;
  const [pasosActualizados, setPasosActualizados] = useState(pasos);
  const [isFlipped, setIsFlipped] = useState(false);
  const [paso, setpaso] = useState(null);

  const handleFlip = () => {
    setIsFlipped((prev) => !prev);
  };
  const ConfigRoller = useSelector(selectRollerConfig) || [];
  const ConfigRiel = useSelector(selectConfigRiel) || [];
  const ConfigTadicional = useSelector(selectConfigTradicional) || [];


  const Pinzas = ConfigTadicional.pinzas || [];
  const Ganchos = ConfigTadicional.ganchos || [];
    const CanosRoller = ConfigRoller.canos || [];
    const LadosCadenas = ConfigRoller.ladosCadena || [];
    const Motores = ConfigRoller.motores || [];
    const Posiciones = ConfigRoller.posiciones || [];
    const TiposCadenas = ConfigRoller.tiposCadena || [];
  const ladosAcumula = ConfigRiel.ladoAcumula || [];
  const tipos = ConfigRiel.tipos || [];

  function getAncho(tradi) {
    return tradi.cantidadPanos === 1 ? tradi.ancho : "N/A";
  }
  
  function getAnchoIzquierdo(tradi) {
    return tradi.cantidadPanos !== 1 ? tradi.ancho : "N/A";
  }
  
  function getAnchoDerecho(tradi) {
    return tradi.cantidadPanos !== 1 ? tradi.AnchoDerecho : "N/A";
  }
  
  function getAlto(tradi) {
    return tradi.CantidadAltos === 1 ? tradi.alto : "N/A";
  }
  
  function getAltoIzquierdo(tradi) {
    return tradi.CantidadAltos !== 1 ? tradi?.alto : "N/A";
  }
  
  function getAltoDerecho(tradi) {
    return tradi.CantidadAltos !== 1 ? tradi?.AltoDerecho : "N/A";
  }

  const findNameCano = (idCano) => {
    return CanosRoller.find((cano) => cano?.id === idCano)?.tipo;
  };
  const findNameLadoCadena = (idlado) => {
    return LadosCadenas.find((lado) => lado?.ladoId === idlado)?.lado;
  };
  const findNameMotor = (idMotor) => {
    return Motores.find((motor) => motor?.idMotor === idMotor)?.nombre;
  };
  const findNamePos = (idPos) => {
    return Posiciones.find((pos) => pos?.posicionId === idPos)?.posicion;
  };
  const findNameTipoCadena = (idTipoCadena) => {
    return TiposCadenas.find((cad) => cad?.idTipoCadena === idTipoCadena)
      .tipoCadena;
  };

  const findTela = (IdTela) => {
    return TiposTelas.find((Tela) => Tela.id === IdTela);
  };
  const findTelaTradi = (IdTela) => {
    return TiposTelasTradi.find((Tela) => Tela.id === IdTela);
  };
  
  const GetConfiguracionArticulos = () => {
    const listaArticulos = [];
console.log("articuloarticulo",articulo)
      const newCor = articulo

      if (articulo.nombre === "Roller") {
        newCor.posicion.posicion = findNamePos(newCor.posicion.posicionId);
        newCor.ladoCadena.lado = findNameLadoCadena(newCor.ladoCadena.ladoId);
      }

      console.log("ArticuloDesp", newCor);

      listaArticulos.push(newCor);

    return listaArticulos;
  };


  const downloadTicket = async () => {
    // Generar el documento PDF utilizando la función `pdf`
    //setloadingTicket(true);
    /*const articulosGen = GetConfiguracionArticulos()
    const blob = await pdf(
      <TicketCortina
        NombreCli={cli.nombre}
        Articulos={articulosGen}
      />
    ).toBlob();
    const base64PDF = await blobToBase64(blob);
    // Crear un enlace de descarga
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${cli.nombre} ETQ.pdf`;

    // Simular el clic en el enlace de descarga
    link.click();

    // Liberar la URL del objeto
    URL.revokeObjectURL(link.href);
    //setloadingTicket(false);*/
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]); // Retorna solo la parte Base64
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob); // Lee el blob como Data URL
    });
  };

  const Setpaso = async (pasoid) => {
    console.log(pasoid);
    const url = "/setOrden/" + pasoid;
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
    };
    try {
      const response = await fetch(url, requestOptions);
      const result = await response.json();

      console.log(result);
      // Aquí se encuentra el paso a actualizar en el estado
      const pasoIndex = pasosActualizados.findIndex((paso) => paso.idPasoOrden === pasoid);
      if (pasoIndex !== -1) {
        // Actualizar el paso como completado
        const updatedPasos = [...pasosActualizados];
        updatedPasos[pasoIndex] = {
          ...updatedPasos[pasoIndex],
          terminada: true,
        };
        setPasosActualizados(updatedPasos); // Actualizar el estado de pasos
        //setForceRender((prev) => !prev); // Forzar re-renderizado
      }
    } catch (error) {
      console.error("Error actualizando el paso:", error);
    }
  };

  return (
    <div className="card-container" onClick={handleFlip}>
      {articulo.nombre === "Roller" && (
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
              {pasosActualizados.map((paso, index) => (
                <li
                  key={index}
                  className={
                    paso.terminada ? "paso--completo" : "paso--pendiente"
                  }
                >
                  {paso.paso.replace("_", " ")} {paso.terminada ? "✔️" : "❌"}
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
              <Button onClick={()=>downloadTicket()}>Ticket</Button>
            </div>
            {pasosActualizados.map((paso) => {
              if (!paso.terminada) {
                return (
                  <Button
                  onClick={() => Setpaso(paso.idPasoOrden)}
                    className="botonesPasos"
                    key={paso.id}
                  >
                    {paso.paso}
                  </Button>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
      {articulo.nombre === "Riel" && (
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
              {pasosActualizados.map((paso, index) => (
                <li
                  key={index}
                  className={
                    paso.terminada ? "paso--completo" : "paso--pendiente"
                  }
                >
                  {paso.paso.replace("_", " ")} {paso.terminada ? "✔️" : "❌"}
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
            <Button onClick={downloadTicket()}>Ticket</Button>
            </div>
            {pasos.map((paso) => {
              if (!paso.terminada) {
                return (
                  <Button
                  onClick={() => Setpaso(paso.idPasoOrden)}
                    className="botonesPasos"
                    key={paso.id}
                  >
                    {paso.paso}
                  </Button>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
      {articulo.nombre === "Tradicional" && (
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
            Confeccion
            </p>
            <h3>Pasos:</h3>
            <ul className="orden-card__pasos">
              {pasosActualizados.map((paso, index) => (
                <li
                  key={index}
                  className={
                    paso.terminada ? "paso--completo" : "paso--pendiente"
                  }
                >
                  {paso.paso.replace("_", " ")} {paso.terminada ? "✔️" : "❌"}
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
            <Button onClick={downloadTicket()}>Ticket</Button>
            </div>
            {pasos.map((paso) => {
              if (!paso.terminada) {
                return (
                  <Button
                    onClick={() => Setpaso(paso.paso)}
                    className="botonesPasos"
                    key={paso.id}
                  >
                    {paso.paso}
                  </Button>
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};
