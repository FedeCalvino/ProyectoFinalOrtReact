import React, { useEffect, useCallback } from "react";
import { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import FloatingLabel from "react-bootstrap/FloatingLabel";

import { useDispatch, useSelector } from "react-redux";
import { selectTelasRoller, selectTelas } from "../Features/TelasReducer";
import { addArticulo } from "../Features/ArticulosReducer";
import { TableRollers } from "../Tables/TableRollers";
import { GoCheckCircle } from "react-icons/go";
import { selectRollerConfig } from "../Features/ConfigReducer";
import { TablaArticulos } from "../Tables/TablaArticulos";

export const FormRollers = ({ toastCallBack }) => {
  const ConfigRoller = useSelector(selectRollerConfig);
  //opciones de roller
  const CanosRoller = ConfigRoller.canos;
  const LadosCadenas = ConfigRoller.ladosCadena;
  const Motores = ConfigRoller.motores;
  const Posicion = ConfigRoller.posiciones;
  const TiposCadena = ConfigRoller.tiposCadena;
  const soportes = ConfigRoller.soportes;
  const factoresCadena = ConfigRoller.factorLargoCadena;
  console.log("Posicion", Posicion);
  console.log("CanosRoller", CanosRoller);
  //state de roller
  const [AlertaCorAdd, setAlertaCorAdd] = useState(false);
  const [selectedTelaRoler, SetselectedTelaRoler] = useState([]);
  const [selectedTelaMostrarRoler, SetselectedTelaMostrarRoler] = useState([]);
  const [selectedAreaRoler, SetselectedAreaRoler] = useState("");
  const [ComentarioIns, setComentarioIns] = useState("");
  const [AnchoRoller, setAnchoRoller] = useState("");
  const [LargoRoller, setLargoRoller] = useState("");
  const [CanoRoller, setCanoRoller] = useState("");
  const [MotorRoller, setMotorRoller] = useState("1");
  const [TipoCadena, setTipoCadena] = useState("1");
  const [LargoTipoCadena, setLargoTipoCadena] = useState("1.20");
  const [TipoSoporte, setTipoSoporte] = useState("5");
  const [LadoCadenaRoller, setLadoCadenaRoller] = useState("");
  const [PosicionRoller, setPosicionRoller] = useState("");
  const [selectedColorRoler, setselectedColorRoler] = useState("");
  const [TelasDelTipo, setTelasDelTipo] = useState([]);
  const dispatch = useDispatch();
  const TiposTelas = useSelector(selectTelasRoller);
  const NombreTelas = [];
  const [largoCadena, setlargoCadena] = useState("");

  useEffect(() => {
    setlargoCadena((LargoRoller*LargoTipoCadena).toFixed(3))
  }, [LargoRoller,LargoTipoCadena]);

  useEffect(() => {
    if (MotorRoller !== 1) {
      setTipoCadena("3");
    }
    if (MotorRoller == 1) {
      setTipoCadena("1");
    }
  }, [MotorRoller]);

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
  const soporteObj = {
    idTipo: TipoSoporte,
    cantidad: 2,
  };
  const nuevaCortinaRoler = {
    Ambiente: selectedAreaRoler,
    IdTipoTela: selectedTelaRoler.id,
    Ancho: AnchoRoller,
    Alto: LargoRoller,
    Posicion: parseInt(PosicionRoller),
    PosicionStr:
      PosicionRoller &&
      Posicion &&
      Posicion.find((pos) => pos.posicionId === parseInt(PosicionRoller))
        .posicion,
    LadoCadena: parseInt(LadoCadenaRoller),
    LadoCadenaStr:
      LadoCadenaRoller &&
      LadosCadenas &&
      LadosCadenas.find((lado) => lado.ladoId === parseInt(LadoCadenaRoller))
        ?.lado,
    cano: parseInt(CanoRoller),
    TuboStr:
      CanoRoller &&
      CanosRoller &&
      CanosRoller.find((cano) => cano.id === parseInt(CanoRoller))?.tipo,
    motor: parseInt(MotorRoller),
    MotorStr:
      MotorRoller &&
      Motores &&
      Motores.find((motor) => motor.idMotor === parseInt(MotorRoller))?.nombre,
    TelaNombre: selectedTelaRoler.nombre + " " + selectedTelaRoler.color,
    cadena: parseInt(TipoCadena),
    TipoCadenaStr:
      TipoCadena &&
      TiposCadena &&
      TiposCadena.find((tipos) => tipos.idTipoCadena === parseInt(TipoCadena))
        ?.tipoCadena,
    soporte: soporteObj,
    detalleInstalacion: ComentarioIns,
    factorLargoCadena: Number(LargoTipoCadena),
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

  const validarCampos = () => {
    // Verificar si todos los campos obligatorios tienen valores
    if (
      !selectedAreaRoler ||
      !selectedTelaRoler.id ||
      !AnchoRoller ||
      !LargoRoller ||
      !PosicionRoller ||
      !LadoCadenaRoller ||
      !CanoRoller ||
      !MotorRoller ||
      !TipoCadena ||
      !TipoSoporte
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

  const AgregarRoller = () => {
    // Verificar que los campos estén completos
    if (validarCampos()) {
      console.log(nuevaCortinaRoler);
      dispatch(addArticulo(nuevaCortinaRoler));
    }
  };

  const rowStyle = {
    marginBottom: "15px",
    height: "30px",
  };

  const inputStyle = {
    textAlign: "center",
    width: "300px",
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
                value={AnchoRoller}
                onChange={(e) => setAnchoRoller(e.target.value)}
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
                value={LargoRoller}
                onChange={(e) => setLargoRoller(e.target.value)}
                placeholder="Largo"
                required
              />
            </div>
          </Row>

          {/* Posicion */}
          <Row style={rowStyle}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={labelStyle}>Posicion</p>
              <Form.Control
                as="select"
                style={inputStyle}
                value={PosicionRoller}
                onChange={(e) => setPosicionRoller(e.target.value)}
              >
                <option value=""></option>
                {Posicion?.map((pos) => (
                  <option key={pos.posicionId} value={pos.posicionId}>
                    {pos.posicion}
                  </option>
                ))}
              </Form.Control>
            </div>
          </Row>

          {/* Lado Cadena */}
          <Row style={rowStyle}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={labelStyle}>Lado Cadena</p>
              <Form.Control
                as="select"
                style={inputStyle}
                value={LadoCadenaRoller}
                onChange={(e) => setLadoCadenaRoller(e.target.value)}
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

          {/* Caño */}
          <Row style={rowStyle}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={labelStyle}>Caño</p>
              <Form.Control
                as="select"
                style={inputStyle}
                value={CanoRoller}
                onChange={(e) => setCanoRoller(e.target.value)}
              >
                <option value=""></option>
                {CanosRoller?.map((cano) => (
                  <option key={cano.id} value={cano.id}>
                    {cano.tipo}
                  </option>
                ))}
              </Form.Control>
            </div>
          </Row>

          {/* Motores */}
          <Row style={rowStyle}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={labelStyle}>Motores</p>
              <Form.Control
                as="select"
                style={inputStyle}
                value={MotorRoller}
                onChange={(e) => setMotorRoller(e.target.value)}
              >
                <option value=""></option>
                {Motores?.map(
                  (motor) =>
                    (motor.tipo === 1 || motor.tipo === 0) && (
                      <option key={motor.idMotor} value={motor.idMotor}>
                        {motor.nombre}
                      </option>
                    )
                )}
              </Form.Control>
            </div>
          </Row>

          <Row style={rowStyle}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={labelStyle}>Cadena</p>
              <Form.Control
                as="select"
                style={inputStyle2}
                value={TipoCadena}
                onChange={(e) => setTipoCadena(e.target.value)}
              >
                <option value=""></option>
                {TiposCadena?.map((tipoCadena) => (
                  <option
                    key={tipoCadena.idTipoCadena}
                    value={tipoCadena.idTipoCadena}
                  >
                    {tipoCadena.tipoCadena}
                  </option>
                ))}
              </Form.Control>
            {MotorRoller==1 &&
            <>
              <div style={{ display: "flex", alignItems: "center" }}>
                <Form.Control
                  as="select"
                  style={inputStyle3}
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
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 460,
                  zIndex: 999,
                }}
              >
                <Form.Control
                  type="number"
                  style={inputStyle4}
                  value={largoCadena}
                  readOnly
                />
              </div>
              </>
            }
            </div>
          </Row>
          <Row style={rowStyle}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={labelStyle}>Soportes</p>
              <Form.Control
                as="select"
                style={inputStyle}
                value={TipoSoporte}
                onChange={(e) => setTipoSoporte(e.target.value)}
              >
                {soportes?.map((soporte) => (
                  <option
                    key={soporte.idTipoSoporte}
                    value={soporte.idTipoSoporte}
                  >
                    {soporte.nombre}
                  </option>
                ))}
              </Form.Control>
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
            onClick={AgregarRoller}
          >
            Agregar Roller
          </Button>
          {AlertaCorAdd && <AlertaCorA />}
        </div>
      </Row>
    </div>
  );
};
