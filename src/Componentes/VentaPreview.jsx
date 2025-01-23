import React from "react";
import { useState, useEffect, useRef } from "react";
import { Table, Button } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { useSelector } from "react-redux";
import { selectArticulos,removeArticulo } from "../Features/ArticulosReducer";
import { useDispatch } from "react-redux";

export const VentaPreview = ({Venta}) => {
  const Articulos = useSelector(selectArticulos);
    const dispatch = useDispatch()

  const CortinasRollers = Articulos.filter((art) => art.tipoArticulo === "roller");



  const handleDelete = (num) => {
    dispatch(removeArticulo({ numeroArticulo: num }));
  };


  const Rieles = Articulos.filter((art) => art.tipoArticulo === "riel");

  const [CortrtinaTrtyEdited, setCortrtinaTrtyEdited] = useState([]);

  const [AgregarRollerBool, SetAgregarRollerBool] = useState(false);

  const handleShow = (Cor) => {
    setCortrtinaTrtyEdited(Cor);
    setShowModal(true);
  };
  const ShowModalCallB = () => {
    setCortrtinaEdited(null);
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

  const [Cadena, setCadena] = useState("");

  return (
    <>
      <>
        {CortinasRollers.length !== 0 ? (
          <>
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
                  <th>Ancho AF-AF</th>
                  <th>Alto</th>
                  <th>caño</th>
                  <th>cant</th>
                  <th>Lado Cadena</th>
                  <th>posicion</th>
                  <th>Comentarios</th>
                </tr>
              </thead>
              <tbody>
                {CortinasRollers.map((Cor) => (
                  <tr key={Cor.numeroArticulo}>
                     <td>{Cor.nombre}</td>
                    <td>{Cor.numeroArticulo}</td>
                    <td>{Cor.Ambiente}</td>
                    <td>{Cor.TelaNombre}</td>
                    <td>{Cor.Ancho}</td>
                    <td>{Cor.Alto}</td>
                    <td>{Cor.TuboStr}</td>
                    <td>{Cor.LadoCadenaStr}</td>
                    <td>{Cor.TipoCadenaStr}</td>
                    <td>{Cor.PosicionStr}</td>
                    <td>{Cor.MotorStr}</td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(Cor.numeroArticulo)}
                      >
                        Borrar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        ) : null}
        {Rieles.length !== 0 ? (
          <>
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
                    <td>{Cor.numeroArticulo}</td>
                    <td>{Cor.ambiente}</td>
                    <td>{Cor.ancho}</td>
                    <td>{Cor.TipoRielStr}</td>
                    <td>{Cor.SoporteStr}</td>
                    <td>{Cor.BastonesStr}</td>
                    <td>{Cor.AcumulaStr}</td>
                    <td>{Cor.detalle}</td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(Cor.numeroArticulo)}
                      >
                        Borrar
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        ) : null}

        {AgregarRollerBool ? null : (
          <Row className="justify-content-center">
            <Col style={{ width: "100%" }} className="text-center my-2"></Col>
          </Row>
        )}
      </>
    </>
  );
};
