import React, { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import { useDispatch, useSelector } from "react-redux";
import { addArticulo } from "../Features/ArticulosReducer";
import { selectConfigRiel } from "../Features/ConfigReducer";

export const FormRieles = () => {
  const ConfigRiel = useSelector(selectConfigRiel);
  //opciones de roller
  const ladosAcumula = ConfigRiel.ladoAcumula || []; 
  const tipos = ConfigRiel.tipos || [];
  const bastones = ConfigRiel.tiposBastones || [];
  const soportes = ConfigRiel.tiposSoportes|| [];

  const dispatch = useDispatch();
  const [Tipo, setTipo] = useState("1");
  const [selectedAreaRoler, SetselectedAreaRoler] = useState("");
  const [Accionamiento, setAccionamiento] = useState("Manual");
  const [Acumula, setAcumula] = useState("1");
  const [Ancho, setAncho] = useState("");
  const [CantBast, setCantBast] = useState("0");
  const [CantSop, setCantSop] = useState("0");
  const [Armado, setArmado] = useState("");
  const [Soporte, setSoporte] = useState("1");
  const [Comentario, setComentario] = useState("");
  const [Rieles, setRieles] = useState([]);
  const [Baston, setBaston] = useState("5");

  const AgregarRiel = () => {

    const ObjBastones={
      Idtipo:Baston,
      cantidad:CantBast
    }
    const ObjSoporte={
      idTipo:Soporte,
      cantidad:CantSop
    }

    const nuevoRiel = {
      tipoRiel: Tipo,
      TipoRielStr:tipos.find((tipo)=>tipo.tipoId===parseInt(Tipo)).tipo,
      ambiente: selectedAreaRoler,
      ancho: Ancho,
      soportes: ObjSoporte,
      SoporteStr:soportes.find((sop)=>sop.idTipoSoporte===parseInt(Soporte)).nombre,
      ladoAcumula:Acumula,
      AcumulaStr:ladosAcumula.find((acc)=>acc.ladoAcumulaId===parseInt(Acumula)).nombre,
      bastones: ObjBastones,
      BastonesStr: bastones.find((bast)=>bast.idTipoBaton===parseInt(Baston)).nombre,
      detalle: Comentario,
      tipoArticulo: "riel",
      nombre: "Riel",
    };


    console.log("nuevoRiel",nuevoRiel)
    // Despachamos el nuevo estado de Rieles
    dispatch(addArticulo(nuevoRiel));
  };

  const rowStyle = {
    marginBottom: "15px",
    height: "30px",
  };
  const rowStyle2 = {
    marginBottom: "15px",
    marginTop: "25px",
    height: "100px",
    marginLeft: "100px",
    marginRight: "100px",
  };

  const inputStyle = {
    textAlign: "center",
    width: "300px",
  };

  const labelStyle = {
    marginRight: "15px",
    width: "100px",
    textAlign: "right",
    marginTop: "10px",
  };

  const inputStyle3 = {
    marginLeft:"15px",
    textAlign: "center",
    width: "130px",
  };

  return (
    <>
      <Row style={rowStyle}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <p style={labelStyle}>Ambiente</p>
          <Form.Control
            type="text"
            value={selectedAreaRoler}
            style={inputStyle}
            onChange={(e) => {
              SetselectedAreaRoler(e.target.value);
            }}
            placeholder="Ambiente"
          />
        </div>
      </Row>
      <Row style={rowStyle}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <p style={labelStyle}>Ancho</p>
          <Form.Control
            type="number"
            value={Ancho}
            style={inputStyle}
            onChange={(e) => {
              setAncho(e.target.value);
            }}
            placeholder="Ancho"
          />
        </div>
      </Row>
      <Row style={rowStyle}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <p style={labelStyle}>Tipo</p>
          <Form.Select
            onChange={(e) => setTipo(e.target.value)}
            value={Tipo}
            style={inputStyle}
          >
            {tipos.length > 0 &&
              tipos.map((tipo) => (
                <option
                  key={tipo.tipoId}
                  value={tipo.tipoId}
                  style={{ textAlign: "center" }}
                >
                  {tipo.tipo}
                </option>
              ))}
          </Form.Select>
        </div>
      </Row>
      <Row style={rowStyle}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <p style={labelStyle}>Acumula</p>
          <Form.Select
            style={inputStyle}
            onChange={(e) => {
              setAcumula(e.target.value);
            }}
            value={Acumula}
          >
            {ladosAcumula.map((lado) => {
              return (
                <option
                  key={lado.ladoAcumulaId}
                  value={lado.ladoAcumulaId}
                  style={{ textAlign: "center" }}
                >
                  {lado.nombre}
                </option>
              );
            })}
          </Form.Select>
        </div>
      </Row>
      <Row style={rowStyle}>
      <div style={{ display: "flex", alignItems: "center" }}>
          <p style={labelStyle}>Bastones</p>
          <Form.Select
            style={inputStyle}
            onChange={(e) => {
              setBaston(e.target.value);
            }}
            value={Baston}
          >
            {bastones.map((baston) => {
              return (
                <option
                  key={baston.idTipoBaton}
                  value={baston.idTipoBaton}
                  style={{ textAlign: "center" }}
                >
                  {baston.nombre}
                </option>
              );
            })}
          </Form.Select>
          { Baston!=="5" &&
          <div style={{ display: "flex", alignItems: "center" }}>
          <Form.Control

            type="number"
            value={CantBast}
            style={inputStyle3}

            onChange={(e) => {
              setCantBast(e.target.value);
            }}

            placeholder="Cantidad"
          />
        </div>
        }
        </div>
      </Row>
      <Row style={rowStyle}>
      <div style={{ display: "flex", alignItems: "center" }}>
          <p style={labelStyle}>Soportes</p>
          <Form.Select
            style={inputStyle}
            onChange={(e) => {
              setSoporte(e.target.value);
            }}
            value={Soporte}
          >
            {soportes.map((soporte) => {
              return (
                <option
                  key={soporte.idTipoSoporte}
                  value={soporte.idTipoSoporte}
                  style={{ textAlign: "center" }}
                >
                  {soporte.nombre}
                </option>
              );
            })}
          </Form.Select>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Form.Control

              type="number"
              value={CantSop}
              style={inputStyle3}

              onChange={(e) => {
                setCantSop(e.target.value);
              }}

              placeholder="Cantidad"
            />
          </div>
        </div>
      </Row>
      <Row style={rowStyle2}>
        <Form.Group controlId="armado">
          <FloatingLabel controlId="floatingTextarea2" label="Detalles">
            <Form.Control
              as="textarea"
              placeholder="Leave a comment here"
              style={{
                height: "100px",
                border: "1px solid black",
                borderRadius: "5px",
              }}
              value={Comentario}
              onChange={(e) => setComentario(e.target.value)}
            />
          </FloatingLabel>
        </Form.Group>
      </Row>
      <Row className="mt-4">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            style={{
              justifyContent: "center",
              textAlign: "center",
              marginRight: "1em",
              height: "45px",
              marginLeft: "20px",
              width: "200px",
            }}
            type="submit"
            as={Col}
            md="auto" // Adjust width based on content or requirement
            onClick={AgregarRiel}
          >
            Agregar Riel
          </Button>
        </div>
      </Row>
    </>
  );
};
