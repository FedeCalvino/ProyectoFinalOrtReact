import React, { useEffect, useCallback } from "react";
import { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { SelecctCliente } from "../Componentes/SelecctCliente";
import Alert from "react-bootstrap/Alert";
import { Toaster, toast } from "react-hot-toast";
import "./Css/CrearVenta.css";
import { useDispatch, useSelector } from 'react-redux';
import {selectCliente} from "../Features/ClienteReducer"
import { selectRieles,selectRollers,selectTradicional } from "../Features/CortinasReducer";
import { Modal } from "react-bootstrap";


export const CrearVenta = () => {
  const dispatch = useDispatch()
  const [IdVentaView, setIdVentaView] = useState(null);
  const [loading, setloading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const DataCli = useSelector(selectCliente)
  const [Obra, setObra] = useState("");
  const [FechaInstalacion, setFechaInstalacion] = useState("");

  //alertas y validaciones
  const [ErrorCrear, setErrorCrear] = useState(false);

  const UrlCliente = "HTTP//localhost:8083/Cliente";

  async function crearVenta(idCliente, precioFinal, obra, fechaInstalacion) {
    const requestOptionsVenta = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        IdCliente: idCliente,
        PrecioFinal: 0,
        Obra: obra,
        FechaInstalacion: fechaInstalacion,
      }),
    };

    try {
      const response = await fetch(UrlVentas, requestOptionsVenta);

      if (!response.ok) {
        // Verifica el código de estado HTTP y lanza un error con un mensaje apropiado
        const errorMessage = getErrorMessage(response.status);
        throw new Error(errorMessage);
      }

      const result = await response.json();
      handleResult(result);
      console.log("Venta creada", result);
    } catch (error) {
        setloading(false);
      console.error("Error al crear la venta:", error);
      toast.error(`Error al crear la venta: ${error.message}`, {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
    } finally {
      setloading(false);
    }
  }

  async function crearCliente(dataCli) {
    const RutParse = parseInt(dataCli.Rut, 10);
    const TelParse = parseInt(dataCli.Tel, 10);

    const requestOptionsCliente = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rut: RutParse,
        Nombre: dataCli.Name,
        NumeroTelefono: TelParse,
        direccion: dataCli.Direcc,
        Tipo: dataCli.a,
      }),
    };
    /*
    try {
      const response = await fetch(UrlCliente, requestOptionsCliente);

      if (!response.ok) {
        // Verifica el código de estado HTTP y lanza un error con un mensaje apropiado
        const errorMessage = getErrorMessage(response.status);
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("Cliente creado", result);
      return result.id;
    } catch (error) {
        setloading(false);
      console.error("Error al crear el cliente:", error);
      toast.error(`Error al crear el cliente: ${error.message}`, {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
      return null;
    }
    */
  }

  const ConfirmCrearVenta = async ()=>{
   console.log(DataCli)
    setloading(true)
    
    if (DataCli.Id) {
      console.log("Cliente con id", DataCli);
      await crearVenta(DataCli.Id, "0", Obra, FechaInstalacion);
    } else {
      console.log("Cliente sin id", DataCli);
      const clienteId = await crearCliente(DataCli);
      if (clienteId) {
        await crearVenta(clienteId, 0, Obra, FechaInstalacion);
      }
    }
  }

  const AlertaError = ({ Mensaje }) => {
    setloading(false);
    setErrorCrear(true);
    return (
      <>
        <Alert variant="danger">{Mensaje}</Alert>
      </>
    );
  };

  if (!IdVentaView) {
    return (
      <>
        <div>
          <Toaster
            position="bottom-center"
            reverseOrder={false}
            toastOptions={{
              style: {
                zIndex: 9999, // Configuración global del z-index
              },
            }}
          />
        </div>
        {ErrorCrear ? <AlertaError /> : null}
        {!DataCli.set ? (
          <SelecctCliente/>
        ) : (
          <>
          </>
        )}
      </>
    );
  }
};
