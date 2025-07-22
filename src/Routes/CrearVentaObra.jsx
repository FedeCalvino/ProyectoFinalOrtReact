import React, { useEffect } from "react";
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
import { Loading } from "../Componentes/Loading";
import { FormRomanas } from "../Forms/FormRomanas";

export const CrearVentaObra = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setloading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const cliente = useSelector(selectCliente);
  const Articulos = useSelector(selectArticulos);
  const [Obra, setObra] = useState("");
  const [DireccObra, setDireccObra] = useState("");
  const [FechaInstalacion, setFechaInstalacion] = useState("");
  const [Creando, setCreando] = useState("");
  const [VentaInfo, setVentaInfo] = useState(null);
  const [ObrasCliente, setObrasCliente] = useState(null);
  const [ObrasSeleccionables, setObrasSeleccionables] = useState(null);
  const [ObraSelecc, setObraSelecc] = useState(0);
  const UrlVenta = "/VentasEP"
  const UrlVentaObra = "/Ventas/ObrasEP"
/*
  const UrlVenta = "http://localhost:8086/Ventas";
  const UrlVentaObra = "http://localhost:8086/Ventas/Obras";
  */
  const NuevaObra = () => {
    setObrasSeleccionables(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`${UrlVentaObra}/${cliente.Id}`);
        const response = await fetch(`${UrlVentaObra}/${cliente.Id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
  
        if (!response.ok) {
          throw new Error("Error al obtener los datos");
        }
  
        const data = await response.json();
        console.log("Obras", data);
  
        // Ahora que data existe, podemos acceder a él
        if (data.body && data.body.length > 0) {
          setObraSelecc(data.body[0].idObra);
        }
  
        setObrasCliente(data.body);
        setObrasSeleccionables(data.body);
      } catch (error) {
        console.error("Error en la solicitud:", error);
      }
    };
  
    if (cliente?.Id) {
      fetchData();
    }
  }, [cliente]);
  

  const CrearVenta = async () => {
    const VentaInfoObj = {
      CliNombre: cliente.Nombre,
      Obra: Obra,
      FechaInstalacion: FechaInstalacion,
      IdObra:ObraSelecc
    };
    console.log(VentaInfoObj)
    
    setVentaInfo(VentaInfoObj);
    setShowModal(true);
  };

  const toastCallBack = (mensaje, tipo) => {
    if (tipo === "error") {
      toast.error(mensaje);
    }
    if (tipo === "success") {
      toast.success(mensaje);
    }
  };

  const ConfirmCrearVenta = async () => {
    if (Articulos.length > 0) {
      setCreando(true);
      setloading(true);
      const loadingToast = toast.loading("Cargando...");
      const obraObj = {
        Idobra: ObraSelecc,
        direccion: DireccObra,
        nombre: Obra,
        ciudad: "",
        cliente,
        barrio: "",
      };
      const VentaModel = {
        Articulos,
        obra: obraObj,
        Id: 1,
        fechaInstalacion: FechaInstalacion,
      };
      console.log("VentaModel", VentaModel);

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
          toast.dismiss(loadingToast);
          setCreando(false);
          toast.error("Error al crea la ventar");
          console.error("Error en la solicitud:", response.statusText);
          return;
        }

        const result = await response.json();
        console.log("Response Venta", result);
        toast.dismiss(loadingToast);
        if (result.status === "OK") {
          dispatch(Reset());
          dispatch(removeAllArticulos());
          navigate("/Ventas");
        } else {
          console.log("error");
          AlertaError(result.message);
          toast.dismiss(loadingToast);
          toast.error("Error al crea la ventar");
        }
        toast.dismiss(loadingToast);
        setCreando(false);
        setloading(false);
      } catch (error) {
        setCreando(false);
        setloading(false);
        toast.dismiss(loadingToast);
        toast.error("Error al crea la ventar");
        AlertaError("Error al realizar la solicitud");
      }
    } else {
      setCreando(false);
      setShowModal(false);
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
          <VentaPreview Venta={VentaInfo} />
          <Row className="button-row">
            <Col className="d-flex justify-content-center">
              {Creando ? (
                <Loading tipo="small" />
              ) : (
                <Button
                  className="custom-button"
                  variant="primary"
                  onClick={() => {
                    ConfirmCrearVenta();
                  }}
                >
                  Crear
                </Button>
              )}
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
              <div style={{ height:"200px" }}>
                {ObrasSeleccionables?.length >= 1 ? (
                  <>
                    <Row>
                      <Col>
                        <h3>Obras</h3>
                      </Col>
                      <Col>
                        <Form.Control
                          as="select"
                          value={ObraSelecc}
                          onChange={(e) => setObraSelecc(e.target.value)}
                        >
                          {ObrasCliente?.map((obra) => (
                            <option key={obra.idObra} value={obra.idObra}>
                              {obra.nombre}
                            </option>
                          ))}
                        </Form.Control>
                      </Col>
                      <Col>
                        <Button as={Col} onClick={NuevaObra}>
                          Nueva Obra
                        </Button>
                      </Col>
                    </Row>
                  </>
                ) : (
                  <>
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
                        fontSize: "20px",
                      }}
                    >
                      <h3 style={{ marginTop: "50px" }}>Obra</h3>
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
                          <h3>Nombre</h3>
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
                          <h3>Instalacion</h3>
                          <Form.Control
                            type="date"
                            value={FechaInstalacion}
                            style={{
                              marginLeft: "10px",
                              textAlign: "center",
                              borderRadius: "10px",
                            }}
                            onChange={(e) =>
                              setFechaInstalacion(e.target.value)
                            }
                          />
                        </InputGroup>
                      </div>
                    </div>
                    <div
                      style={{
                        left: 0,
                        width: "100%",
                        padding: "5px",
                        backgroundColor: "white",
                        zIndex: 999, // Ensures it's on top
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        marginBottom: "10px",
                        fontSize: "20px",
                      }}
                    >
                      <div
                        style={{
                          margin: "0",
                          marginLeft: "20px",
                          display: "flex",
                          justifyContent: "space-around",
                        }}
                      >
                        <InputGroup
                          style={{ width: "100%", alignContent: "center" }}
                        >
                          <h3>Direccion</h3>
                          <Form.Control
                            type="text"
                            value={DireccObra}
                            style={{
                              marginLeft: "10px",
                              textAlign: "center",
                              borderRadius: "10px",
                            }}
                            onChange={(e) => setDireccObra(e.target.value)}
                          />
                        </InputGroup>
                      </div>
                    </div>
                  </>
                )}
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
                  <FormRieles toastCallBack={toastCallBack} />
                </Tab>
                <Tab eventKey="Tradicional" title="Tradicional">
                  <FormTradicional toastCallBack={toastCallBack} />
                </Tab>
                <Tab eventKey="Romana" title="Romana">
                  <FormRomanas toastCallBack={toastCallBack} />
                </Tab>
              </Tabs>
            </Col>
            <Col>
            <div style={{ height:"197px" }}>
              <ClienteSeleccted />
              </div>
              <TablaArticulos />
              {!loading && (
                <div className="d-flex justify-content-center">
                <Button onClick={CrearVenta}>
                  Crear Venta
                </Button>
              </div>
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
