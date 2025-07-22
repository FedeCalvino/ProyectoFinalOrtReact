import React, { useEffect, useState ,useRef} from "react";
import { Table, Form, FloatingLabel, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import "../Routes/Css/EditarCortina.css";
import { selectConfigTradicional } from "../Features/ConfigReducer";
import { selectTelasTradicional } from "../Features/TelasReducer";
import { Editor } from "@tinymce/tinymce-react";

export const EditarTradicional = ({
  callBackCancel,
  tradiEdited,
  callBacktoast,
  CortinaEditedFnct,
}) => {

  const [contenido, setcontenido] = useState(tradiEdited.contenidoProduccion);
  const editorRef = useRef(null);

  const inputStyle = {
    textAlign: "center",
    width: "300px",
  };

  const rowStyle = {
    marginBottom: "15px",
    display: "flex",
  };

  const labelStyle = {
    marginRight: "15px",
    marginTop: "10px",
    width: "120px",
    textAlign: "right",
  };

  const [Tradi, setTradi] = useState(tradiEdited);
console.log("Tradi",Tradi)
  const TradicionalConfig = useSelector(selectConfigTradicional);
  const TelaTradicional = useSelector(selectTelasTradicional);
  const telaTradi = TelaTradicional.find(
    (tela) => tela.id === Tradi.IdTipoTela
  );
  console.log("telaTradi", telaTradi);

  const [selectedTelaMostrarTradicional, SetselectedTelaMostrarTradicional] = useState(telaTradi.id);
  console.log("selectedTelaMostrarTradicional",selectedTelaMostrarTradicional)
  const [TelasDelTipoTradicional, SetTelasDelTipoTradicional] = useState([]);

  const Pinzas = TradicionalConfig.pinzas || [];
  const ganchos = TradicionalConfig.ganchos || [];

  const EditarCortinaUrl = "/TradicionalEp/";
  //const EditarCortinaUrl = "http://localhost:8086/Tradicional/";
  const [ComentarioIns, setComentarioIns] = useState(Tradi.detalleInstalacion);
  const [selectedColorRoler, setselectedColorRoler] = useState(telaTradi.id);
  const [GanchoTradi, setGanchoTradi] = useState(Tradi.ganchos.idGanchos);
  const [PinzaTradi, setPinzaTradi] = useState(Tradi.Pinza.idPinza);

  useEffect(() => {
    setTradi(tradiEdited);
  }, [tradiEdited]);

  const handleInputChange = (e, field) => {
    const value = e.target.value;

    setTradi((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

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

  const handleSelectTelaTradicional = (e) => {
    //console.log(e.target.value)
    const selectedValue = parseInt(e.target.value, 10);
    const selectedTela = TelaTradicional.find(
      (tela) => tela.Id === selectedValue
    );
    console.log(selectedTela);
    setselectedColorRoler(e.target.value);
    // Obtener el Nombre del objeto seleccionado
    selectedTela ? SetselectedTelaRolerNombre(selectedTela.nombre) : "";
  };

  const AlertaCorA = () => {
    return <GoCheckCircle style={{ color: "green" }} size={30} />;
  };

  useEffect(() => {

    SetselectedTelaMostrarTradicional(telaTradi.id)
    const SetTelasTradicional = TelaTradicional.filter(
      (Tela) => Tela.nombre === telaTradi.nombre
    );
    SetTelasDelTipoTradicional(SetTelasTradicional);

  }, []);

  const handleSelectChangeTradicionalTela = (e) => {
    const selectedValue = parseInt(e.target.value, 10);
    const selectedTela = TelaTradicional.find(
      (tela) => tela.id === selectedValue
    );
    console.log("tela", selectedTela);
    SetselectedTelaMostrarTradicional(e.target.value);
    const SetTelasTradicional = TelaTradicional.filter(
      (Tela) => Tela.nombre === selectedTela.nombre
    );
    SetTelasDelTipoTradicional(SetTelasTradicional);
  };

  const transformarTradi = (tradi) => {
    const ObjGancho={
        nombre: ganchos.find((gancho)=>gancho.idGanchos===parseInt(GanchoTradi))?.nombre,
        idGanchos:GanchoTradi
      }
      const ObjPinza={
        nombre: Pinzas.find((pinza)=>pinza.idPinza===parseInt(PinzaTradi))?.nombre,
        idPinza:PinzaTradi
      }
    console.log(tradi.AnchoDerecho)
    console.log(Tradi.CantidadAltos)
    return {
      Ambiente: tradi.ambiente,
      Idtela: selectedColorRoler,
      Ancho: tradi.ancho,
      AnchoDerecho: parseInt(Tradi.CantidadPanos)===1 ? null : tradi.AnchoDerecho,
      Alto: tradi.alto,
      AltoDerecho: parseInt(Tradi.CantidadAltos)===1 ? null : tradi.AltoDerecho,
      ganchos: ObjGancho,
      CantidadPanos: tradi.CantidadPanos,
      CantidadAltos: Tradi.CantidadAltos,
      pinza: ObjPinza,
      detalleInstalacion: ComentarioIns,
      tipoArticulo: "tradicional",
      nombre: "Tradicional",
      contenidoProduccion: editorRef.current.getContent(),
    };
  };

  const handleConfirmEdit = () => {
    const TradiObj = transformarTradi(Tradi);
    console.log("TradiObj", TradiObj);
    Editar(TradiObj);
  };

  const Editar = async (tradi) => {
    try {
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tradi),
      };
      console.log("url",EditarCortinaUrl + Tradi.IdArticulo +"/"+Tradi.IdCortina)

      const response = await fetch(
        EditarCortinaUrl + Tradi.IdArticulo +"/"+Tradi.IdCortina,
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Error en la actualización del tradicional");
      }

      const result = await response.json();
      console.log("Respuesta:", result);
      callBacktoast("Riel actualizado", "success");
      CortinaEditedFnct();
    } catch (error) {
      console.error("Error:", error);
      callBacktoast("Error al actualizar", "error");
    }
  };

  return (
    <>
      <div>
        <Table responsive>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Ambiente</th>
              <th>Tela</th>
              <th>Color</th>
              <th>Pinza</th>
              <th>Tipo riel</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{Tradi.nombre}</td>
              <td>
                <input
                  type="text"
                  value={Tradi.ambiente}
                  size={15}
                  onChange={(e) => handleInputChange(e, "ambiente")}
                />
              </td>
              <td>
                <Form.Select
                  style={inputStyle}
                  aria-label="Default select example"
                  onChange={handleSelectChangeTradicionalTela}
                  value={selectedTelaMostrarTradicional}
                >
                  <option style={{ textAlign: "center" }}></option>
                  {NombreTelas.map((Tel) => (
                    <option value={Tel.id} key={Tel.id}>
                      {Tel.nombre}
                    </option>
                  ))}
                </Form.Select>
              </td>
              <td>
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
              </td>
              <td>
                <Form.Select
                  value={PinzaTradi}
                  onChange={(e) => setPinzaTradi(e.target.value)}
                >
                  {Pinzas.map((pinza) => (
                    <option key={pinza.idPinza} value={pinza.idPinza}>
                      {pinza.nombre}
                    </option>
                  ))}
                </Form.Select>
              </td>
              <td>
                <Form.Select
                  value={GanchoTradi}
                  onChange={(e) => setGanchoTradi(e.target.value)}
                >
                  {ganchos.map((gancho) => (
                    <option key={gancho.idGanchos} value={gancho.idGanchos}>
                      {gancho.nombre}
                    </option>
                  ))}
                </Form.Select>
              </td>
            </tr>
          </tbody>
        </Table>

        <Row style={rowStyle}>
          <Col className="d-flex justify-content-center">
            <p style={labelStyle}>Paños</p>
            <Form.Select
              style={{ width: "70px" }}
              value={Tradi.CantidadPanos}
              onChange={(e) => handleInputChange(e, "CantidadPanos")}
            >
              <option value="1">1</option>
              <option value="2">2</option>
            </Form.Select>
            {parseInt(Tradi.CantidadPanos) === 1 ? (
              <>
                <p style={labelStyle}>Ancho</p>
                <Form.Control
                  type="number"
                  style={{ width: "100px" }}
                  value={Tradi.ancho}
                  onChange={(e) => handleInputChange(e, "ancho")}
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
                    value={Tradi.ancho}
                    onChange={(e) => handleInputChange(e, "ancho")}
                    placeholder="Ancho izquierdo"
                  />
                </div>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <p style={labelStyle}>Ancho Derecha</p>
                  <Form.Control
                    type="number"
                    style={{ width: "100px" }}
                    value={Tradi.AnchoDerecho}
                    onChange={(e) => handleInputChange(e, "AnchoDerecho")}
                    placeholder="Ancho derecho"
                  />
                </div>
              </>
            )}
          </Col>
        </Row>

        {/* Altos */}
        <Row style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Col className="d-flex justify-content-center">
            <p style={labelStyle}>Altos</p>
            <Form.Select
              style={{ width: "70px" }}
              value={Tradi.CantidadAltos}
              onChange={(e) => handleInputChange(e, "CantidadAltos")}
            >
              <option value="1">1</option>
              <option value="2">2</option>
            </Form.Select>
            {parseInt(Tradi.CantidadAltos) === 1 ? (
              <>
                <p style={labelStyle}>Alto</p>
                <Form.Control
                  type="number"
                  style={{ width: "100px" }}
                  value={Tradi.alto}
                  onChange={(e) => handleInputChange(e, "alto")}
                  placeholder="Alto"
                />
              </>
            ) : (
              <>
                <p style={labelStyle}>Alto Izquierdo</p>
                <Form.Control
                  type="number"
                  style={{ width: "100px" }}
                  value={Tradi.alto}
                  onChange={(e) => handleInputChange(e, "alto")}
                  placeholder="Alto izquierdo"
                />
                <p style={labelStyle}>Alto Derecho</p>
                <Form.Control
                  type="number"
                  style={{ width: "100px" }}
                  value={Tradi.AltoDerecho}
                  onChange={(e) => handleInputChange(e, "AltoDerecho")}
                  placeholder="Alto derecho"
                />
              </>
            )}
          </Col>
        </Row>
        <Row>
          <Col className="d-flex justify-content-center">
            <FloatingLabel
              controlId="floatingTextarea2"
              label="Detalles instalación"
            >
              <Form.Control
                as="textarea"
                placeholder="comentario Instalacion"
                style={{
                  height: "150px",
                  width: "500px",
                  border: "1px solid black",
                  borderRadius: "5px",
                }}
                value={ComentarioIns}
                onChange={(e) => setComentarioIns(e.target.value)}
              />
            </FloatingLabel>
          </Col>
          <Col>
          <Editor
            apiKey="9keqzteg52asm01hpxxlhy7gtddv7yrnwm80edgvznfq6mg9"
            onInit={(evt, editor) => {
              editorRef.current = editor;
            }}
            initialValue={contenido}
            init={{
              height: 500,
              menubar: false,
              plugins: [
                "advlist autolink lists link image charmap preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table paste help wordcount",
              ],
              toolbar:
                "undo redo | formatselect | bold italic backcolor | " +
                "alignleft aligncenter alignright alignjustify | " +
                "bullist numlist outdent indent | removeformat | help",
            }}
          />
          </Col>

        </Row>
        <Row>
          <Col>
            <button className="Butooneditable" onClick={handleConfirmEdit}>
              Confirmar
            </button>
          </Col>
          <Col>
            <button className="Butooneditable" onClick={callBackCancel}>
              Cancelar
            </button>
          </Col>
        </Row>
      </div>
    </>
  );
};
