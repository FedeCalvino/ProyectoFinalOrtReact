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
import { Editor } from "@tinymce/tinymce-react";
import { ClipLoader } from "react-spinners";

export const FormTradicional = ({ toastCallBack }) => {
  const [ordenBool, setordenBool] = useState(false);
  const editorRef = useRef(null);
  const [contenido, setContenido] = useState("");

  const [contenidoActual, setcontenidoActual] = useState("");

  const [pasarContenido, setpasarContenido] = useState(true);
  const ConfigTradi = useSelector(selectConfigTradicional);
  const [loading, setLoading] = useState(true);
  //opciones de tradicional

  const Pinzas = ConfigTradi.pinzas || [];
  const Ganchos = ConfigTradi.ganchos || [];
  const dobladillos = ConfigTradi.dobladillos || [];
  const [selectedTradicional, SetselectedTradicional] = useState([]);
  const [AlertaCorAdd, setAlertaCorAdd] = useState(false);
  const [AnchoTradicionalDer, setAnchoTradicionalDer] = useState("");
  const [ComentarioCor, SetComentarioCor] = useState("");
  const [AnchoTradicional, setAnchoTradicional] = useState("");
  const [LargoTradicionalDER, setLargoTradicionalDER] = useState("");
  const [LargoTradicionalIZQ, setLargoTradicionalIZQ] = useState("");
  const [Largos, setLargos] = useState("1");
  const [Paños, setPaños] = useState("1");

  const [ganchos, setganchos] = useState("1");
  const [dobladillo, setdobladillo] = useState("1");
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

  const ObjGancho = {
    nombre: Ganchos.find((gancho) => gancho.idGanchos === parseInt(ganchos))
      ?.nombre,
    idGanchos: ganchos,
  };
  const ObjPinza = {
    nombre: Pinzas.find((pinza) => pinza.idPinza === parseInt(Pinza))?.nombre,
    idPinza: Pinza,
  };
  const ObjDobladillo = {
    valor: dobladillos.find((dob) => dob.idDobladillo === parseInt(dobladillo))?.valor,
    idDobladillo: dobladillo,
  };
  const tela = TelaTradicional.find(
    (tela) => tela.id === parseInt(selectedColorRoler)
  );


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
  

  const contenidoGenerado = `
      <strong>Ambiente:</strong> ${selectedAreaRoler}<br>
      <strong>Tela:</strong> ${tela?.nombre} ${tela?.color}<br>
      <strong>Cantidad de Paños:</strong> ${parseInt(Paños)}<br>
      ${
        parseInt(Paños) === 1
          ? `
      <strong>Ancho:</strong> ${AnchoTradicional}<br>
      ${
        parseInt(Largos) === 1
          ? `<strong>Alto:</strong> ${LargoTradicionalIZQ}<br>`
          : `
      <strong>Alto Izquierdo:</strong> ${LargoTradicionalIZQ}<br>
      <strong>Alto Derecho:</strong> ${LargoTradicionalDER}<br>
      `
      }
      `
          : `
          <br>
      <strong>Ancho Izquierdo:</strong> ${AnchoTradicional}<br>
      <strong>Ancho Derecho:</strong> ${AnchoTradicionalDer}<br>
      <br>
      ${
        parseInt(Largos) === 1
          ? `<strong>Alto:</strong> ${LargoTradicionalIZQ}<br>`
          : `
      <strong>Alto Izquierdo:</strong> ${LargoTradicionalIZQ}<br>
      <strong>Alto Derecho:</strong> ${LargoTradicionalDER}<br>
      <br>
      `
      }
      `
      }
      <strong>Pinza:</strong> ${ObjPinza.nombre}<br>
      <strong>Ganchos:</strong> ${ObjGancho.nombre}<br>
      <strong>Dobladillo:</strong> ${ObjDobladillo?.valor} <br>
      `;

  //const ConfigTradicional = useSelector(selectConfigTradicional);
  //opciones de roller
  //const Motores = ConfigTradicional.motores;

  const MAX_HEIGHT_PX = 561;

  const handleEditorInput = (e) => {
    const editor = editorRef.current;
    const contentHeight = editor.getBody().scrollHeight;

    if (contentHeight > MAX_HEIGHT_PX) {
      // Elimina lo último ingresado si se pasa del límite
      e.preventDefault();
      editor.undoManager.undo(); // Deshace lo último
      editor.notificationManager.open({
        text: "Alcanzaste el límite de contenido del cuadrante.",
        type: "warning",
        timeout: 2000,
      });
    }
  };

  console.log("NombreTelas2", NombreTelas);

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

  const guardarOrden = () => {
    if (editorRef.current) {
      const texto = editorRef.current.getContent();
      setContenido(texto);
      console.log("Contenido de la orden:", texto);
      // Acá lo podés enviar al backend o convertir a PDF
    }
    setordenBool(false);
  };

  const validarCampos = () => {
    // Verificar si todos los campos obligatorios tienen valores
    if (
      !selectedAreaRoler ||
      !AnchoTradicional ||
      !LargoTradicionalIZQ ||
      !ganchos ||
      !Pinza ||
      !selectedColorRoler
    ) {
      toastCallBack("completar los campos", "error");
      return false;
    }
    if (parseInt(Paños) === 2 && !AnchoTradicionalDer) {
      toastCallBack("completar los campos", "error");
      return false;
    }
    if (parseInt(Largos) === 2 && !LargoTradicionalDER) {
      toastCallBack("completar los campos", "error");
      return false;
    }
    return true; // Si todos los campos están completos, retorna true
  };

  const orden = () => {
    if (validarCampos()) {
      console.log(contenido);
      if (pasarContenido) {
        setContenido(contenidoGenerado);
      }
      setordenBool(true);
    }
  };

  function AgregarTradicional() {
    console.log("ganchos", ganchos);
    console.log(tela);
    const editor = editorRef.current;
    const contenidoActual = editor.getContent();

    const nuevaCortinaTradicional = {
      contenidoProduccion: contenidoActual,
      Ambiente: selectedAreaRoler,
      Idtela: tela.id,
      Ancho: AnchoTradicional,
      AnchoDerecho: AnchoTradicionalDer,
      Alto: LargoTradicionalIZQ,
      AltoDerecho: LargoTradicionalDER,
      ganchos: ObjGancho,
      ganchosStr: ObjGancho.nombre,
      cantidadPanos: parseInt(Paños),
      CantidadAltos: parseInt(Largos),
      pinza: ObjPinza,
      pinzaStr: ObjPinza.nombre,
      detalleInstalacion: ComentarioIns,
      TelaNombre: tela.nombre + " " + tela.color,
      Dobladillo:ObjDobladillo,
      detalle: ComentarioCor,
      tipoArticulo: "tradicional",
      nombre: "Tradicional",
    };

    console.log(nuevaCortinaTradicional);
    setContenido("<p>Escribí la orden de corte acá...</p>");
    dispatch(addArticulo(nuevaCortinaTradicional));
    setAlertaCorAdd(true);
    setpasarContenido(true);
    setTimeout(() => {
      setAlertaCorAdd(false);
    }, 2000);
    setordenBool(false);
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

  const Volver = () => {
    setordenBool(false);
    setpasarContenido(false);
    const editor = editorRef.current;
    const contenidoActual = editor.getContent();
    setContenido(contenidoActual)
  };

  return (
    <>
      {ordenBool ? (
        <div style={{ padding: "2rem" }}>
          <Button
            style={{
              width: "200px",
              height: "45px",
            }}
            onClick={() => {
              Volver();
            }}
          >
            Volver
          </Button>

          <h2>Orden de Corte</h2>
          {loading && <ClipLoader color={"#123abc"} loading={true} size={40} />}
          <div
            style={{
              width: "397px",
              height: "561px",
              border: "1px solid #ccc",
              padding: "8px",
              boxSizing: "border-box",
              overflowY: "auto", // <-- Cambiado a auto para permitir scroll vertical
            }}
          >
            <Editor
              apiKey="9keqzteg52asm01hpxxlhy7gtddv7yrnwm80edgvznfq6mg9"
              onInit={(evt, editor) => {
                editorRef.current = editor;
                setLoading(false);
                editor.on("input", handleEditorInput);
              }}
              initialValue={contenido}
              init={{
                height: "100%",
                width: "100%",
                menubar: false,
                plugins:
                  "advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table paste helpwordcount",
                toolbar:
                  "undo redo | formatselect | bold italic backcolor | " +
                  "alignleft aligncenter alignright alignjustify | " +
                  "bullist numlist outdent indent | removeformat | help",
                content_style: `
                  body {
                    max-height: ${MAX_HEIGHT_PX}px;
                    /* overflow: hidden; */  /* Aquí quita o comenta esta línea */
                    padding: 10px;
                    box-sizing: border-box;
                  }
                `,
              }}
            />
          </div>

          <Button
            style={{
              width: "200px",
              height: "45px",
            }}
            onClick={AgregarTradicional}
          >
            Guardar
          </Button>
        </div>
      ) : (
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
                  {Pinzas.map((pinza) => (
                    <option value={pinza.idPinza} key={pinza.idPinza}>
                      {pinza.nombre}
                    </option>
                  ))}
                </Form.Select>
              </div>
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
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: "10px",
                    }}
                  >
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
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={labelStyle}>Ganchos</p>
              <Form.Select
                onChange={(e) => setganchos(e.target.value)}
                style={inputStyle}
                value={ganchos}
              >
                {Ganchos.map((gancho) => (
                  <option value={gancho.idGanchos} key={gancho.idGanchos}>
                    {gancho.nombre}
                  </option>
                ))}
              </Form.Select>
            </div>
          </Row>
          <Row style={rowStyle}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <p style={labelStyle}>Dobladillo</p>
              <Form.Select
                onChange={(e) => setdobladillo(e.target.value)}
                style={inputStyle}
                value={dobladillo}
              >
                {dobladillos.map((dobladillo) => (
                  <option
                    value={dobladillo.idDobladillo}
                    key={dobladillo.idDobladillo}
                  >
                    {dobladillo?.valor}
                  </option>
                ))}
              </Form.Select>
            </div>
          </Row>

          {/* Botón y Alerta */}
          <Row className="mt-4">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button
                style={{
                  width: "200px",
                  height: "45px",
                }}
                onClick={orden}
              >
                Agregar Tradicional
              </Button>
              {AlertaCorAdd && <AlertaCorA />}
            </div>
          </Row>
        </>
      )}
    </>
  );
};
