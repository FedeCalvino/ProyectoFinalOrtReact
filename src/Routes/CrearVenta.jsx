import React, { useEffect, useCallback } from "react";
import { useState, useRef } from "react";
import { SelecctCliente } from "../Componentes/SelecctCliente";
import Alert from "react-bootstrap/Alert";
import { Toaster, toast } from "react-hot-toast";
import "./Css/CrearVenta.css";
import { useDispatch, useSelector } from 'react-redux';
import {selectCliente} from "../Features/ClienteReducer"
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { ClienteSeleccted } from "../Componentes/ClienteSeleccted";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { FormRollers } from "../Forms/FormRollers";
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
          <Row>
            <ClienteSeleccted/>
              <Col md="12">
                <div
                  style={{
                    left: 0,
                    width: "100%",
                    padding: "10px",
                    marginTop:"20px",
                    backgroundColor: "white",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)", // Adds a soft shadow
                    zIndex: 999, // Ensures it's on top
                    display: "flex",
                    justifyContent:"space-around",
                    alignItems: "center",
                    borderBottom: "2px solid #ccc",
                    fontSize: "20px",
                  }}
                >
                  <p
                    style={{
                      margin: "0 20px",
                      marginLeft: "20px",
                      display: "flex",
                      justifyContent: "space-around",
                    }}
                  >
                    <InputGroup
                      style={{ width: "100%", alignContent: "center" }}
                    >
                      <h3>Obra</h3>
                      <Form.Control
                        type="text"
                        value={Obra}
                        style={{
                          marginLeft: "10px",
                          textAlign: "center",
                          borderRadius: "10px",
                        }}
                        onChange={(e) => setObra(e.target.value)}
                      />
                    </InputGroup>
                  </p>
                  <p style={{ margin: "0 20px" }}>
                    <InputGroup
                      style={{ width: "100%", alignContent: "center" }}
                    >
                      <h3>Fecha Instalacion</h3>
                      <Form.Control
                        type="date"
                        value={FechaInstalacion}
                        style={{
                          marginLeft: "10px",
                          textAlign: "center",
                          borderRadius: "10px",
                        }}
                        onChange={(e) => setFechaInstalacion(e.target.value)}
                      />
                    </InputGroup>
                  </p>
                </div>
              </Col>
            </Row>
            <Row>
              <h2 style={{ textAlign: "center", marginTop: "10px" }}></h2>
              <Tabs
                defaultActiveKey="Roll"
                id="fill-tab-example"
                className="mb-2 custom-tabs"
                fill
              >
                <Tab eventKey="Roll" title="Roller">
                  <FormRollers/>
                </Tab>
                <Tab eventKey="Tra" title="Tradicional">
                </Tab>
              </Tabs>
            </Row>
          </>
        )}
      </>
    );
  }
};
