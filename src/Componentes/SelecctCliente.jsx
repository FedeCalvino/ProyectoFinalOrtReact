import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";
import Container from "react-bootstrap/Container";
import { useDispatch, useSelector } from "react-redux";
import { setClienteFeature } from "../Features/ClienteReducer";
import { selectCliente } from "../Features/ClienteReducer";
import Modal from "@mui/material/Modal";
import { ShowClienteSelecc } from "./ShowClienteSelecc";

export const SelecctCliente = React.memo(() => {
  const dispatch = useDispatch();
  const ClienteData = useSelector(selectCliente);
  console.log(ClienteData)
  //CrearCliente
  const [NombreCliN, setCliNomN] = useState(ClienteData.Nombre);
  const [MailCli, setMailCli] = useState(ClienteData.Mail);
  const [TelefonoCliN, setCliTelN] = useState(ClienteData.NumeroTelefono);
  const [RutCliN, setCliRutN] = useState(ClienteData.rut);
  const [DireccCliN, setCliDireccN] = useState(ClienteData.direccion);
  const [KeyTab, setKeyTab] = useState("Crear");
  const [loadingSearch, setloadingSearch] = useState(false);
  const [NombreVacio, setNombreVacio] = useState(false);
  //SeleccCliente
  const [Tipo, setTipo] = useState("Cliente");
  const [TiposClientes, setTiposClientes] = useState([]);
  const UrlCLientesLike = "/ClientesEP/Name/";

  const [showModal, setShowModal] = useState(false);

  const [Clienteselecc, setClienteselecc] = useState(null);
  const [SearchText, setSearchText] = useState("");
  const UrlTipoCLientes = "/ConfiguracionEP/TiposCli";

  const handleClose = () => setShowModal(false);

  const FetchTipoClientes = async () => {
    try {
      const res = await fetch(UrlTipoCLientes);
      const data = await res.json();
      setTiposClientes(data.body);
      console.log(data.body);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    FetchClientesLike();
  }, [SearchText]);

  useEffect(() => {
    FetchTipoClientes();
  }, []);

  const [Clientes, setClientes] = useState([]);

  const FetchClientesLike = async () => {
    try {
      if (SearchText.trim() !== "") {
        setloadingSearch(true);
        const res = await fetch(UrlCLientesLike + SearchText);
        const data = await res.json();
        setClientes(data.body);
        setloadingSearch(false);
        console.log(data);
      } else {
        setClientes([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  function GuardarCliente() {
    if (NombreCliN.trim() === "") {
      setNombreVacio(true);
    } else {
      const NewClienteData = {
        Nombre: NombreCliN,
        direccion: DireccCliN,
        NumeroTelefono: TelefonoCliN,
        rut: RutCliN,
        Tipo: Tipo,
        Mail:MailCli,
        set: true,
      };
      console.log("NewClienteData", NewClienteData);
      dispatch(setClienteFeature(NewClienteData));
    }
  }

  const handleSearchTextChange = (nombre) => {
    console.log(nombre);
    setCliNomN(nombre);
    setSearchText(nombre);
    console.log(SearchText);
  };

  const onSearchTextChange = () => {
    setSearchText(e.target.value);
    console.log("entro");
  };
  const ConfirmSelecc = () => {
    dispatch(setClienteFeature(Clienteselecc));
    setShowModal(false);
  };

  const SelecctCliFromList = (Cli) => {
    const NewClienteData = {
      Id: Cli.id,
      Nombre: Cli.nombre,
      direccion: Cli.direccion,
      NumeroTelefono: Cli.numeroTelefono,
      rut: Cli.rut,
      Tipo: Cli.tipo,
      Mail:Cli.Mail,
      set: true,
    };
    setClienteselecc(NewClienteData);
    console.log(NewClienteData);
    setShowModal(true);
    //dispatch(setClienteFeature(NewClienteData));
  };

  return (
    <>
      <Modal open={showModal} onClose={handleClose}>
        <div
          style={{
            padding: "20px",
            background: "white",
            margin: "100px auto",
            maxWidth: "400px",
            borderRadius: "8px",
          }}
        >
          <div>
            <ShowClienteSelecc Cliente={Clienteselecc} />
          </div>
          <div style={{ marginTop: "20px", display:"flex",justifyContent:"space-between" }}>
            <Button variant="secondary" onClick={handleClose}>
              Volver
            </Button>
            <Button variant="primary" onClick={ConfirmSelecc}>
              Seleccionar
            </Button>
          </div>
        </div>
      </Modal>

      <h3 style={{ marginTop: "90px" }} className="text-center mb-3">
        Crear Cliente
      </h3>
      <Container
        style={{ display: "flex", justifyContent: "center", gap: "20px" }}
      >
        <div style={{ flex: 1, maxWidth: "300px" }}>
          <Form.Group controlId="Nombre" className="mb-3">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              value={NombreCliN}
              onChange={(e) => handleSearchTextChange(e.target.value)}
              isInvalid={NombreVacio}
              autoComplete="off"
            />
            <Form.Control.Feedback type="invalid">
              El nombre no puede estar vacío
            </Form.Control.Feedback>
          </Form.Group>

          <ListGroup
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "15px",
            }}
          >
            {Clientes != null &&
              Clientes.map((Cli) => (
                <ListGroup.Item
                  key={Cli.id}
                  action
                  value={Cli.id}
                  style={{
                    padding: "10px 15px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    textAlign: "center",
                  }}
                  onClick={() => SelecctCliFromList(Cli)}
                >
                  {Cli.nombre}
                </ListGroup.Item>
              ))}
          </ListGroup>
        </div>

        {/* Contenedor derecho */}
        <div style={{ flex: 2 }}>
          <Form>
            <Form.Group controlId="Telefono" className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="number"
                value={TelefonoCliN}
                onChange={(e) => setCliTelN(e.target.value)}
                placeholder="Teléfono"
                autoComplete="off"
              />
            </Form.Group>

            <Form.Group controlId="Rut" className="mb-3">
              <Form.Label>RUT</Form.Label>
              <Form.Control
                type="number"
                value={RutCliN}
                onChange={(e) => setCliRutN(e.target.value)}
                placeholder="RUT"
                autoComplete="off"
              />
            </Form.Group>

            <Form.Group controlId="Direccion" className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                type="text"
                value={DireccCliN}
                onChange={(e) => setCliDireccN(e.target.value)}
                placeholder="Dirección"
                autoComplete="off"
              />
            </Form.Group>

            <Form.Group controlId="Mail" className="mb-3">
              <Form.Label>Mail</Form.Label>
              <Form.Control
                type="text"
                value={MailCli}
                onChange={(e) => setMailCli(e.target.value)}
                placeholder="Mail"
                autoComplete="off"
              />
            </Form.Group>

            <Form.Group controlId="Tipo" className="mb-3">
              <Form.Label>Tipo</Form.Label>
              <Form.Select
                aria-label="Tipo de cliente"
                onChange={(e) => setTipo(e.target.value)}
                value={Tipo}
              >
                {TiposClientes != null &&
                  TiposClientes.map((clitipo) => (
                    <option key={clitipo.idTipoCliente} value={clitipo.tipo}>
                      {clitipo.tipo}
                    </option>
                  ))}
              </Form.Select>
            </Form.Group>

            <Button onClick={GuardarCliente} className="w-100">
              Guardar Cliente
            </Button>
          </Form>
        </div>
      </Container>
    </>
  );
});
