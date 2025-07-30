import React, { useEffect, useCallback } from "react";
import { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import FloatingLabel from "react-bootstrap/FloatingLabel";

import { useDispatch, useSelector } from "react-redux";
import { selectTelasTradicional, selectTelas } from "../Features/TelasReducer";
import { addArticulo } from "../Features/ArticulosReducer";
import { TableRollers } from "../Tables/TableRollers";
import { GoCheckCircle } from "react-icons/go";
import { selectRollerConfig } from "../Features/ConfigReducer";
import { TablaArticulos } from "../Tables/TablaArticulos";

export const FormRomanas = ({toastCallBack}) => {
  const ConfigRoller = useSelector(selectRollerConfig);
  //opciones de Romana
  const LadosCadenas = ConfigRoller.ladosCadena;
  const factoresCadena = ConfigRoller.factorLargoCadena;

  //state de roller
  const [AlertaCorAdd, setAlertaCorAdd] = useState(false);
  const [selectedTelaRoler, SetselectedTelaRoler] = useState([]);
  const [selectedTelaMostrarRoler, SetselectedTelaMostrarRoler] = useState([]);
  const [selectedAreaRoler, SetselectedAreaRoler] = useState("");
  const [ComentarioIns, setComentarioIns] = useState("");
  const [ladoCadenaRomana, setladoCadenaRomana] = useState(null);
  const [caidasRomana, setcaidasRomana] = useState(null);
  const [distanciaVarillas, setdistanciaVarillas] = useState(null);
  const [AnchoRomana, setAnchoRomana] = useState("");
  const [LargoRomana, setLargoRomana] = useState("");
  const [LargoTipoCadena, setLargoTipoCadena] = useState("1.30");
  const [selectedColorRoler, setselectedColorRoler] = useState("");
  const [TelasDelTipo, setTelasDelTipo] = useState([]);
  const dispatch = useDispatch();
  const TiposTelas = useSelector(selectTelasTradicional);
  const NombreTelas = [];
  const [largoCadena, setlargoCadena] = useState("");
  const [CantidadVarillas, setCantidadVarillas] = useState(null);

  useEffect(() => {
    setlargoCadena((LargoRomana * LargoTipoCadena).toFixed(3));
  }, [LargoRomana, LargoTipoCadena]);


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

  const nuevaCortinaRomana = {
    // --- Atributos para el backend ---
    nombre: "Romana",
    Alto: parseFloat(LargoRomana),
    Ancho: parseFloat(AnchoRomana),
    Idtela: selectedTelaRoler.id,
    Ambiente: selectedAreaRoler,
    detalle: "", // o el campo correspondiente
    detalleInstalacion: ComentarioIns,
    cantvarillas: parseInt(CantidadVarillas),
    caidas: parseInt(caidasRomana),
    LargoCadena: parseFloat(largoCadena),
    factorLargoCadena: parseFloat(LargoTipoCadena),
    ladoCadena: parseInt(ladoCadenaRomana),
    distanciavarillas: parseFloat(distanciaVarillas),
    tipoArticulo: "romana",
    // --- Atributos auxiliares para mostrar en la UI ---
    telaStr: selectedTelaRoler.nombre + " " + selectedTelaRoler.color,
    ladoCadenaStr: LadosCadenas?.find((lado) => lado.ladoId === parseInt(ladoCadenaRomana))?.lado,
    // Puedes agregar más atributos legibles si lo necesitas
    ambienteStr: selectedAreaRoler,
    caidasStr: caidasRomana ? `${caidasRomana} caídas` : "",
    varillasStr: CantidadVarillas ? `${CantidadVarillas} varillas` : "",
    // etc.
  };

  const handleSelectTela = (e) => {
    //console.log(e.target.value)
    const selectedValue = parseInt(e.target.value, 10);
    console.log(selectedValue);
    const selectedTela = TiposTelas.find((tela) => tela.id === selectedValue);
    console.log(selectedTela);
    SetselectedTelaRoler(selectedTela);
    console.log("selectedTelaID", selectedTela.id);
    setselectedColorRoler(e.target.value);
  };

  const validarCampos = () => {
    // Verificar si todos los campos obligatorios tienen valores
    if (
      !selectedAreaRoler ||
      !selectedTelaRoler.id ||
      !AnchoRomana ||
      !LargoRomana ||
      !ladoCadenaRomana ||
      !CantidadVarillas ||
      !distanciaVarillas ||
      !caidasRomana
    ) {
      toastCallBack("completar los campos", "error");
      return false; // Si alguno de los campos no está lleno, retorna false
    }
    return true; // Si todos los campos están completos, retorna true
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

  const AgregarRomana = () => {
    // Verificar que los campos estén completos
    if (validarCampos()) {
      console.log(nuevaCortinaRomana);
      dispatch(addArticulo(nuevaCortinaRomana));
    }
  };

  const rowStyle = {
    marginBottom: "15px",
    height: "30px",
  };
  const rowStyle2 = {
    marginBottom: "15px",
    height: "30px",
    marginTop: "30px",
  };

  const inputStyle = {
    textAlign: "center",
    width: "300px",
  };
  const inputStyle5 = {
    textAlign: "center",
    width: "100px",
  };

  const inputStyle4 = {
    textAlign: "center",
    width: "100px",
  };

  const labelStyle = {
    marginRight: "15px",
    width: "100px",
    marginTop: "10px",
    textAlign: "right",
  };
  const labelStyle2 = {
    marginRight: "15px",
    width: "85px",
    marginTop: "10px",
    textAlign: "right",
  };
  const inputStyle2 = {
    textAlign: "center",
    width: "200px",
  };

  const inputStyle3 = {
    marginLeft: "15px",
    textAlign: "center",
    width: "85px",
  };

  return (
    <div className="p-4">
      <Row>
        <Col>
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
              <Form.Control
                as="select"
                style={inputStyle}
                value={selectedTelaMostrarRoler}
                onChange={handleSelectChange}
              >
                <option value=""></option>
                {Array.isArray(NombreTelas) &&
                  NombreTelas.map((Tel) => (
                    <option key={Tel.id} value={Tel.id}>
                      {Tel.nombre}
                    </option>
                  ))}
              </Form.Control>
            </div>
          </Row>

          {/* Color */}
          <Row style={rowStyle}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={labelStyle}>Color</p>
              <Form.Control
                as="select"
                style={inputStyle}
                value={selectedColorRoler}
                onChange={handleSelectTela}
              >
                <option value=""></option>
                {TelasDelTipo.map((Tel) => (
                  <option key={Tel.id} value={Tel.id}>
                    {Tel.color}
                  </option>
                ))}
              </Form.Control>
            </div>
          </Row>

          {/* Ancho */}
          <Row style={rowStyle}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={labelStyle}>Ancho</p>
              <Form.Control
                type="number"
                style={inputStyle}
                value={AnchoRomana}
                onChange={(e) => setAnchoRomana(e.target.value)}
                placeholder="Ancho"
                required
              />
            </div>
          </Row>

          {/* Largo */}
          <Row style={rowStyle}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={labelStyle}>Largo</p>
              <Form.Control
                type="number"
                style={inputStyle}
                value={LargoRomana}
                onChange={(e) => setLargoRomana(e.target.value)}
                placeholder="Largo"
                required
              />
            </div>
          </Row>

          {/* Lado Cadena */}
          <Row style={rowStyle}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={labelStyle}>Cadena</p>
              <Form.Control
                as="select"
                style={inputStyle}
                value={ladoCadenaRomana}
                onChange={(e) => setladoCadenaRomana(e.target.value)}
              >
                <option value=""></option>
                {LadosCadenas?.map((lado) => (
                  <option key={lado.ladoId} value={lado.ladoId}>
                    {lado.lado}
                  </option>
                ))}
              </Form.Control>
            </div>
          </Row>

          <Row style={rowStyle}>
            <div style={{ display: "flex", alignItems: "center" }}>
            <p style={labelStyle}>Factor Cadena</p>
              <Form.Control
                as="select"
                style={inputStyle5}
                value={LargoTipoCadena}
                onChange={(e) => setLargoTipoCadena(e.target.value)}
              >
                {factoresCadena?.map((factores) => (
                  <option
                    key={factores.idFactorLargoCadena}
                    value={factores.valorFactorLargoCadena}
                  >
                    {factores.valorFactorLargoCadena}
                  </option>
                ))}
              </Form.Control>
              <p style={labelStyle2}>Largo Cadena</p>
              <Form.Control
                type="number"
                style={inputStyle5}
                value={largoCadena}
                readOnly
              />
            </div>
          </Row>
          <Row style={rowStyle2}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={labelStyle}>Caidas</p>
              <Form.Control
                type="number"
                style={inputStyle}
                value={caidasRomana}
                onChange={(e) => setcaidasRomana(e.target.value)}
                placeholder="Caidas"
                required
              />
            </div>
          </Row>
          <Row style={rowStyle}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={labelStyle}>Distancia Varillas</p>
              <Form.Control
                type="number"
                style={inputStyle}
                value={distanciaVarillas}
                onChange={(e) => setdistanciaVarillas(e.target.value)}
                placeholder="Distancia Varillas"
                required
              />
            </div>   
          </Row>
          <Row style={rowStyle}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={labelStyle}>Cantidad Varillas</p>
              <Form.Control
                type="number"
                style={inputStyle}
                value={CantidadVarillas}
                onChange={(e) => setCantidadVarillas(e.target.value)}
                placeholder="Cantidad Varillas"
                required
              />
            </div>   
          </Row>
         
        </Col>
        <Col>
          <FloatingLabel
            controlId="floatingTextarea2"
            label="Detalles instalacion"
          >
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
      {/* Button */}
      <Row className="mt-4">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            style={{
              width: "200px",
              height: "45px",
            }}
            onClick={AgregarRomana}
          >
            Agregar Romana
          </Button>
          {AlertaCorAdd && <AlertaCorA />}
        </div>
      </Row>
    </div>
  );
};
