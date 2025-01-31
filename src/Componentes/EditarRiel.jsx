import React, { useEffect, useState } from "react";
import { Table, Form, FloatingLabel, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";
import "../Routes/Css/EditarCortina.css";
import { selectConfigRiel } from "../Features/ConfigReducer";
import { selectTelasRoller } from "../Features/TelasReducer";

export const EditarRiel = ({
  callBackCancel,
  rielEdited,
  callBacktoast,
  CortinaEditedFnct,
}) => {
  const ConfigRiel = useSelector(selectConfigRiel);

  const ladosAcumula = ConfigRiel.ladoAcumula || [];
  const tipos = ConfigRiel.tipos || [];
  const bastones = ConfigRiel.tiposBastones || [];
  const soportes = ConfigRiel.tiposSoportes || [];

  const EditarCortinaUrl = "/CortinaEp/";

  const [Riel, setRiel] = useState(rielEdited);
  const [ComentarioIns, setComentarioIns] = useState(
    rielEdited.detalleInstalacion
  );
  const bastonRiel = rielEdited.bastones.idtipo;
  console.log(bastonRiel)

  const [BastonesRiel, setBastonesRiel] = useState(rielEdited.bastones.idtipo);
  const [AcumulaRiel, setAcumulaRiel] = useState(rielEdited.ladoAcumula.ladoAcumulaId);
  
  useEffect(() => {
    setRiel(rielEdited);
  }, [rielEdited]);

  const handleInputChange = (e, field) => {
    const value =
      field === "tipoRiel" || field === "ladoAcumula" || field === "soportes" || field === "bastones.idtipo"
        ? JSON.parse(e.target.value)
        : e.target.value;

    setRiel((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const transformarRiel = (riel) => {
    return {
      ...riel,
      tipoRiel: riel.tipoRiel.tipoId || 1,
      ladoAcumula: riel.ladoAcumula.ladoAcumulaId || 3,
      soportes: riel.soportes.idTipo || 1,
    };
  };

  const handleConfirmEdit = () => {
    console.log(rielEdited);
    //Editar();
  };

  const Editar = async () => {
    try {
      const rielTransformado = transformarRiel(Riel);

      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rielTransformado),
      };

      const response = await fetch(
        EditarCortinaUrl + Riel.idRiel,
        requestOptions
      );
      const result = await response.json();
      console.log(result);
      callBacktoast("Riel actualizado", "success");
      CortinaEditedFnct();
    } catch (error) {
      console.log(error);
      callBacktoast("Error al actualizar", "error");
    }
  };

  return (
    <>
      <Table responsive>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Ambiente</th>
            <th>Ancho</th>
            <th>Tipo de Riel</th>
            <th>Soporte</th>
            <th>Bastones</th>
            <th>Acumula</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{Riel.nombre}</td>
            <td>
              <input
                type="text"
                value={Riel.ambiente}
                size={15}
                onChange={(e) => handleInputChange(e, "ambiente")}
              />
            </td>
            <td>
              {" "}
              <input
                type="number"
                value={Riel.ancho}
                size={8}
                onChange={(e) => handleInputChange(e, "ancho")}
              />
            </td>
            <td>
              <Form.Select
                value={JSON.stringify(Riel.tipoRiel)}
                onChange={(e) => handleInputChange(e, "tipoRiel")}
              >
                {tipos.map((tipo) => (
                  <option key={tipo.tipoId} value={JSON.stringify(tipo)}>
                    {tipo.tipo || "Sin definir"}
                  </option>
                ))}
              </Form.Select>
            </td>
            <td>
              <Form.Select
                value={JSON.stringify(Riel.soportes)}
                onChange={(e) => handleInputChange(e, "soportes")}
              >
                {soportes.map((soporte) => (
                  <option key={soporte.idTipo} value={JSON.stringify(soporte)}>
                    {soporte.nombre}
                  </option>
                ))}
              </Form.Select>
            </td>
            <td>
              <Form.Select
                value={BastonesRiel} 
                onChange={(e) => {
                  setBastonesRiel(e.target.value)
                }}
              >
                {bastones.map((baston) => (
                  <option key={baston.idTipoBaton} value={baston.idTipoBaton}>
                    {baston.nombre || "Sin definir"}
                  </option>
                ))}
              </Form.Select>
            </td>
            <td>
              <Form.Select
              value={AcumulaRiel} 
              onChange={(e) => {
                setAcumulaRiel(e.target.value)
              }}
              >
                {ladosAcumula.map((lado) => (
                  <option key={lado.ladoAcumulaId} value={JSON.stringify(lado)}>
                    {lado.nombre || "Sin definir"}
                  </option>
                ))}
              </Form.Select>
            </td>
          </tr>
        </tbody>
      </Table>
      <div>
        <Row>
          <Col className="d-flex justify-content-center">
            <FloatingLabel
              controlId="floatingTextarea2"
              label="Detalles armado"
            >
              <Form.Control
                as="textarea"
                placeholder="Detalles"
                style={{
                  height: "150px",
                  width: "500px",
                  border: "1px solid black",
                  borderRadius: "5px",
                }}
                value={Riel.detalle}
                onChange={(e) => handleInputChange(e, "detalle")}
              />
            </FloatingLabel>
          </Col>
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
