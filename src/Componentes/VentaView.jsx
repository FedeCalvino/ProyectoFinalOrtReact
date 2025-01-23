import React from "react";
import { useState, useEffect, useRef } from "react";
import { Table, Button, Row, Col } from "react-bootstrap";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import { OrdenProduccion } from "./OrdenProduccion";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import { selectArticulos, selectVenta } from "../Features/VentaViewReucer";
import { FormRollers } from "../Forms/FormRollers";
import { EditarCortina } from "./EditarCortina";
import {
  selectRollerConfig,
  selectConfigRiel,
} from "../Features/ConfigReducer";
import { selectTelasRoller, selectTelas } from "../Features/TelasReducer";

export const VentaView = () => {
  const ConfigRoller = useSelector(selectRollerConfig);
  console.log("ConfigRoller", ConfigRoller);
  //opciones de roller
  const CanosRoller = ConfigRoller.canos;
  const LadosCadenas = ConfigRoller.ladosCadena;
  console.log("LadosCadenas", LadosCadenas);
  const Motores = ConfigRoller.motores;
  const Posiciones = ConfigRoller.posiciones;
  const TiposCadenas = ConfigRoller.tiposCadena;

  const TiposTelas = useSelector(selectTelasRoller);

  const tableRef = useRef(null);
  const input = tableRef.current;
  const [loading, setloading] = useState(true);
  const [loadingAct, setloadingAct] = useState(false);
  const [IdVenta, setIdVenta] = useState(null);
  const [SearchText, setSearchText] = useState("");
  const [Ventas, setVentas] = useState([]);
  const [NumeroCor, setNumeroCor] = useState(false);
  const [ComentarioVenta, setComentarioVenta] = useState("");
  const [showModal, setShowModal] = useState(false);

  const Articulos = useSelector(selectArticulos);
  const Rollers = Articulos.filter((art) => art.nombre === "Roller");
  console.log("Rollers", Rollers);

  const Rieles = Articulos.filter((art) => art.tipoArticulo === "riel");

  const ConfigRiel = useSelector(selectConfigRiel);

  const ladosAcumula = ConfigRiel.ladoAcumula || [];
  const tipos = ConfigRiel.tipos || [];

  const findNameladoAcumula = (idLado) => {
    return ladosAcumula.find((acc) => acc.ladoAcumulaId === parseInt(idLado))
      .nombre;
  };
  const findNameTipoRiel = (id_tipo) => {
    return tipos.find((tipo) => tipo.tipoId === parseInt(id_tipo)).tipo;
  };

  const [loadingTable, setloadingTable] = useState(true);
  const [FilteredVentas, setFilteredVentas] = useState([]);
  const [open, setopen] = useState(false);
  const [openEdit, setopenEdit] = useState(false);
  const [IdCorEdit, setIdCorEdit] = useState(null);
  const [CortinaEdited, setCortrtinaEdited] = useState([]);

  const [CortrtinaTrtyEdited, setCortrtinaTrtyEdited] = useState(null);

  const [Telas, setTelas] = useState([]);

  const Ven = useSelector(selectVenta);
  console.log("Ven", Ven);
  //datos de cortina a agregar
  const [motorizada, setMotorizada] = useState(false);
  const [selectedTelaRoler, SetselectedTelaRoler] = useState([]);
  const [selectedTelaMostrarRoler, SetselectedTelaMostrarRoler] = useState([]);
  const [selectedTelaRolerNombre, SetselectedTelaRolerNombre] = useState("");
  const [selectedAreaRoler, SetselectedAreaRoler] = useState("");
  const [AnchoRoller, setAnchoRoller] = useState("");
  const [LargoRoller, setLargoRoller] = useState("");
  const [CanoRoller, setCanoRoller] = useState("");
  const [IzqDer, setIzqDer] = useState("");
  const [AdlAtr, setAdlAtr] = useState("");

  const UrlAddCor = "/Cortinas/Roller/Add";
  const UrlEditCor = "/Cortinas/Edit";

  const handleShow = (Cor) => {
    setCortrtinaTrtyEdited(Cor);
    setShowModal(true);
  };

  const ShowModalCallB = () => {
    setCortrtinaEdited([]);
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80%",
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  const SetInstalada = async () => {
    setloadingTable(true);
    try {
      const res = await fetch(UrlInstalada + IdVenta, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify the content type
        },
      });

      if (!res.ok) {
        throw new Error("Network response was not ok " + res.statusText);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setloadingTable(false);
      setopen(false);
      FetchVentas();
    }
  };

  const FetchVentaCortinas = () => {};

  const ConfirmEdit = async () => {
    const requestOptions = {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(CortinaEdited),
    };

    const url = `${UrlEditCor}/${IdCorEdit}`;

    console.log("URL de solicitud:", url);
    console.log("Datos a actualizar:", CortinaEdited);

    try {
      const response = await fetch(url, requestOptions);

      if (response.ok) {
        await FetchVentaCortinas();
        setIdCorEdit(null);
        return;
      }
    } catch (error) {
      console.error("Error en cortinas roller:", error);
    }
  };

  const CancelarAddCor = () => {
    SetAgregarRollerBool(false);
    SetselectedTelaRoler("");
    SetselectedTelaMostrarRoler("");
    SetselectedTelaRolerNombre("");
    SetselectedAreaRoler("");
    setAnchoRoller("");
    setLargoRoller("");
    setCanoRoller("");
    setIzqDer("");
    setAdlAtr("");
  };
  const findNameCano = (idCano) => {
    return CanosRoller.find((cano) => cano.id === idCano).tipo;
  };
  const findNameLadoCadena = (idlado) => {
    return LadosCadenas.find((lado) => lado.ladoId === idlado).lado;
  };
  const findNameMotor = (idMotor) => {
    return Motores.find((motor) => motor.idMotor === idMotor).nombre;
  };
  const findNamePos = (idPos) => {
    return Posiciones.find((pos) => pos.posicionId === idPos).posicion;
  };
  const findNameTipoCadena = (idTipoCadena) => {
    return TiposCadenas.find((cad) => cad.idTipoCadena === idTipoCadena)
      .tipoCadena;
  };

  const findTela = (IdTela) => {
    return TiposTelas.find((Tela) => Tela.id === IdTela);
  };

  const Editar = (Cor) => {
    const Telafind = Telas.find(
      (tela) =>
        tela.Nombre === Cor.nombreTela && tela.Descripcion === Cor.colorTela
    );
    console.log("Telafind", Telafind);
    console.log(Cor);
    setIdCorEdit(Cor.id);
    const EditedCortina = {
      Ambiente: Cor.ambiente,
      ancho: Cor.anchoAfuerAfuera,
      alto: Cor.altoCortina,
      Posicion: Cor.posicion,
      LadoCadena: Cor.ladoCadena,
      cadena: Cor.Cadena,
      IdTipoTela: Telafind.id,
      Tubo: Cor.cano,
      motorizada: Cor.motorizada,
    };
    console.log(EditedCortina);
    setCortrtinaEdited(EditedCortina);
  };
  const [Cadena, setCadena] = useState("");

  const AddCor = async (IdVenta) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    };

    const nuevaCortinaRoler = {
      Ambiente: selectedAreaRoler,
      IdTipoTela: selectedTelaRoler.Id,
      ancho: AnchoRoller,
      alto: LargoRoller,
      Posicion: AdlAtr,
      LadoCadena: IzqDer,
      cadena: Cadena,
      Tubo: CanoRoller,
      motorizada: motorizada,
    };

    requestOptions.body = JSON.stringify(nuevaCortinaRoler);

    console.log(nuevaCortinaRoler);
    const url = UrlAddCor + "/" + IdVenta;
    console.log(url);
    try {
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        console.error("Error en cortinas roller");
      } else {
        CancelarAddCor();
        FetchVentaCortinas();
      }

      console.log("result de cortina", result);
      //AgregarCortinaRollerAVenta(result.id, idVenta);
    } catch (error) {
      console.error("Error en cortinas roller:", error);
    }
  };

  const EditCor = () => {
    setopenEdit(true);
    console.log(CortrtinaTrtyEdited);
    setCortrtinaEdited(CortrtinaTrtyEdited);
    handleClose();
  };

  useEffect(() => {
    FetchVentaCortinas();
  }, [IdVenta]);

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]); // Retorna solo la parte Base64
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob); // Lee el blob como Data URL
    });
  };

  const DescPdf = () => {
    const datos = {
      fechaInst: Ven.fechaInstalacion,
      obra: Ven.obra,
      cliNomb: Ven.cliente.nombre,
    };

    const ven = {
      listaArticulos: [],
      Datos: datos,
    };

    Articulos.forEach((cor) => {
      // Deep copy of the original `cor` object to avoid modifying the original
      const newCor = JSON.parse(JSON.stringify(cor));

      if (cor.nombre === "Roller") {
        const nameMotor = findNameMotor(newCor.MotorRoller.idMotor);
        console.log("nameMotor", nameMotor);
        newCor.MotorRoller.nombre = nameMotor;
        console.log("newCor.MotorRoller.nombre", newCor.MotorRoller.nombre);
        newCor.TipoCadena.tipoCadena = findNameTipoCadena(
          newCor.TipoCadena.idTipoCadena
        );
        newCor.cano.tipo = findNameCano(newCor.cano.id);
        newCor.posicion.posicion = findNamePos(newCor.posicion.posicionId);
        newCor.ladoCadena.lado = findNameLadoCadena(newCor.ladoCadena.ladoId);
        const telaArt = TiposTelas.find(
          (tela) => tela.id === newCor.IdTipoTela
        );
        newCor.nombreTela = telaArt.nombre;
        newCor.colorTela = telaArt.color;
      }
      if (newCor.nombre === "Riel") {
        newCor.ladoAcumula.nombre = findNameladoAcumula(
          newCor.ladoAcumula.ladoAcumulaId
        );
        newCor.tipoRiel.tipo = findNameTipoRiel(newCor.tipoRiel.tipoId);
      }

      console.log("ArticuloDesp", newCor);

      ven.listaArticulos.push(newCor);
    });

    downloadPDF(ven);
  };

  const downloadPDF = async (Ven) => {
    const blob = await pdf(<OrdenProduccion Venta={Ven} />).toBlob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${Ven.Datos.cliNomb} O.C.pdf`;

    // Simular el clic en el enlace de descarga
    link.click();

    // Liberar la URL del objeto
    URL.revokeObjectURL(link.href);
  };

  const renderEditableCell = (value, isEditable, onChange) => {
    return isEditable ? (
      <input
        style={{ width: "100px", textAlign: "center" }}
        type="text"
        value={value}
        onChange={onChange}
      />
    ) : (
      value
    );
  };

  return (
    <>
      {
        <Modal
          open={showModal}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <div>
              <h2>Cortina</h2>
            </div>

            <Table responsive>
              <thead
                style={{
                  justifyContent: "center",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                <tr>
                  <th>Tipo</th>
                  <th>Num</th>
                  <th>Ambiente</th>
                  <th>Tela</th>
                  <th>Color</th>
                  <th>Ancho AF-AF</th>
                  <th>Ancho tela</th>
                  <th>Ancho Caño</th>
                  <th>Caño</th>
                  <th>Alto Cortina</th>
                  <th>Alto Tela</th>
                  <th>Cant</th>
                  <th>Cadena</th>
                  <th>Lado Cadena</th>
                  <th>Posición</th>
                </tr>
              </thead>
              <tbody>
                {CortrtinaTrtyEdited && (
                  <tr key={CortrtinaTrtyEdited.idRoller}>
                    <td>{CortrtinaTrtyEdited.nombre}</td>
                    <td>{CortrtinaTrtyEdited.Ambiente}</td>
                    <td>{findTela(CortrtinaTrtyEdited.IdTipoTela).nombre}</td>
                    <td>{findTela(CortrtinaTrtyEdited.IdTipoTela).color}</td>
                    <td>{CortrtinaTrtyEdited.Ancho}</td>
                    <td>{CortrtinaTrtyEdited.AnchoTela}</td>
                    <td>{CortrtinaTrtyEdited.AnchoTubo}</td>
                    <td>{findNameCano(CortrtinaTrtyEdited.cano.id)}</td>
                    <td>{CortrtinaTrtyEdited.alto}</td>
                    <td>{CortrtinaTrtyEdited.AltoTela}</td>
                    <td>1</td>
                    <td>{CortrtinaTrtyEdited.LargoCadena}</td>
                    <td>
                      {findNameLadoCadena(
                        CortrtinaTrtyEdited.ladoCadena.ladoId
                      )}
                    </td>
                    <td>
                      {findNamePos(CortrtinaTrtyEdited.posicion.posicionId)}
                    </td>
                    <td>
                      {findNameMotor(CortrtinaTrtyEdited.motorRoller.idMotor)}
                    </td>
                    <td>{CortrtinaTrtyEdited.Exterior ? "Sí" : "No"}</td>
                  </tr>
                )}
              </tbody>
            </Table>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <Button variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
              <Button variant="primary" onClick={() => EditCor()}>
                Editar
              </Button>
            </div>
          </Box>
        </Modal>
      }
      {CortinaEdited.IdRoller ? (
        <EditarCortina
          callBackCancel={ShowModalCallB}
          cortinaEdited={CortinaEdited}
        />
      ) : (
        <>
          <Row
            className="align-items-center py-3"
            style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}
          >
            <Col className="text-center">
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  color: "#343a40",
                }}
              >
                {Ven.cliente.nombre}
              </h1>
            </Col>
            <Col className="text-center">
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "500",
                  color: "#495057",
                }}
              >
                Instalación:{" "}
                {Ven.fechaInstalacion ? Ven.fechaInstalacion : "A confirmar"}
              </h3>
            </Col>
            <Col className="text-center">
              {Ven.obra && (
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "500",
                    color: "#495057",
                  }}
                >
                  Obra: {Ven.obra}
                </h3>
              )}
            </Col>
          </Row>

          {Rollers.length > 0 && (
            <>
              <Table responsive bordered>
                <thead
                  style={{
                    justifyContent: "center",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  <tr>
                    <th>Tipo</th>
                    <th>Ambiente</th>
                    <th>Tela</th>
                    <th>Color</th>
                    <th>Ancho AF-AF</th>
                    <th>Ancho tela</th>
                    <th>Ancho Caño</th>
                    <th>Caño</th>
                    <th>Alto Cortina</th>
                    <th>Alto Tela</th>
                    <th>Cant</th>
                    <th>Cadena</th>
                    <th>Lado Cadena</th>
                    <th>Posición</th>
                    <th>Motorizado</th>
                    <th>Exterior</th>
                  </tr>
                </thead>
                <tbody>
                  {Rollers.map((Cor) => (
                    <tr key={Cor.idRoller} onClick={() => handleShow(Cor)}>
                      <td>{Cor.nombre}</td>
                      <td>{Cor.Ambiente}</td>
                      <td>{findTela(Cor.IdTipoTela).nombre}</td>
                      <td>{findTela(Cor.IdTipoTela).color}</td>
                      <td>{Cor.ancho}</td>
                      <td>{Cor.AnchoTela}</td>
                      <td>{Cor.AnchoTubo}</td>
                      <td>{findNameCano(Cor.cano.id)}</td>
                      <td>{Cor.alto}</td>
                      <td>{Cor.AltoTela}</td>
                      <td>1</td>
                      <td>{Cor.LargoCadena}</td>
                      <td>{findNameLadoCadena(Cor.ladoCadena.ladoId)}</td>
                      <td>{findNamePos(Cor.posicion.posicionId)}</td>
                      <td>{findNameMotor(Cor.motorRoller.idMotor)}</td>
                      <td>{Cor.Exterior ? "Sí" : "No"}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
          {Rieles.length !== 0 ? (
            <>
              <Table responsive bordered>
                <thead
                  style={{
                    justifyContent: "center",
                    fontFamily: "Arial, sans-serif",
                  }}
                >
                  <tr>
                    <th>Tipo</th>
                    <th>Num</th>
                    <th>Ambiente</th>
                    <th>Ancho</th>
                    <th>Tipo de Riel</th>
                    <th>Soporte</th>
                    <th>Bastones</th>
                    <th>Acumula</th>
                    <th>Detalle</th>
                  </tr>
                </thead>
                <tbody>
                  {Rieles.map((Cor) => (
                    <tr key={Cor.idCortina}>
                      <td>{Cor.nombre}</td>
                      <td>{Cor.IdArticulo}</td>
                      <td>{Cor.ambiente}</td>
                      <td>{Cor.ancho}</td>
                      <td>{findNameTipoRiel(Cor.tipoRiel.tipoId)}</td>
                      <td>{Cor.soportes.nombre}</td>
                      <td>{Cor.bastones.nombre}</td>
                      <td>
                        {findNameladoAcumula(Cor.ladoAcumula.ladoAcumulaId)}
                      </td>
                      <td>{Cor.detalle}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          ) : null}
          <Button variant="primary" onClick={DescPdf}>
            PDF
          </Button>
        </>
      )}
    </>
  );
};
