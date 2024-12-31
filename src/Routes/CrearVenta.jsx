import React from "react";
import { useState } from "react";
import { SelecctCliente } from "../Componentes/SelecctCliente";
import { Toaster, toast } from "react-hot-toast";
import "./Css/CrearVenta.css";
import { useDispatch, useSelector } from "react-redux";
import { selectCliente,Reset } from "../Features/ClienteReducer";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { ClienteSeleccted } from "../Componentes/ClienteSeleccted";
import { selectArticulos,removeAllArticulos } from "../Features/ArticulosReducer";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { FormRollers } from "../Forms/FormRollers";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";

export const CrearVenta = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [IdVentaView, setIdVentaView] = useState(null);
  const [loading, setloading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const cliente = useSelector(selectCliente);
  const Articulos = useSelector(selectArticulos);
  const [Obra, setObra] = useState("");
  const [FechaInstalacion, setFechaInstalacion] = useState("");
  const UrlVenta = "/VentasEP";
  //const UrlVenta = "/VentasEP"

  const ConfirmCrearVenta = async () => {
    setloading(true)
    const loadingToast = toast.loading("Cargando...");
    const VentaModel = {
      cliente,
      Articulos,
      obra: Obra,
      Id: 1,
      fechaInstalacion: FechaInstalacion,
    };

    console.log("VentaModel", VentaModel);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(VentaModel),
    };
    console.log(Articulos)
    /*
    try {
      const response = await fetch( UrlVenta,requestOptions);

      console.log("Response:", response);

      if (!response.ok) {
        console.error("Error en la solicitud:", response.statusText);
        return;
      }

      const result = await response.json();
      console.log("Response Venta", result);

      if(result.status==="OK"){
        dispatch(Reset)
        dispatch(removeAllArticulos)
        navigate("/Ventas")
      }else{
        console.log("error")
        AlertaError(result.message)
      }
      toast.dismiss(loadingToast)
      setloading(false)
    } catch (error) {
      setloading(false)
      toast.dismiss(loadingToast)
      AlertaError("Error al realizar la solicitud");
    }*/
  };

  const AlertaError = ( Mensaje ) => {
    console.log(Mensaje)
    toast.error(Mensaje);
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
                zIndex: 9999,
              },
            }}
          />
        </div>
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
                  <div
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
                  </div>
                  <div style={{ margin: "0 20px" }}>
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
                  </div>
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
              { !loading &&
              <Button as={Col} onClick={ConfirmCrearVenta}>
                Crear Venta
              </Button>
              }
              <Col></Col>
            </Row>
          </>
        )}
      </>
    );
  }
};
