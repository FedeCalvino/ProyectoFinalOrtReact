import React, { useEffect, useMemo, useState } from "react";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { selectArticulos, removeArticulo } from "../Features/ArticulosReducer";
import Button from "react-bootstrap/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import {
  selectRollerConfig,
  selectConfigRiel,
  selectConfigTradicional,
} from "../Features/ConfigReducer";
import {
  selectTelasRoller,
  selectTelas,
  selectTelasTradicional,
} from "../Features/TelasReducer";
export const TablaArticulos = () => {

  const TiposTelas = useSelector(selectTelasRoller);
  const TiposTelasTradi = useSelector(selectTelasTradicional);

  const ConfigRoller = useSelector(selectRollerConfig);

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


  //opciones de roller
  const CanosRoller = ConfigRoller.canos;
  const LadosCadenas = ConfigRoller.ladosCadena;
  console.log("LadosCadenas", LadosCadenas);
  const Motores = ConfigRoller.motores;
  const Posiciones = ConfigRoller.posiciones;
  const TiposCadenas = ConfigRoller.tiposCadena;

  const dispatch = useDispatch();
  const Articulos = useSelector(selectArticulos);
  const [ArtSelecc,setArtSelecc]=useState(null)
  const Cortinas = useMemo(
    () => Articulos.filter((Cortinas) => Cortinas.nombre === "Cortina"),
    [Articulos]
  );
  const [showModal, setShowModal] = useState(false);

  const [CortrtinaTrtyEdited, setCortrtinaTrtyEdited] = useState(null);
  const [RielTryEdited, setRielTryEdited] = useState(null);
  const [TradicionalTryEdited, setTradicionalTryEdited] = useState(null);

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

  const ConfigRiel = useSelector(selectConfigRiel);

  const ladosAcumula = ConfigRiel.ladoAcumula || [];
  const tipos = ConfigRiel.tipos || [];
const soportes=ConfigRiel.tiposSoportes
const bastones=ConfigRiel.tiposBastones
console.log("soportessoportes",soportes)
  const findNameSoporte =(idSoporte)=>{
    return soportes.find((soporte) => soporte.idTipoSoporte === idSoporte)?.nombre;
  }
  const findNameBastones=(idBaston)=>{
    return bastones.find((baston) => baston.idTipoBaton === idBaston)?.nombre;
  }

  const findNameladoAcumula = (idLado) => {
    return ladosAcumula.find((acc) => acc.ladoAcumulaId === parseInt(idLado))
      .nombre;
  };
  const findNameTipoRiel = (id_tipo) => {
    return tipos.find((tipo) => tipo.tipoId === parseInt(id_tipo)).tipo;
  };

  const handleDelete = (num) => {
    //console.log(art)
    dispatch(removeArticulo({ numeroArticulo: num }));
  };

const handleClose=()=>{
  setShowModal(false)
}
  const showArticulo = (Art) => {
    if (Art.nombre === "Roller") {
      setTradicionalTryEdited(null);
      setRielTryEdited(null);
      setCortrtinaTrtyEdited(Art);
    }
    if (Art.nombre === "Riel") {
      setCortrtinaTrtyEdited(null);
      setTradicionalTryEdited(null);
      setRielTryEdited(Art);
    }
    if (Art.nombre === "Tradicional") {
      setCortrtinaTrtyEdited(null);
      setRielTryEdited(null);
      setTradicionalTryEdited(Art);
    }
    setShowModal(true);
  };

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

  return (
    <>
    <Modal
          open={showModal}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
          disableEnforceFocus
          disableAutoFocus
        >
          <Box sx={style}>
            <div>
              <h2>
                {CortrtinaTrtyEdited && CortrtinaTrtyEdited.nombre}{" "}
                {RielTryEdited && RielTryEdited.nombre}
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
                    <td>{findNameTipoRiel(RielTryEdited.tipoRiel)}</td>
                    <td>{findNameSoporte(RielTryEdited.soportes.idTipo)}</td>
                    <td>{findNameBastones(RielTryEdited.bastones.Idtipo)}</td>
                    <td>
                      {
                        RielTryEdited.AcumulaStr
                      }
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
                      <td>
                        {findTelaTradi(TradicionalTryEdited.Idtela).nombre}
                      </td>
                      <td>
                        {findTelaTradi(TradicionalTryEdited.Idtela).color}
                      </td>
                      <td>
                        {findNameTipoPinza(TradicionalTryEdited.pinza.idPinza)}
                      </td>
                      <td>
                        {findNameTipoGancho(
                          TradicionalTryEdited.ganchos.idGanchos
                        )}
                      </td>
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
        <Table responsive>
      <thead>
        <tr>
          <th>Numero</th>
          <th>Articulo</th>
          <th>Area</th>
        </tr>
      </thead>
      <tbody>
        {Articulos.map((Art, index) => (
          <tr key={index} style={{ marginBottom: "1em" }} onClick={()=>showArticulo(Art)}>
            <td>{Art.numeroArticulo}</td>
            <td>{Art.tipoArticulo.toUpperCase()}</td>
            <td>{Art.Ambiente || Art.ambiente}</td>
            <td>
              <Button onClick={() => handleDelete(Art.numeroArticulo)}>
                Borrar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
    </>
   
  );
};
