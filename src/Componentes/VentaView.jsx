import React from "react";
import { useState, useEffect, useRef } from "react";
import { Table, Button, Row, Col } from "react-bootstrap";
import { PDFDownloadLink, pdf } from "@react-pdf/renderer";
import { OrdenProduccion } from "./OrdenProduccion";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useSelector } from "react-redux";
import Form from "react-bootstrap/Form";
import {
  selectArticulos,
  selectVenta,
  setArticulos,
  setVenta,
} from "../Features/VentaViewReucer";
import { FormRollers } from "../Forms/FormRollers";
import { EditarCortina } from "./EditarCortina";
import {
  selectRollerConfig,
  selectConfigRiel,
  selectConfigTradicional,
} from "../Features/ConfigReducer";
import { selectTelasRoller, selectTelas, selectTelasTradicional } from "../Features/TelasReducer";
import { useDispatch } from "react-redux";
import { Loading } from "./Loading";
import { TicketCortina } from "./TicketCortina";
import { OrdenInstalacion } from "./OrdenInstalacion";
import { EditarRiel } from "./EditarRiel";
import { EditarTradicional } from "./EditarTradicional";

export const VentaView = ({ callBackToast }) => {
  const dispatch = useDispatch();

  const ConfigRoller = useSelector(selectRollerConfig);

  //opciones de roller
  const CanosRoller = ConfigRoller.canos;
  const LadosCadenas = ConfigRoller.ladosCadena;
  console.log("LadosCadenas", LadosCadenas);
  const Motores = ConfigRoller.motores;
  const Posiciones = ConfigRoller.posiciones;
  const TiposCadenas = ConfigRoller.tiposCadena;


  const ConfigTadicional = useSelector(selectConfigTradicional);
  console.log("ConfigTadicional", ConfigTadicional);
  //opciones de roller
  const Pinzas = ConfigTadicional.pinzas;
  const Ganchos = ConfigTadicional.ganchos;

  const findNameTipoPinza = (id_tipo) => {
    return Pinzas.find((tipo) => tipo.idPinza === parseInt(id_tipo)).nombre;
  };

  const findNameTipoGancho = (id_tipo) => {
    return Ganchos.find((tipo) => tipo.idGanchos === parseInt(id_tipo)).nombre;
  };

  const TiposTelas = useSelector(selectTelasRoller);
  const TiposTelasTradi = useSelector(selectTelasTradicional);
  const tableRef = useRef(null);

  const [showModEditVenal, setEditVen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showModalRiel, setshowModalRiel] = useState(false);

  const Articulos = useSelector(selectArticulos);
  const Rollers = Articulos.filter((art) => art.nombre === "Roller");
  console.log("Rollers", Rollers);

  const Rieles = Articulos.filter((art) => art.tipoArticulo === "riel");
  const Tradicionales = Articulos.filter((art) => art.tipoArticulo === "tradicional");
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

  const [openEdit, setopenEdit] = useState(false);
  const [IdCorEdit, setIdCorEdit] = useState(null);
  const [CortinaEdited, setCortrtinaEdited] = useState([]);
  const [RielEdited, setRielEdited] = useState([]);
  const [TradiEdited, setTradiEdited] = useState([]);

  const [loadingAct, setloadingAct] = useState(false);

  const [CortrtinaTrtyEdited, setCortrtinaTrtyEdited] = useState(null);
  const [RielTryEdited, setRielTryEdited] = useState(null);
  const [TradicionalTryEdited, setTradicionalTryEdited] = useState(null);

  const [Telas, setTelas] = useState([]);

  const Ven = useSelector(selectVenta);
  console.log("Ven", Ven);

  //datos de roller a agregar
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

  //Edit Venta
  const [ObraEdit, setObraEdit] = useState(Ven.obra);
  const [FechaInstEdit, setFechaInstEdit] = useState(Ven.fechaInstalacion);

  const VentasEp = "/VentasEP/"
  //const VentasEp = "http://localhost:8083/Ventas/";

  const VentasEpUpdate = VentasEp+"UpdateFO/"

  const handleShow = (Art) => {
    if(Art.nombre==="Roller"){
      setTradicionalTryEdited(null)
      setRielTryEdited(null)
      setCortrtinaTrtyEdited(Art);
    }
    if(Art.nombre==="Riel"){
      setCortrtinaTrtyEdited(null)
      setTradicionalTryEdited(null)
      setRielTryEdited(Art)
    }
    if(Art.nombre==="Tradicional"){
      setCortrtinaTrtyEdited(null);
      setRielTryEdited(null)
      setTradicionalTryEdited(Art)
    }
    setShowModal(true);
  };

  const ShowModalCallB = () => {
    setopenEdit(false)
    setCortrtinaEdited(null);
    setRielEdited(null)
    setShowModal(false);
  };
  const CortinaEditedFnct = () => {
    setCortrtinaEdited(null)
    setRielEdited(null)
    setCortrtinaTrtyEdited(null);
    setRielTryEdited(null);
    setShowModal(false);
    setopenEdit(false)
    FetchVentaCortinas()
  };

  const handleClose = () => setShowModal(false);
  const handleCloseRiel = () => setshowModalRiel(false);

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

  /*tabla tradicional*/ 

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
    return tradi.CantidadAltos !== 1 ? tradi.alto : "N/A";
  }
  
  function getAltoDerecho(tradi) {
    return tradi.CantidadAltos !== 1 ? tradi.AltoDerecho : "N/A";
  }

  const SetInstalada = async () => {
    setloadingTable(true);
    try {
      const res = await fetch(UrlInstalada + Ven.id, {
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

  const FetchVentaCortinas = async () => {
    console.log("ventas")
    if (Ven.id != null) {
      try {
        const res = await fetch(VentasEp + Ven.id);
        const data = await res.json();

        console.log("articulos", data.body.listaArticulos);

        console.log(data.body);
        console.log()
        dispatch(setArticulos(data.body.listaArticulos));
        dispatch(setVenta(data.body));
      } catch (error) {
        console.log(error);
      }
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
    return CanosRoller.find((cano) => cano.id === idCano)?.tipo;
  };
  const findNameLadoCadena = (idlado) => {
    return LadosCadenas.find((lado) => lado.ladoId === idlado)?.lado;
  };
  const findNameMotor = (idMotor) => {
    return Motores.find((motor) => motor.idMotor === idMotor)?.nombre;
  };
  const findNamePos = (idPos) => {
    return Posiciones.find((pos) => pos.posicionId === idPos)?.posicion;
  };
  const findNameTipoCadena = (idTipoCadena) => {
    return TiposCadenas.find((cad) => cad.idTipoCadena === idTipoCadena)
      .tipoCadena;
  };

  const findTela = (IdTela) => {
    return TiposTelas.find((Tela) => Tela.id === IdTela);
  };
  const findTelaTradi = (IdTela) => {
    return TiposTelasTradi.find((Tela) => Tela.id === IdTela);
  };
  const [Cadena, setCadena] = useState("");

  /* const AddCor = async () => {
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
    const url = UrlAddCor + "/" + Ven.Id;
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
  };*/

  const GetConfiguracionArticulos = () => {
    const listaArticulos = [];
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
      if (newCor.nombre === "Tradicional") {
        newCor.nombreTela=findTelaTradi(newCor.IdTipoTela).nombre
        newCor.coloTela=findTelaTradi(newCor.IdTipoTela).color
        newCor.Pinza.nombre = findNameTipoPinza(newCor.Pinza.idPinza);
        newCor.ganchos.nombre = findNameTipoGancho(newCor.ganchos.idGanchos);
      }

      console.log("ArticuloDesp", newCor);

      listaArticulos.push(newCor);
    });
    return listaArticulos;
  };

  const EditRiel = () => {
    setopenEdit(true);
    setRielEdited(RielTryEdited);
    handleClose();
  };

  const EditCor = () => {
    setopenEdit(true);
    if(CortrtinaTrtyEdited){
      console.log(CortrtinaTrtyEdited);
      setRielEdited(null)
      setTradiEdited(null)
      setCortrtinaEdited(CortrtinaTrtyEdited);
    }
    if(TradicionalTryEdited){
      setCortrtinaEdited(null);
      setRielEdited(null)
      setTradiEdited(TradicionalTryEdited)
    }
    if(RielTryEdited){
      setTradiEdited(null)
      setCortrtinaEdited(null)
      setRielEdited(RielTryEdited)
    }
    handleClose();
  };

  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]); // Retorna solo la parte Base64
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob); // Lee el blob como Data URL
    });
  };

  const callBacktoast = (mensaje, tipo) => {
    callBackToast(mensaje, tipo);
  };

  const DescPdf = () => {
    const datos = {
      fechaInst: Ven.fechaInstalacion,
      obra: Ven.obra,
      cliNomb: Ven.cliente.nombre,
    };

    const ven = {
      listaArticulos: GetConfiguracionArticulos(),
      Datos: datos,
    };

    downloadPDF(ven);
  };
  
  const DescPdfInstalacion = () => {
    const ven = {
      Cliente: Ven.cliente,
      listaArticulos: GetConfiguracionArticulos(),
    };

    downloadPDFInstalacion(ven);
  };

  const downloadPDFInstalacion = async (Ven) => {
    const blob = await pdf(<OrdenInstalacion Venta={Ven} />).toBlob();

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${Ven.Cliente.nombre} O.I.pdf`;

    // Simular el clic en el enlace de descarga
    link.click();

    // Liberar la URL del objeto
    URL.revokeObjectURL(link.href);
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

  const downloadTicket = async () => {
    console.log("Ven", Ven);
    console.log("CortinasRoller", Rollers);
    // Generar el documento PDF utilizando la función `pdf`
    //setloadingTicket(true);

    const blob = await pdf(
      <TicketCortina
        NombreCli={Ven.cliente.nombre}
        Articulos={GetConfiguracionArticulos()}
      />
    ).toBlob();
    const base64PDF = await blobToBase64(blob);
    // Crear un enlace de descarga
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${Ven.cliente.nombre} ETQ.pdf`;

    // Simular el clic en el enlace de descarga
    link.click();

    // Liberar la URL del objeto
    URL.revokeObjectURL(link.href);
    //setloadingTicket(false);
  };

  const confirmEditVen = async () => {
    setloadingAct(true);
    try {
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      };
      let url = "";
      
      if (ObraEdit === "") {
        console.log("EntroObraEdit");
        url = VentasEpUpdate + FechaInstEdit + "/" + "null" + "/" + Ven.id;
        console.log("ObraEdit", ObraEdit);
      } else {
        url = VentasEpUpdate + FechaInstEdit + "/" + ObraEdit + "/" + Ven.id;
      }
  
      const response = await fetch(url, requestOptions);
      const result = await response.json();
      console.log("result", result);
  
      if (result.status === "OK") {
        
        // Crear una copia de Ven antes de modificarlo
        const NewVenta = { ...Ven };
  
        if (ObraEdit !== "") {
          NewVenta.obra = ObraEdit;
        }
        if (FechaInstEdit !== "null") {
          NewVenta.fechaInstalacion = FechaInstEdit;
        }
  
        dispatch(setVenta(NewVenta));
        setloadingAct(false);
        callBackToast("Se actualizó", "success");
        setEditVen(false);

      } else {
        setEditVen(false);
        setloadingAct(false);
        callBackToast("error al actualizar", "error");
      }
    } catch (error) {
      console.log(error);
      setEditVen(false);
      setloadingAct(false);
      callBackToast("error al actualizar", "error");
    }
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
              <h2>
                {CortrtinaTrtyEdited && CortrtinaTrtyEdited.nombre} {RielTryEdited && RielTryEdited.nombre}
              </h2>
            </div>
            {CortrtinaTrtyEdited && (
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
            )}
            {RielTryEdited && (
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
                  <tr key={RielTryEdited.idCortina}>
                    <td>{RielTryEdited.nombre}</td>
                    <td>{RielTryEdited.IdArticulo}</td>
                    <td>{RielTryEdited.ambiente}</td>
                    <td>{RielTryEdited.ancho}</td>
                    <td>{findNameTipoRiel(RielTryEdited.tipoRiel.tipoId)}</td>
                    <td>{RielTryEdited.soportes.nombre}</td>
                    <td>{RielTryEdited.bastones.nombre}</td>
                    <td>
                      {findNameladoAcumula(
                        RielTryEdited.ladoAcumula.ladoAcumulaId
                      )}
                    </td>
                    <td>{RielTryEdited.detalle}</td>
                  </tr>
                </tbody>
              </Table>
            )}
{TradicionalTryEdited && (
  <>
    <Table responsive bordered>
      <thead>
        <tr>
          <th>Tipo</th>
          <th>Num</th>
          <th>Ambiente</th>
          <th>Tela</th>
          <th>Color</th>
          <th>Pinza</th>
          <th>Gancho</th>
          <th>Paños</th>
          <th>Ancho</th>
          <th>Ancho Izquierdo</th>
          <th>Ancho Derecho</th>
          <th>Alto</th>
          <th>Alto Izquierdo</th>
          <th>Alto Derecho</th>
        </tr>
      </thead>
      <tbody>
        <tr key={TradicionalTryEdited.numeroArticulo}>
          <td>{TradicionalTryEdited.nombre}</td>
          <td>{TradicionalTryEdited.numeroArticulo}</td>
          <td>{TradicionalTryEdited.Ambiente}</td>
          <td>{findTelaTradi(TradicionalTryEdited.IdTipoTela).nombre}</td>
          <td>{findTelaTradi(TradicionalTryEdited.IdTipoTela).color}</td>
          <td>{findNameTipoPinza(TradicionalTryEdited.Pinza.idPinza)}</td>
          <td>{findNameTipoGancho(TradicionalTryEdited.ganchos.idGanchos)}</td>
          <td>{TradicionalTryEdited.cantidadPanos}</td>
          <td>{getAncho(TradicionalTryEdited)}</td>
          <td>{getAnchoIzquierdo(TradicionalTryEdited)}</td>
          <td>{getAnchoDerecho(TradicionalTryEdited)}</td>
          <td>{getAlto(TradicionalTryEdited)}</td>
          <td>{getAltoIzquierdo(TradicionalTryEdited)}</td>
          <td>{getAltoDerecho(TradicionalTryEdited)}</td>
        </tr>
      </tbody>
    </Table>
  </>
)}
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

      {openEdit ? (
        <>
          {CortinaEdited && (
            <EditarCortina
              callBackCancel={ShowModalCallB}
              cortinaEdited={CortinaEdited}
              callBacktoast={callBacktoast}
              CortinaEditedFnct={CortinaEditedFnct}
            />
          )}
          {RielEdited && (
            <EditarRiel
              callBackCancel={ShowModalCallB}
              rielEdited={RielEdited}
              callBacktoast={callBacktoast}
              CortinaEditedFnct={CortinaEditedFnct}
            />
          )}
          {TradiEdited && (
            <EditarTradicional
              callBackCancel={ShowModalCallB}
              tradiEdited={TradiEdited}
              callBacktoast={callBacktoast}
              CortinaEditedFnct={CortinaEditedFnct}
            />
          )}
        </>
      ) : (
        <>
          <Row
            className="align-items-center py-3"
            style={{ backgroundColor: "#f8f9fa", borderRadius: "8px" }}
          >
            {showModEditVenal ? (
              <>
                <Col xs={12} md={3} className="text-center">
                  <h1
                    style={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      color: "#343a40",
                    }}
                  >
                    {Ven.cliente ? Ven.cliente.nombre : null}
                  </h1>
                </Col>
                <Col xs={12} md={3} className="text-center">
                  <div className="d-flex align-items-center justify-content-center">
                    <span
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "500",
                        color: "#495057",
                      }}
                    >
                      Instalación:
                    </span>
                    <Form.Control
                      type="date"
                      value={FechaInstEdit}
                      style={{
                        marginLeft: "10px",
                        textAlign: "center",
                        borderRadius: "10px",
                        maxWidth: "150px",
                      }}
                      onChange={(e) => setFechaInstEdit(e.target.value)}
                    />
                  </div>
                </Col>
                <Col xs={12} md={3} className="text-center">
                  <div className="d-flex align-items-center justify-content-center">
                    <h3
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: "500",
                        color: "#495057",
                        marginRight: "10px",
                      }}
                    >
                      Obra:
                    </h3>
                    <input
                      type="text"
                      value={ObraEdit}
                      size={30}
                      onChange={(e) => setObraEdit(e.target.value)}
                      style={{
                        borderRadius: "5px",
                        textAlign: "center",
                        maxWidth: "150px",
                      }}
                    />
                  </div>
                </Col>
                <Col xs={12} md={3} className="text-center">
                  {loadingAct ? (
                    <Loading tipo="small" />
                  ) : (
                    <div className="d-flex justify-content-center">
                      <Button
                        variant="primary"
                        onClick={() => setEditVen(false)}
                        style={{ marginRight: "10px", backgroundColor: "red" }}
                      >
                        Cancelar
                      </Button>
                      <Button variant="primary" onClick={confirmEditVen}>
                        Confirmar
                      </Button>
                    </div>
                  )}
                </Col>
              </>
            ) : (
              <>
                <Col className="text-center">
                  <h1
                    style={{
                      fontSize: "2rem",
                      fontWeight: "bold",
                      color: "#343a40",
                    }}
                  >
                    {Ven.cliente ? Ven.cliente.nombre : null}
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
                    {Ven.fechaInstalacion
                      ? Ven.fechaInstalacion
                      : "A confirmar"}
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
                <Col className="text-center">
                  <Button variant="primary" onClick={() => setEditVen(true)}>
                    Editar
                  </Button>
                </Col>
              </>
            )}
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
                    <th>Largo Cadena</th>
                    <th>Cadena</th>
                    <th>Lado Cadena</th>
                    <th>Posición</th>
                    <th>Motorizado</th>
                  </tr>
                </thead>
                <tbody>
                  {Rollers.map((Cor) => (
                    <tr key={Cor.idRoller} onClick={() => handleShow(Cor)}>
                      <td>{Cor.nombre}</td>
                      <td>{Cor.numeroArticulo}</td>
                      <td>{Cor.Ambiente}</td>
                      <td>{findTela(Cor.IdTipoTela)?.nombre || null}</td>
                      <td>{findTela(Cor.IdTipoTela)?.color}</td>
                      <td>{Cor.ancho?.toFixed(3)}</td>
                      <td>{Cor.AnchoTela?.toFixed(3)}</td>
                      <td>{Cor.AnchoTubo?.toFixed(3)}</td>
                      <td>{findNameCano(Cor.cano?.id)}</td>
                      <td>{Cor.alto?.toFixed(3)}</td>
                      <td>{Cor.AltoTela?.toFixed(3)}</td>
                      <td>1</td>
                      <td>{Cor.LargoCadena?.toFixed(3)}</td>
                      <td>{findNameTipoCadena(Cor.tipoCadena.idTipoCadena)}</td>
                      <td>{findNameLadoCadena(Cor.ladoCadena?.ladoId)}</td>
                      <td>{findNamePos(Cor.posicion?.posicionId)}</td>
                      <td>{findNameMotor(Cor.motorRoller?.idMotor)}</td>
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
                    <tr key={Cor.idCortina} onClick={() =>handleShow(Cor)}>
                      <td>{Cor.nombre}</td>
                      <td>{Cor.numeroArticulo}</td>
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
          { Tradicionales.length>0 && (
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
                <th>Tela</th>
                <th>Color</th>
                <th>Pinza</th>
                <th>Gancho</th>
                <th>Paños</th>
                <th>Ancho</th>
                <th>Ancho Izquierdo</th>
                <th>Ancho Derecho</th>
                <th>Alto</th>
                <th>Alto Izquierdo</th>
                <th>Alto Derecho</th>
              </tr>
            </thead>
            <tbody>
              {Tradicionales.map((tradi) => (
                <tr key={tradi.numeroArticulo} onClick={() =>handleShow(tradi)}>
                  <td>{tradi.nombre}</td>
                  <td>{tradi.numeroArticulo}</td>
                  <td>{tradi.Ambiente}</td>
                  <td>{findTelaTradi(tradi.IdTipoTela).nombre}</td>
                  <td>{findTelaTradi(tradi.IdTipoTela).color}</td>
                  <td>{findNameTipoPinza(tradi.Pinza.idPinza)}</td>
                  <td>{findNameTipoGancho(tradi.ganchos.idGanchos)}</td>
                  <td>{tradi.cantidadPanos}</td>
                  <td>{tradi.cantidadPanos===1 ? tradi.ancho : "N/A"}</td>
                  <td>{tradi.cantidadPanos!==1 ? tradi.ancho : "N/A"}</td>
                  <td>{tradi.cantidadPanos!==1 ? tradi.AnchoDerecho : "N/A"}</td>
                  <td>{tradi.CantidadAltos==1 ? tradi.alto : "N/A"}</td>
                  <td>{tradi.CantidadAltos!==1 ? tradi.alto : "N/A"}</td>
                  <td>{tradi.CantidadAltos!==1 ? tradi.AltoDerecho : "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          )
          }
          <Row>
            <Col className="d-flex justify-content-center">
              <Button variant="primary" onClick={DescPdf}>
                PDF
              </Button>
            </Col>
            <Col className="d-flex justify-content-center">
              <Button
                variant="primary"
                onClick={downloadTicket}
                className="w-auto"
              >
                Tickets
              </Button>
            </Col>
            <Col className="d-flex justify-content-center">
              <Button variant="primary" onClick={DescPdfInstalacion}>
                Orden Instalacion
              </Button>
            </Col>
          </Row>
        </>
      )}
    </>
  );
};
