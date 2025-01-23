import React, { useEffect, useCallback } from "react";
import { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import "../Routes/Css/CrearVenta.css";
import { useDispatch, useSelector } from "react-redux";
import { selectTelasTradicional } from "../Features/TelasReducer";
import { addArticulo } from "../Features/ArticulosReducer";
import { TablaArticulos } from "../Tables/TablaArticulos";
import { GoCheckCircle } from "react-icons/go";

export const FormTradicional = () => {


  const [selectedTradicional, SetselectedTradicional] = useState([]);
  const [AlertaCorAdd, setAlertaCorAdd] = useState(false);
  const [AnchoTradicionalDer, setAnchoTradicionalDer] = useState("");
  const [ComentarioCor, SetComentarioCor] = useState("");
  const [AnchoTradicional, setAnchoTradicional] = useState("");
  const [LargoTradicionalDER, setLargoTradicionalDER] = useState("");
  const [LargoTradicionalIZQ, setLargoTradicionalIZQ] = useState("");
  const [Largos, setLargos] = useState("1");
  const [Paños, setPaños] = useState("1");
  const [IzqDerTradicional, setIzqDerTradicional] = useState("");
  const [ganchos, setganchos] = useState("");

  const [Motor, setMotor] = useState("");
  const [selectedAreaRoler, SetselectedAreaRoler] = useState("");
  const [BastonesTradicional, setBastonesTradicional] = useState(false);
  const [Pinza, setPinza] = useState("");
  const [motorizadaTradicional, setMotorizadaTradicional] = useState(false);
  const dispatch = useDispatch();
  const TelaTradicional = useSelector(selectTelasTradicional);
  const [selectedTelaMostrarTradicional, SetselectedTelaMostrarTradicional] =
    useState([]);
  const [selectedColorRoler, setselectedColorRoler] = useState("");
  const [TelasDelTipoTradicional, SetTelasDelTipoTradicional] = useState([]);
  const NombreTelas = [];

  //const ConfigTradicional = useSelector(selectConfigTradicional);
  //opciones de roller
  //const Motores = ConfigTradicional.motores;

  TelaTradicional.forEach((tela) => {
    let esta = false;
    NombreTelas.forEach((nombre) => {
      if (nombre.nombre === tela.nombre) {
        esta = true;
      }
    });
    if (!esta) {
      NombreTelas.push(tela);
    }
  });
  console.log("NombreTelas2",NombreTelas)
  const handleSelectTelaTradicional = (e) => {
    //console.log(e.target.value)
    const selectedValue = parseInt(e.target.value, 10);
    const selectedTela = TelaTradicional.find(
      (tela) => tela.Id === selectedValue
    );
    SetselectedTradicional(selectedTela);
    console.log(selectedTela);
    setselectedColorRoler(e.target.value);
    // Obtener el Nombre del objeto seleccionado
    selectedTela ? SetselectedTelaRolerNombre(selectedTela.nombre) : "";
  };

  const AlertaCorA = () => {
    return <GoCheckCircle style={{ color: "green" }} size={30} />;
  };

  const handleSelectChangeTradicional = (e) => {
    const selectedValue = parseInt(e.target.value, 10);

    const selectedTela = TelaTradicional.find(
      (tela) => tela.id === selectedValue
    );
    console.log("tela", selectedTela);

    SetselectedTelaMostrarTradicional(e.target.value);
    const SetTelasTradicional = TelaTradicional.filter(
      (Tela) => Tela.nombre === selectedTela.nombre
    );

    //SetTelasTradicional.sort((a, b) => a.Descripcion.localeCompare(b.Descripcion));
    SetTelasDelTipoTradicional(SetTelasTradicional);
  };

  function AgregarTradicional() {
    const nuevaCortinaTradicional = {
      Ambiente: selectedAreaRoler,
      IdTipoTela: selectedTradicional.Id,
      ancho: AnchoTradicional,
      AnchoDerecho: Paños === "1" ? null : AnchoTradicionalDer,
      Alto: LargoTradicionalIZQ,
      AltoDer: LargoTradicionalDER,
      CantidadPanos: Paños,
      Acumula: Paños === "1" ? IzqDerTradicional : null,
      Pinza: Pinza,
      motorizada: motorizadaTradicional,
      TelaNombre: selectedTradicional.nombre + " " + selectedTradicional.Color,
      detalle: ComentarioCor,
      tipoArticulo: "tradicional",
      nombre: "Cortina",
    };

    dispatch(addArticulo(nuevaCortinaTradicional));
    setAlertaCorAdd(true);
    setTimeout(() => {
      setAlertaCorAdd(false);
    }, 2000);
  }

  const rowStyle = {
    marginBottom: "15px",
  };

  const inputStyle = {
    textAlign: "center",
    width: "300px",
  };

  const labelStyle = {
    marginRight: "15px",
    marginTop: "10px",
    width: "120px",
    textAlign: "right",
  };

  return (
    <>
      {/* Ambiente */}
      <Row style={rowStyle}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <p style={labelStyle}>Ambiente</p>
          <Form.Control
            type="text"
            style={inputStyle}
            value={selectedAreaRoler}
            onChange={(e) => SetselectedAreaRoler(e.target.value)}
            placeholder="Ambiente"
          />
        </div>
      </Row>

      {/* Tela */}
      <Row style={rowStyle}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <p style={labelStyle}>Tela</p>
          <Form.Select
            style={inputStyle}
            aria-label="Default select example"
            onChange={handleSelectChangeTradicional}
            value={selectedTelaMostrarTradicional}
          >
            <option style={{ textAlign: "center" }}></option>
            {NombreTelas.map((Tel) => (
              <option value={Tel.id} key={Tel.id}>
                {Tel.nombre}
              </option>
            ))}
          </Form.Select>
        </div>
      </Row>

      {/* Color */}
      <Row style={rowStyle}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <p style={labelStyle}>Color</p>
          <Form.Select
            style={inputStyle}
            aria-label="Default select example"
            onChange={handleSelectTelaTradicional}
            value={selectedColorRoler}
          >
            <option style={{ textAlign: "center" }}></option>
            {TelasDelTipoTradicional.map((Tel) => (
              <option value={Tel.id} key={Tel.id}>
                {Tel.color}
              </option>
            ))}
          </Form.Select>
        </div>
      </Row>

      {/* Paños */}
      <Row style={rowStyle}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <p style={labelStyle}>Paños</p>
          <Form.Select
            style={{ width: "70px" }}
            value={Paños}
            onChange={(e) => setPaños(e.target.value)}
          >
            <option value="1">1</option>
            <option value="2">2</option>
          </Form.Select>
          {Paños === "1" ? (
            <>
              <p style={labelStyle}>Ancho</p>
              <Form.Control
                type="number"
                style={{ width: "100px" }}
                value={AnchoTradicional}
                onChange={(e) => setAnchoTradicional(e.target.value)}
                placeholder="Ancho"
              />
            </>
          ) : (
            <>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={labelStyle}>Ancho Izquierda</p>
                <Form.Control
                  type="number"
                  style={{ width: "100px" }}
                  value={AnchoTradicional}
                  onChange={(e) => setAnchoTradicional(e.target.value)}
                  placeholder="Ancho"
                />
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <p style={labelStyle}>Ancho Derecha</p>
                <Form.Control
                  type="number"
                  style={{ width: "100px" }}
                  value={AnchoTradicionalDer}
                  onChange={(e) => setAnchoTradicionalDer(e.target.value)}
                  placeholder="Ancho"
                />
              </div>
            </>
          )}
        </div>
      </Row>

      {/* Altos */}
      <Row style={rowStyle}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <p style={labelStyle}>Altos</p>
          <Form.Select
            style={{ width: "70px" }}
            value={Largos}
            onChange={(e) => setLargos(e.target.value)}
          >
            <option value="1">1</option>
            <option value="2">2</option>
          </Form.Select>
          {Largos === "1" ? (
            <>
              <p style={labelStyle}>Alto</p>
              <Form.Control
                type="number"
                style={{ width: "100px" }}
                value={LargoTradicionalIZQ}
                onChange={(e) => setLargoTradicionalIZQ(e.target.value)}
                placeholder="Largo"
              />
            </>
          ) : (
            <>
              <p style={labelStyle}>Alto Izquierdo</p>
              <Form.Control
                type="number"
                style={{ width: "100px" }}
                value={LargoTradicionalIZQ}
                onChange={(e) => setLargoTradicionalIZQ(e.target.value)}
                placeholder="Largo"
              />
              <p style={labelStyle}>Alto Derecho</p>
              <Form.Control
                type="number"
                style={{ width: "100px" }}
                value={LargoTradicionalDER}
                onChange={(e) => setLargoTradicionalDER(e.target.value)}
                placeholder="Largo"
              />
            </>
          )}
        </div>
      </Row>

      {/* Otros Campos */}
      <Row style={rowStyle}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <p style={labelStyle}>Pinza</p>
          <Form.Select
            style={inputStyle}
            value={Pinza}
            onChange={(e) => setPinza(e.target.value)}
          >
            <option value=""></option>
            <option value="Americana 3 pinzas">Americana 3 pinzas</option>
            <option value="Americana 2 pinzas">Americana 2 pinzas</option>
            <option value="Americana 1 pinzas">Americana 1 pinzas</option>
            <option value="Italiana">Italiana</option>
            <option value="Plisadora">Plisadora</option>
            <option value="Ondas">Ondas</option>
            <option value="Italiana x 1.80">Italiana x 1.80</option>
            <option value="Italiana x 2.00">Italiana x 2.00</option>
            <option value="Italiana x 2.50">Italiana x 2.50</option>
          </Form.Select>
        </div>
      </Row>
      <Row style={rowStyle}>
        <p style={labelStyle}>Ganchos</p>
        <Form.Select
          onChange={(e) => setganchos(e.target.value)}
          style={inputStyle}
          value={ganchos}
        >
          <option value="Riel fino">
            Riel fino
          </option>
          <option value="Riel grueso">
            Riel grueso
          </option>
          <option  value="Motorizado">
            Motorizado
          </option>
        </Form.Select>
      </Row>

      {/* Botón y Alerta */}
      <Row className="mt-4">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            style={{
              width: "200px",
              height: "45px",
            }}
            onClick={AgregarTradicional}
          >
            Agregar Tradicional
          </Button>
          {AlertaCorAdd && <AlertaCorA />}
        </div>
      </Row>
    </>
  );
};
