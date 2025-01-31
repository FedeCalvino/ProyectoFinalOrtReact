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
import { selectConfigTradicional } from "../Features/ConfigReducer";

export const FormTradicional = () => {
  const ConfigTradi = useSelector(selectConfigTradicional);
  //opciones de tradicional

  const Pinzas = ConfigTradi.pinzas;
  const Ganchos = ConfigTradi.ganchos;

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
  const [ganchos, setganchos] = useState("1");

  const [ComentarioIns, setComentarioIns] = useState("");
  
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
    console.log("ganchos",ganchos)
    const ObjGancho={
      nombre: Ganchos.find((gancho)=>gancho.idGanchos===parseInt(ganchos))?.nombre,
      idGanchos:ganchos
    }
    const ObjPinza={
      nombre: Pinzas.find((pinza)=>pinza.idPinza===parseInt(Pinza))?.nombre,
      idPinza:Pinza
    }
    const tela = TelaTradicional.find((tela)=>tela.id===parseInt(selectedColorRoler))
    console.log(tela)
    const nuevaCortinaTradicional = {
      Ambiente: selectedAreaRoler,
      Idtela: tela.id,
      Ancho: AnchoTradicional,
      AnchoDerecho: AnchoTradicionalDer,
      Alto: LargoTradicionalIZQ,
      AltoDerecho: LargoTradicionalDER,
      ganchos:ObjGancho,
      ganchosStr:ObjGancho.nombre,
      cantidadPanos: parseInt(Paños),
      CantidadAltos:parseInt(Largos),
      pinza: ObjPinza,
      pinzaStr:ObjPinza.nombre,
      detalleInstalacion:ComentarioIns,
      TelaNombre: tela.nombre + " " + tela.color,
      detalle: ComentarioCor,
      tipoArticulo: "tradicional",
      nombre: "Tradicional",
    };

    console.log(nuevaCortinaTradicional)
    
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
      <Row style={rowStyle}>
        <Col>
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
        <div style={{ display: "flex", alignItems: "center" }}>
          <p style={labelStyle}>Pinza</p>
          <Form.Select
            style={inputStyle}
            value={Pinza}
            onChange={(e) => setPinza(e.target.value)}
          >
            <option value=""></option>
            {Pinzas.map((pinza)=>(
              <option value={pinza.idPinza} key={pinza.idPinza}>
                {pinza.nombre}
              </option>
            ))}
          </Form.Select>
        </div>
      </Col>
      <Col>
      <FloatingLabel controlId="floatingTextarea2" label="Detalles instalacion">
            <Form.Control
              as="textarea"
              placeholder="Leave a comment here"
              style={{
                height: "200px",
                border: "1px solid black",
                borderRadius: "5px",
              }}
              value={ComentarioIns}
              onChange={(e) => setComentarioIns(e.target.value)}
            />
          </FloatingLabel>
      </Col>
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
              <div style={{ display: "flex", alignItems: "center",marginLeft:"10px" }}>
                <p style={labelStyle}>Ancho Izquierdo</p>
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
      <Row style={rowStyle}>
        <p style={labelStyle}>Ganchos</p>
        <Form.Select
          onChange={(e) => setganchos(e.target.value)}
          style={inputStyle}
          value={ganchos}
        >
          {Ganchos.map((gancho)=>(
            <option value={gancho.idGanchos} key={gancho.idGanchos}>
            {gancho.nombre}
            </option>
          ))}
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
