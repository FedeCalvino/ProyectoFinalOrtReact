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
  const Tradicionales = Articulos.filter((art) => art.tipoArticulo === "tradicional");
  const Rieles = Articulos.filter((art) => art.tipoArticulo === "riel");

  const handleDelete = (num) => {
    dispatch(removeArticulo({ numeroArticulo: num }));
  };

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
                {Venta.CliNombre}
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
                {Venta.FechaInstalacion ? Venta.FechaInstalacion : "A confirmar"}
              </h3>
            </Col>
            <Col className="text-center">
              {Venta.Obra && (
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "500",
                    color: "#495057",
                  }}
                >
                  Obra: {Venta.Obra}
                </h3>
              )}
            </Col>
          </Row>
        {CortinasRollers.length !== 0 ? (
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
                  <tr key={Cor.numeroArticulo}>
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
              {Tradicionales.length !== 0 ? (
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
                  <tr key={tradi.numeroArticulo}>
                    <td>{tradi.nombre}</td>
                    <td>{tradi.numeroArticulo}</td>
                    <td>{tradi.Ambiente}</td>
                    <td>{tradi.TelaNombre}</td>
                    <td>{tradi.pinzaStr}</td>
                    <td>{tradi.ganchosStr}</td>
                    <td>{tradi.cantidadPanos}</td>
                    <td>{tradi.cantidadPanos===1 ? tradi.Ancho : "N/A"}</td>
                    <td>{tradi.cantidadPanos!==1 ? tradi.Ancho : "N/A"}</td>
                    <td>{tradi.cantidadPanos!==1 ? tradi.AnchoDerecho : "N/A"}</td>
                    <td>{tradi.CantidadAltos==1 ? tradi.Alto : "N/A"}</td>
                    <td>{tradi.CantidadAltos!==1 ? tradi.Alto : "N/A"}</td>
                    <td>{tradi.CantidadAltos!==1 ? tradi.AltoDerecho : "N/A"}</td>
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
