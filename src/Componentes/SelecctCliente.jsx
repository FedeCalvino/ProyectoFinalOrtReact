import React, { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import InputGroup from "react-bootstrap/InputGroup";
import ListGroup from "react-bootstrap/ListGroup";
import Toast from "react-bootstrap/Toast";
import { useRef } from "react";
import { BuscadorClientes } from "./BuscadorClientes";
import Card from "react-bootstrap/Card";
import Placeholder from "react-bootstrap/Placeholder";
import Spinner from "react-bootstrap/Spinner";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Container from "react-bootstrap/Container";
import { useDispatch, useSelector } from "react-redux";
import { setClienteFeature } from "../Features/ClienteReducer";
import { selectCliente } from "../Features/ClienteReducer";

export const SelecctCliente = React.memo(() => {
  const dispatch = useDispatch();
  const ClienteData = useSelector(selectCliente);
  //CrearCliente
  const [NombreCliN, setCliNomN] = useState();
  const [TelefonoCliN, setCliTelN] = useState();
  const [RutCliN, setCliRutN] = useState();
  const [DireccCliN, setCliDireccN] = useState();
  const [KeyTab, setKeyTab] = useState("Crear");
  const [loadingSearch, setloadingSearch] = useState(false);

  //SeleccCliente
  const [Tipo, setTipo] = useState("Cliente");

  const UrlCLientesLike = "/Cliente/strL/";

  const [SearchText, setSearchText] = useState("");


  const UrlCliente = "http://localhost:8083/Cliente";
  useEffect(() => {
    FetchClientesLike();
  }, [SearchText]);

  const [Clientes, setClientes] = useState([]);

  const FetchClientesLike = async () => {
    try {
      if (SearchText.trim() !== "") {
        setloadingSearch(true);
        const res = await fetch(UrlCLientesLike + SearchText);
        const data = await res.json();
        setClientes(data);
        setloadingSearch(false);
        console.log(data);
      } else {
        setClientes([]);
      }
    } catch (error) {
      console.log(error);
    }
  };
/*
  async function CrearCliente() {
    const RutParse = parseInt(RutCliN, 10);
    const TelParse = parseInt(TelefonoCliN, 10);
    const cliente = {
      rut: RutParse,
      Nombre: NombreCliN,
      NumeroTelefono: TelParse,
      direccion: DireccCliN,
      Tipo: Tipo,
    };
    console.log(cliente);

    const requestOptionsCliente = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cliente),
    };

    try {
      const response = await fetch(UrlCliente, requestOptionsCliente);
      const result = await response.json();
      console.log("Cliente creado", result);
      return result.id;
    } catch (error) {
      console.error("Error al crear el cliente:", error);
      toast.error(`Error al crear el cliente: ${error.message}`, {
        style: {
          background: "#333",
          color: "#fff",
        },
      });
      return null;
    }
  }*/
  function CrearCliente() {
    const NewClienteData = {
        Name: NombreCliN,
        Direcc: DireccCliN,
        Tel: TelefonoCliN,
        Rut: RutCliN,
        Tipo: Tipo,
        set:true
    }
    console.log("NewClienteData",NewClienteData)
    dispatch(setClienteFeature(NewClienteData));
  }

  const handleSearchTextChange = (e) => {
    setSearchText(e.target.value);
    console.log(SearchText);
  };

  const onSearchTextChange = () => {
    setSearchText(e.target.value);
    console.log("entro");
  };

  const SelecctCliFromList = (Cli) => {
    const NewClienteData = {
      Id: Cli.id,
      Name: Cli.nombre,
      Direcc: Cli.direccion,
      Tel: Cli.numeroTelefono,
      Rut: Cli.rut,
      Tipo: Cli.tipo,
      set: true,
    };
    setKeyTab("Selecc");
    dispatch(setClienteFeature(NewClienteData));
  };

  return (
    <>
      <Tabs
        defaultActiveKey={KeyTab}
        id="fill-tab-example"
        as={Col}
        className="mb-2"
        style={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          marginTop: "90px",
        }}
      >
        <Tab eventKey="Selecc" title="Seleccionar Cliente">
          <Row className="justify-content-center mb-3">
            <Col md="3" noValidate>
              <Form.Control
                type="text"
                value={SearchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Buscar..."
              />
            </Col>
            {loadingSearch ? (
              <Col md="1" className="text-center">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </Col>
            ) : null}
          </Row>
          <Row className="justify-content-center mb-3">
            <Col md="4" noValidate>
              <ListGroup>
                {Clientes.map((Cli) => (
                  <ListGroup.Item
                    key={Cli.id}
                    action
                    value={Cli.id}
                    onClick={() => SelecctCliFromList(Cli)}
                  >
                    {Cli.nombre}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
        </Tab>
        <Tab eventKey="Crear" title="Crear Cliente">
          <Container>
            <Row className="justify-content-center mb-3">
              <Col md="4">
                <h3 className="text-center">Crear Cliente</h3>
              </Col>
            </Row>
            <Form>
              <Row className="justify-content-center mb-3">
                <Col md="5" className="border-start">
                  <Form.Group controlId="Nombre">
                    <Form.Label>Nombre</Form.Label>
                    <Form.Control
                      type="text"
                      value={NombreCliN}
                      onChange={(e) => setCliNomN(e.target.value)}
                      placeholder="Nombre"
                    />
                  </Form.Group>
                </Col>
                <Col md="5">
                  <Form.Group controlId="Telefono">
                    <Form.Label>Telefono</Form.Label>
                    <Form.Control
                      type="number"
                      value={TelefonoCliN}
                      onChange={(e) => setCliTelN(e.target.value)}
                      placeholder="Telefono"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="justify-content-center mb-3">
                <Col md="5" className="border-start">
                  <Form.Group controlId="Rut">
                    <Form.Label>RUT</Form.Label>
                    <Form.Control
                      type="number"
                      value={RutCliN}
                      onChange={(e) => setCliRutN(e.target.value)}
                      placeholder="RUT"
                    />
                  </Form.Group>
                </Col>
                <Col md="5">
                  <Form.Group controlId="Direccion">
                    <Form.Label>Direccion</Form.Label>
                    <Form.Control
                      type="text"
                      value={DireccCliN}
                      onChange={(e) => setCliDireccN(e.target.value)}
                      placeholder="Direccion"
                    />
                  </Form.Group>
                </Col>
                <Col md="5">
                  <Form.Group controlId="validationCustom01" noValidate>
                    <Form.Label
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      Tipo
                    </Form.Label>
                    <Form.Select
                      aria-label="Default select example"
                      onChange={(e) => {
                        setTipo(e.target.value);
                      }}
                      value={Tipo}
                    >
                      <option style={{ textAlign: "center" }} value="Cliente">
                        Cliente
                      </option>
                      <option
                        style={{ textAlign: "center" }}
                        value="Constructora"
                      >
                        Constructora
                      </option>
                      <option
                        style={{ textAlign: "center" }}
                        value="Arquitecto"
                      >
                        Arquitecto
                      </option>
                      <option
                        style={{ textAlign: "center" }}
                        value="Interiorista"
                      >
                        Interiorista
                      </option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="justify-content-center">
                <Col md="2">
                  <Button onClick={CrearCliente} className="w-100">
                    Crear Cliente
                  </Button>
                </Col>
              </Row>
            </Form>
          </Container>
        </Tab>
      </Tabs>
    </>
  );
});
