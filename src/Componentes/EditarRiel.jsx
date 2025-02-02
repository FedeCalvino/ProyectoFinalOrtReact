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

  const EditarCortinaUrl = "/RielEp";

  const [Riel, setRiel] = useState(rielEdited);
  const [ComentarioIns, setComentarioIns] = useState(
    rielEdited.detalleInstalacion
  );
  const bastonRiel = rielEdited.bastones.idtipo;
  console.log(bastonRiel);

  const [BastonesRiel, setBastonesRiel] = useState(Riel.bastones.idtipo);
  const [SoportessRiel, setSoportessRiel] = useState(Riel.soportes.idTipo);
  const [AcumulaRiel, setAcumulaRiel] = useState(
    Riel.ladoAcumula.ladoAcumulaId
  );
  const [TipoRiel, setTipoRiel] = useState(Riel.tipoRiel.tipoId);
  const [cantidadSoportes, setcantidadSoportes] = useState(
    Riel.soportes.cantidad
  );
  console.log("Riel.soportes.cantidad", Riel.soportes.cantidad);
  const [cantidadBastones, setcantidadBastones] = useState(
    Riel.bastones.cantidad
  );

  useEffect(() => {
    setRiel(rielEdited);
  }, [rielEdited]);

  const handleInputChange = (e, field) => {
    const value = e.target.value;

    setRiel((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const transformarRiel = (riel) => {
    const objBastones = {
      cantidad: cantidadBastones,
      idtipo: Number(BastonesRiel),
      idBastones:Riel.bastones.idBastones
    };
    const soporteObj = {
      idTipo: Number(SoportessRiel),
      cantidad: cantidadSoportes,
      idSoporte:Riel.soportes.idSoporte
    };
    return {
      ArticuloId: riel.IdArticulo,
      ambiente: riel.ambiente,
      ancho: Number(riel.ancho),
      bastones: objBastones,
      detalle: riel.detalle,
      detalleInstalacion: ComentarioIns,
      tipoRiel: TipoRiel,
      soportes: soporteObj,
      ladoAcumula: AcumulaRiel,
      tipoArticulo: "riel",
      nombre: "Riel",
    };
  };

  const handleConfirmEdit = () => {
    const rielObj = transformarRiel(Riel);
    console.log("rielObj", rielObj);
    Editar(rielObj);
  };

  const Editar = async (riel) => {
    try {
      const requestOptions = {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(riel),
      };

      const response = await fetch(
        EditarCortinaUrl+"/"+Riel.IdArticulo,
        requestOptions
      );

      if (!response.ok) {
        throw new Error("Error en la actualización del riel");
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
                value={TipoRiel}
                onChange={(e) => setTipoRiel(e.target.value)}
              >
                {tipos.map((tipo) => (
                  <option key={tipo.tipoId} value={tipo.tipoId}>
                    {tipo.tipo}
                  </option>
                ))}
              </Form.Select>
            </td>
            <td>
              <div className="d-flex align-items-center justify-content-center">
                <Form.Select
                  value={SoportessRiel}
                  onChange={(e) => setSoportessRiel(e.target.value)}
                  style={{ width: "120px" }}
                >
                  {soportes.map((soporte) => (
                    <option
                      key={soporte.idTipoSoporte}
                      value={soporte.idTipoSoporte}
                    >
                      {soporte.nombre}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control
                  type="number"
                  value={cantidadSoportes}
                  className="ms-2"
                  style={{ width: "80px", textAlign: "center" }}
                  onChange={(e) => setcantidadSoportes(e.target.value)}
                />
              </div>
            </td>
            <td className="d-flex align-items-center justify-content-center">
              <Form.Select
                value={BastonesRiel}
                onChange={(e) => {
                  setBastonesRiel(e.target.value);
                }}
                style={{ width: "150px" }}
              >
                {bastones.map((baston) => (
                  <option key={baston.idTipoBaton} value={baston.idTipoBaton}>
                    {baston.nombre || "Sin definir"}
                  </option>
                ))}
              </Form.Select>
              { BastonesRiel!=="5" &&
              <Form.Control
                type="number"
                value={cantidadBastones}
                onChange={(e) => {
                  setcantidadBastones(e.target.value);
                }}
                className="ms-2"
                style={{ width: "80px", textAlign: "center" }}
                placeholder="Cantidad"
              />
              }
            </td>
            <td>
              <Form.Select
                value={AcumulaRiel}
                onChange={(e) => {
                  setAcumulaRiel(e.target.value);
                }}
              >
                {ladosAcumula.map((lado) => (
                  <option key={lado.ladoAcumulaId} value={lado.ladoAcumulaId}>
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
