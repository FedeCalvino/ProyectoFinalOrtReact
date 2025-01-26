import React from "react";
import { useState } from "react";
import { SelecctCliente } from "../Componentes/SelecctCliente";
import { Toaster, toast } from "react-hot-toast";
import "./Css/CrearVenta.css";
import { useDispatch, useSelector } from "react-redux";
import { selectCliente, Reset } from "../Features/ClienteReducer";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";
import { ClienteSeleccted } from "../Componentes/ClienteSeleccted";
import {
  selectArticulos,
  removeAllArticulos,
} from "../Features/ArticulosReducer";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { FormRollers } from "../Forms/FormRollers";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { FormTradicional } from "../Forms/FormTradicional";
import { FormRieles } from "../Forms/FormRieles";
import { TablaArticulos } from "../Tables/TablaArticulos";
import { VentaPreview } from "../Componentes/VentaPreview";
import { Modal } from "react-bootstrap";

export const CrearVenta = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const cliente = useSelector(selectCliente);
  const Articulos = useSelector(selectArticulos);
  const [Obra, setObra] = useState("");
  const [FechaInstalacion, setFechaInstalacion] = useState("");


  const [VentaInfo, setVentaInfo] = useState(null);
  const UrlVenta = "http://localhost:8083/Ventas"

  const CrearVenta = async () => {
    const VentaInfoObj={
      CliNombre:cliente.Nombre,
      Obra:Obra,
      FechaInstalacion:FechaInstalacion
    }
    setVentaInfo(VentaInfoObj)
    setShowModal(true);

  };

  const toastCallBack=(mensaje,tipo)=>{
    if(tipo==="error"){
      toast.error(mensaje);
    }
    if(tipo==="success"){
      toast.success(mensaje);
    }
  }

  const ConfirmCrearVenta = async () => {
    if (Articulos.length >0) {
      setloading(true);
      const loadingToast = toast.loading("Cargando...");
      const VentaModel = {
        cliente,
        Articulos,
        obra: Obra,
        Id: 1,
        fechaInstalacion: FechaInstalacion,
      };
      console.log("VentaModel",VentaModel)
      
      console.log("VentaModel", VentaModel);

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(VentaModel),
      };
      console.log(Articulos);
      try {
        const response = await fetch(UrlVenta, requestOptions);

        console.log("Response:", response);

        if (!response.ok) {
          console.error("Error en la solicitud:", response.statusText);
          return;
        }

        const result = await response.json();
        console.log("Response Venta", result);
        toast.dismiss(loadingToast);
        if (result.status === "OK") {
          dispatch(Reset);
          dispatch(removeAllArticulos);
          navigate("/Ventas");
        } else {
          console.log("error");
          AlertaError(result.message);
          toast.dismiss(loadingToast);
        }
        toast.dismiss(loadingToast);
        setloading(false);
      } catch (error) {
        setloading(false);
        toast.dismiss(loadingToast);
        AlertaError("Error al realizar la solicitud");
      }

    }else{
      setShowModal(false)
      toast.error("No hay articulos");
    }
  };

  const AlertaError = (Mensaje) => {
    console.log(Mensaje);
    toast.error(Mensaje);
  };

  return (
    <>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ textAlign: "center", width: "100%" }}>
            Detalle de la Venta
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <VentaPreview Venta={VentaInfo}/>
          <Row className="button-row">
            <Col className="d-flex justify-content-center">
              <Button
                className="custom-button"
                variant="primary"
                onClick={() => {
                  ConfirmCrearVenta();
                }}
              >
                Crear
              </Button>
            </Col>
            <Col className="d-flex justify-content-center">
              <Button
                className="custom-button"
                style={{ backgroundColor: "red", borderColor: "red" }}
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </Button>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Volver
          </Button>
        </Modal.Footer>
      </Modal>
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
            <Col md="12"></Col>
          </Row>
          <Row>
            <Col>
              <div
                style={{
                  left: 0,
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "white",
                  zIndex: 999, // Ensures it's on top
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  marginBottom: "20px",
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
                  <InputGroup style={{ width: "100%", alignContent: "center" }}>
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
                  <InputGroup style={{ width: "100%", alignContent: "center" }}>
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
              <Tabs
                defaultActiveKey="Roller"
                id="fill-tab-example"
                className="mb-2 custom-tabs"
                fill
              >
                <Tab eventKey="Roller" title="Roller">
                  <FormRollers toastCallBack={toastCallBack} />
                </Tab>
                <Tab eventKey="Rieles" title="Rieles">
                  <FormRieles />
                </Tab>
                <Tab eventKey="Tradicional" title="Tradicional">
                  <FormTradicional />
                </Tab>
              </Tabs>
            </Col>
            <Col>
              <ClienteSeleccted />
              <TablaArticulos />
              {!loading && (
                <Button as={Col} onClick={CrearVenta}>
                  Crear Venta
                </Button>
              )}
            </Col>
          </Row>
          <Row>
            <Col></Col>
            <Col></Col>
          </Row>
        </>
      )}
    </>
  );
};
