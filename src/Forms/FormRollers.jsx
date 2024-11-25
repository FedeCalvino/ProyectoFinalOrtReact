import React, { useEffect, useCallback } from "react";
import { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import "../Routes/Css/CrearVenta.css";
import { useDispatch, useSelector } from 'react-redux';
import {selectTelasRoller,selectTelas} from "../Features/TelasReducer"
import {addArticulo} from "../Features/ArticulosReducer"
import { TableRollers } from "../Tables/TableRollers";
import { GoCheckCircle } from "react-icons/go";

export const FormRollers = () => {
    const [AlertaCorAdd, setAlertaCorAdd] = useState(false);
    const [motorizada, setMotorizada] = useState(false);
    const [selectedTelaRoler, SetselectedTelaRoler] = useState([]);
    const [selectedTelaMostrarRoler, SetselectedTelaMostrarRoler] = useState([]);
    const [selectedAreaRoler, SetselectedAreaRoler] = useState("");
    const [ComentarioCor, SetComentarioCor] = useState("");
    const [AnchoRoller, setAnchoRoller] = useState("");
    const [LargoRoller, setLargoRoller] = useState("");
    const [CanoRoller, setCanoRoller] = useState("");
    const [IzqDer, setIzqDer] = useState("");
    const [AdlAtr, setAdlAtr] = useState("");
    const [selectedColorRoler, setselectedColorRoler] = useState("");
    const [TelasDelTipo,setTelasDelTipo]=useState([])
    const dispatch = useDispatch()
    const TiposTelas = useSelector(selectTelasRoller)
    const NombreTelas = [];

    TiposTelas.forEach(tela => {
        let esta = false;
        NombreTelas.forEach(Nombre => {
            if (Nombre.Nombre === tela.Nombre) {
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
        Posicion: AdlAtr,
        LadoCadena: IzqDer,
        Tubo: CanoRoller,
        motorizada: motorizada,
        TelaNombre: selectedTelaRoler.Nombre + " "+selectedTelaRoler.Color,
        LargoCadena:"10",
        detalle: ComentarioCor,
        tipoArticulo:"roller",
        nombre:"Cortina",
    };
    
    console.log("NombreTelas",NombreTelas)

    const handleSelectTela = (e) => {
        //console.log(e.target.value)
        const selectedValue = parseInt(e.target.value, 10);
        console.log(selectedValue)
        const selectedTela = TiposTelas.find((tela) => tela.id === selectedValue);
        console.log(selectedTela)
        console.log("nuevaCortinaRoler",nuevaCortinaRoler)
        SetselectedTelaRoler(selectedTela);
        console.log("selectedTelaID",selectedTela.id);
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
      
        const SetTelas = TiposTelas.filter((Tela) => Tela.Nombre === selectedTela.Nombre);
        console.log("SetTelas", SetTelas);
      
        setTelasDelTipo(SetTelas);
      };
      

    function AgregarRoller() {
        dispatch(addArticulo(nuevaCortinaRoler))
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
              {Array.isArray(NombreTelas) && NombreTelas.map((Tel) => (
                <option
                  style={{ textAlign: "center" }}
                  value={Tel.id}
                  key={Tel.id}
                >
                  {Tel.Nombre}
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
                  {Tel.Color}
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
                setAdlAtr(e.target.value);
              }}
              value={AdlAtr}
            >
              <option style={{ textAlign: "center" }} value=""></option>
              <option style={{ textAlign: "center" }} value="adelante">
                Adelante
              </option>
              <option style={{ textAlign: "center" }} value="pegada">
                Pegada
              </option>
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
                setIzqDer(e.target.value);
              }}
              value={IzqDer}
            >
              <option style={{ textAlign: "center" }} value=""></option>
              <option style={{ textAlign: "center" }} value="izquierda">
                Izquierda
              </option>
              <option style={{ textAlign: "center" }} value="derecha">
                Derecha
              </option>
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
              <option style={{ textAlign: "center" }} value="30">
                30
              </option>
              <option style={{ textAlign: "center" }} value="38">
                38
              </option>
              <option style={{ textAlign: "center" }} value="43">
                43
              </option>
              <option style={{ textAlign: "center" }} value="45">
                45
              </option>
            </Form.Select>
          </Form.Group>
          <Form.Group as={Col} md="2" controlId="validationCustom01">
            <Form.Check
              style={{ marginLeft: "2em", marginTop: "2em", transform: 'scale(1.2)' }} // prettier-ignore
              type="switch"
              checked={motorizada}
              onChange={(e) => {
                setMotorizada(e.target.checked);
                console.log(motorizada);
              }}
              id="custom-switch"
              label="Motorizada"
            />
          </Form.Group>
        </Row>
        <Row style={{ marginTop: "1em" }}>
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
                    <TableRollers/>
                  </Row>
      </>
  )
}
