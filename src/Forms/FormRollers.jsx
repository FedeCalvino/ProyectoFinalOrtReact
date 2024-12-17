import React, { useEffect, useCallback } from "react";
import { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import "../Routes/Css/CrearVenta.css";
import { useDispatch, useSelector } from "react-redux";
import { selectTelasRoller, selectTelas } from "../Features/TelasReducer";
import { addArticulo } from "../Features/ArticulosReducer";
import { TableRollers } from "../Tables/TableRollers";
import { GoCheckCircle } from "react-icons/go";
import { selectRollerConfig } from "../Features/ConfigReducer";

export const FormRollers = () => {
  const ConfigRoller = useSelector(selectRollerConfig);
  console.log("ConfigRoller", ConfigRoller);
  //opciones de roller
  const CanosRoller = ConfigRoller.canos;
  const LadosCadenas = ConfigRoller.ladosCadena;
  console.log("LadosCadenas",LadosCadenas)
  const Motores = ConfigRoller.motores;
  const Posicion = ConfigRoller.posiciones;
  const TiposCadena = ConfigRoller.tiposCadena;

  console.log("Posicion",Posicion)
  console.log("CanosRoller", CanosRoller);
  //state de roller
  const [AlertaCorAdd, setAlertaCorAdd] = useState(false);
  const [selectedTelaRoler, SetselectedTelaRoler] = useState([]);
  const [selectedTelaMostrarRoler, SetselectedTelaMostrarRoler] = useState([]);
  const [selectedAreaRoler, SetselectedAreaRoler] = useState("");
  const [ComentarioCor, SetComentarioCor] = useState("");
  const [AnchoRoller, setAnchoRoller] = useState("");
  const [LargoRoller, setLargoRoller] = useState("");
  const [CanoRoller, setCanoRoller] = useState("");
  const [MotorRoller, setMotorRoller] = useState("1");
  const [TipoCadena, setTipoCadena] = useState("1");
  const [LadoCadenaRoller, setLadoCadenaRoller] = useState("");
  const [PosicionRoller, setPosicionRoller] = useState("");
  const [selectedColorRoler, setselectedColorRoler] = useState("");
  const [TelasDelTipo, setTelasDelTipo] = useState([]);
  const dispatch = useDispatch();
  const TiposTelas = useSelector(selectTelasRoller);
  const NombreTelas = [];

  TiposTelas.forEach((tela) => {
    let esta = false;
    NombreTelas.forEach((Nombre) => {
      if (Nombre.nombre === tela.nombre) {
        esta = true;
      }
    });
    if (!esta) {
      NombreTelas.push(tela);
    }
  });

  const nuevaCortinaRoler = {
    Ambiente: selectedAreaRoler,
    IdTipoTela: selectedTelaRoler.id,
    Ancho: AnchoRoller,
    Alto: LargoRoller,
    Posicion: parseInt(PosicionRoller),
    PosicionStr: (PosicionRoller && Posicion) && Posicion.find(pos=>pos.posicionId === parseInt(PosicionRoller)).posicion,
    LadoCadena: parseInt(LadoCadenaRoller),
    LadoCadenaStr:(LadoCadenaRoller && LadosCadenas) && LadosCadenas.find(lado=>lado.ladoId === parseInt(LadoCadenaRoller))?.lado,
    cano: parseInt(CanoRoller),
    TuboStr:(CanoRoller && CanosRoller) && CanosRoller.find(cano=>cano.id===parseInt(CanoRoller))?.tipo,
    motor:parseInt(MotorRoller),
    MotorStr:(MotorRoller && Motores) && Motores.find(motor=>motor.idMotor===parseInt(MotorRoller))?.nombre,
    TelaNombre: selectedTelaRoler.Nombre + " " + selectedTelaRoler.Color,
    cadena:parseInt(TipoCadena),
    TipoCadenaStr:(TipoCadena && TiposCadena) && TiposCadena.find(tipos=>tipos.idTipoCadena===parseInt(TipoCadena))?.tipoCadena,
    tipoArticulo: "roller",
    nombre: "Roller",
  };

  console.log("NombreTelas", NombreTelas);

  const handleSelectTela = (e) => {
    //console.log(e.target.value)
    const selectedValue = parseInt(e.target.value, 10);
    console.log(selectedValue);
    const selectedTela = TiposTelas.find((tela) => tela.id === selectedValue);
    console.log(selectedTela);
    console.log("nuevaCortinaRoler", nuevaCortinaRoler);
    SetselectedTelaRoler(selectedTela);
    console.log("selectedTelaID", selectedTela.id);
    setselectedColorRoler(e.target.value);
  };

  const AlertaCorA = () => {
    return <GoCheckCircle style={{ color: "green" }} size={30} />;
  };
  const handleSelectChange = (e) => {
    const selectedValue = parseInt(e.target.value, 10);
    console.log(selectedValue);

    const selectedTela = TiposTelas.find((tela) => tela.id === selectedValue);
    console.log("selectedTela", selectedTela);

    SetselectedTelaMostrarRoler(e.target.value);

    const SetTelas = TiposTelas.filter(
      (Tela) => Tela.nombre === selectedTela.nombre
    );
    console.log("SetTelas", SetTelas);
    setTelasDelTipo(SetTelas);
  };

  function AgregarRoller() {
    console.log(nuevaCortinaRoler)
    dispatch(addArticulo(nuevaCortinaRoler));
  }

  return (
    <>
      <Row>
        <Form.Group as={Col} md="1" style={{ width: "11%" }} noValidate>
          <Form.Label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Ambiente
          </Form.Label>
          <Form.Control
            type="text"
            style={{ textAlign: "center" }}
            value={selectedAreaRoler}
            onChange={(e) => {
              SetselectedAreaRoler(e.target.value);
            }}
            placeholder="Ambiente"
          />
        </Form.Group>
        <Form.Group as={Col} md="1" style={{ width: "11%" }} noValidate>
          <Form.Label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Tela
          </Form.Label>
          <Form.Select
            as={Col}
            md="1"
            aria-label="Default select example"
            onChange={handleSelectChange}
            value={selectedTelaMostrarRoler}
          >
            <option style={{ textAlign: "center" }}></option>
            {Array.isArray(NombreTelas) &&
              NombreTelas.map((Tel) => (
                <option
                  style={{ textAlign: "center" }}
                  value={Tel.id}
                  key={Tel.id}
                >
                  {Tel.nombre}
                </option>
              ))}
          </Form.Select>
        </Form.Group>
        <Form.Group as={Col} md="1" style={{ width: "11%" }} noValidate>
          <Form.Label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Color
          </Form.Label>
          <Form.Select
            as={Col}
            md="1"
            aria-label="Default select example"
            onChange={handleSelectTela}
            value={selectedColorRoler}
          >
            <option style={{ textAlign: "center" }}></option>
            {TelasDelTipo.map((Tel) => (
              <option
                style={{ textAlign: "center" }}
                value={Tel.id}
                key={Tel.id}
              >
                {Tel.color}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
        <Form.Group as={Col} md="1" style={{ width: "10%" }} noValidate>
          <Form.Label
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            Ancho
          </Form.Label>
          <Form.Control
            type="number"
            style={{ textAlign: "center" }}
            value={AnchoRoller}
            onChange={(e) => {
              setAnchoRoller(e.target.value);
            }}
            placeholder="Ancho"
          />
        </Form.Group>
        <Form.Group
          style={{ width: "2%" }}
          as={Col}
          md="1"
          controlId="validationCustom01"
        >
          <p style={{ marginTop: "38px", marginRight: "10px" }}>X</p>
        </Form.Group>
        <Form.Group
          as={Col}
          md="1"
          controlId="validationCustom01"
          style={{ width: "10%" }}
          noValidate
        >
          <Form.Label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Largo
          </Form.Label>
          <Form.Control
            type="number"
            value={LargoRoller}
            style={{ textAlign: "center" }}
            onChange={(e) => {
              setLargoRoller(e.target.value);
            }}
            placeholder="Largo"
          />
        </Form.Group>
        <Form.Group
          as={Col}
          md="1"
          style={{ width: "11%" }}
          controlId="validationCustom01"
          noValidate
        >
          <Form.Label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Posicion
          </Form.Label>
          <Form.Select
            as={Col}
            md="2"
            aria-label="Default select example"
            onChange={(e) => {
              setPosicionRoller(e.target.value);
            }}
            value={PosicionRoller}
          >
            <option style={{ textAlign: "center" }} value=""></option>
            {
             Posicion!=null && Posicion.map(
                (pos)=>(
                  (
                    <option id={pos.posicionId} style={{ textAlign: "center" }} value={pos.posicionId}>
                      {pos.posicion}
                    </option>
                  )
                )
              )
            }
          </Form.Select>
        </Form.Group>
        <Form.Group as={Col} md="1" controlId="validationCustom01" noValidate>
          <Form.Label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Lado Cadena
          </Form.Label>
          <Form.Select
            as={Col}
            md="1"
            aria-label="Default select example"
            onChange={(e) => {
              setLadoCadenaRoller(e.target.value);
            }}
            value={LadoCadenaRoller}
          >
            <option style={{ textAlign: "center" }} value=""></option>
            {LadosCadenas != null &&
              LadosCadenas.map((lado) => (
                <option
                  key={lado.ladoId}
                  style={{ textAlign: "center" }}
                  id={lado.ladoId}
                  value={lado.ladoId}
                >
                  {lado.lado}
                </option>
              ))}
          </Form.Select>
        </Form.Group>
        <Form.Group as={Col} md="1" controlId="validationCustom01" noValidate>
          <Form.Label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Caño
          </Form.Label>
          <Form.Select
            as={Col}
            md="1"
            aria-label="Default select example"
            onChange={(e) => {
              setCanoRoller(e.target.value);
            }}
            value={CanoRoller}
          >
            <option value=""></option>
            {
              CanosRoller!=null && CanosRoller.map(
                (cano)=>(
                  <option id={cano.id} style={{ textAlign: "center" }} value={cano.id}>
                    {cano.tipo}
                  </option>
                )
              )
            }
          </Form.Select>
        </Form.Group>
        <Form.Group as={Col} md="2" controlId="validationCustom01" noValidate>
          <Form.Label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Motores
          </Form.Label>
          <Form.Select
            as={Col}
            md="1"
            aria-label="Default select example"
            onChange={(e) => {
              setMotorRoller(e.target.value);
            }}
            value={MotorRoller}
          >
            <option value="">Sin motor</option>
            {
              Motores!=null && Motores.map(
                (motor)=>(
                  motor.tipo===1 &&
                  <option id={motor.idMotor} style={{ textAlign: "center" }} value={motor.idMotor}>
                    {motor.nombre}
                  </option>
                )
              )
            }
          </Form.Select>
        </Form.Group>
      </Row>
      <Row style={{ marginTop: "1em" }}>
      <Form.Group as={Col} md="2" controlId="validationCustom01" noValidate>
          <Form.Label
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Tipo Cadena
          </Form.Label>
          <Form.Select
            as={Col}
            md="2"
            aria-label="Default select example"
            onChange={(e) => {
              setTipoCadena(e.target.value);
            }}
            style={{marginBottom:"20px"}}
            value={TipoCadena}
          >
            {
              TiposCadena!=null && TiposCadena.map(
                (tipoCadena)=>(
                  <option id={tipoCadena.tipoCadena} style={{ textAlign: "center" }} value={tipoCadena.idTipoCadena}>
                    {tipoCadena.tipoCadena}
                  </option>
                )
              )
            }
          </Form.Select>
        </Form.Group>
        <Form.Group controlId="validationCustom01">
          <div
            style={{
              display: "flex",
              alignItems: "center", // Align items vertically in the center
            }}
          >
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
              md="auto"
              onClick={AgregarRoller}
            >
              Agregar Roller
            </Button>
            {AlertaCorAdd && <AlertaCorA />}
          </div>
        </Form.Group>
      </Row>
      <Row>
        <TableRollers />
      </Row>
    </>
  );
};
