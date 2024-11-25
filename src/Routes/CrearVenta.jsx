import React, { useEffect, useCallback } from "react";
import { useState, useRef } from "react";
import { SelecctCliente } from "../Componentes/SelecctCliente";
import Alert from "react-bootstrap/Alert";
import { Toaster, toast } from "react-hot-toast";
import "./Css/CrearVenta.css";
import { useDispatch, useSelector } from "react-redux";
import { selectCliente } from "../Features/ClienteReducer";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { ClienteSeleccted } from "../Componentes/ClienteSeleccted";
import { selectArticulos } from "../Features/ArticulosReducer";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { FormRollers } from "../Forms/FormRollers";
import Button from "react-bootstrap/Button";

export const CrearVenta = () => {
  const dispatch = useDispatch();
  const [IdVentaView, setIdVentaView] = useState(null);
  const [loading, setloading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const cliente = useSelector(selectCliente);
  const Articulos = useSelector(selectArticulos);
  const [Obra, setObra] = useState("");
  const [FechaInstalacion, setFechaInstalacion] = useState("");

  //alertas y validaciones
  const [ErrorCrear, setErrorCrear] = useState(false);

  const UrlVenta = "http://localhost:8083/Ventas";

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

  const ConfirmCrearVenta = async () => {
    const VentaModel = {
      cliente,
      Articulos,
      obra: Obra,
      id: 1,
      fechaInstalacion: FechaInstalacion,
    };

    console.log("VentaModel", VentaModel);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(VentaModel),
    };

    try {
      const response = await fetch(
        "http://localhost:8083/Ventas",
        requestOptions
      );

      console.log("Response:", response);

      if (!response.ok) {
        console.error("Error en la solicitud:", response.statusText);
        return;
      }

      const result = await response.json();
      console.log("Response Venta", result);
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
    }
  };

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
        {!cliente.set ? (
          <SelecctCliente />
        ) : (
          <>
            <Row>
              <ClienteSeleccted />
              <Col md="12">
                <div
                  style={{
                    left: 0,
                    width: "100%",
                    padding: "10px",
                    marginTop: "20px",
                    backgroundColor: "white",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                    zIndex: 999, // Ensures it's on top
                    display: "flex",
                    justifyContent: "space-around",
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
                defaultActiveKey="Roller"
                id="fill-tab-example"
                className="mb-2 custom-tabs"
                fill
              >
                <Tab eventKey="Roller" title="Roller">
                  <FormRollers />
                </Tab>
                <Tab eventKey="Tradicional" title="Tradicional"></Tab>
              </Tabs>
            </Row>
            <Row>
              <Col></Col>
              <Button as={Col} onClick={ConfirmCrearVenta}>
                Crear Venta
              </Button>
              <Col></Col>
            </Row>
          </>
        )}
      </>
    );
  }
};
