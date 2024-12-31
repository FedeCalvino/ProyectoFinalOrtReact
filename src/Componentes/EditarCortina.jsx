import React, { useEffect, useState } from "react";
import { Table, Form } from "react-bootstrap";
import { useSelector } from "react-redux";
import "../Routes/Css/EditarCortina.css";
import { selectRollerConfig } from "../Features/ConfigReducer";
import { selectTelasRoller } from "../Features/TelasReducer";

export const EditarCortina = ({ callBackCancel, cortinaEdited, onConfirmEdit }) => {
  const ConfigRoller = useSelector(selectRollerConfig);
  const CanosRoller = ConfigRoller.canos;
  const LadosCadenas = ConfigRoller.ladosCadena;
  const Posiciones = ConfigRoller.posiciones;
  const TiposTelas = useSelector(selectTelasRoller);

  const [Cortina, setCortina] = useState(cortinaEdited);

  useEffect(() => {
    setCortina(cortinaEdited);
  }, [cortinaEdited]);

  const handleInputChange = (e, field) => {
    const value = field === "cano" || field === "ladoCadena" || field === "posicion" 
      ? JSON.parse(e.target.value) 
      : e.target.value;

    setCortina((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleConfirmEdit = () => {
    onConfirmEdit(Cortina);
  };

  const findTela = (IdTela) => TiposTelas.find((Tela) => Tela.id === IdTela) || {};
  const tela = findTela(Cortina.IdTipoTela);

  return (
    <>
      <Table responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Ambiente</th>
            <th>Tela</th>
            <th>Color</th>
            <th>Ancho</th>
            <th>Ancho Tela</th>
            <th>Ancho Tubo</th>
            <th>Caño</th>
            <th>Alto</th>
            <th>Alto Tela</th>
            <th>Cantidad</th>
            <th>Largo Cadena</th>
            <th>Lado Cadena</th>
            <th>Posición</th>
            <th>Exterior</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{Cortina.nombre}</td>
            <td>
              <input
                type="text"
                value={Cortina.ambiente}
                size={15}
                onChange={(e) => handleInputChange(e, "ambiente")}
              />
            </td>
            <td>{tela.nombre}</td>
            <td>{tela.color}</td>
            <td>
              <input
                type="text"
                size={5}
                value={Cortina.ancho}
                onChange={(e) => handleInputChange(e, "ancho")}
              />
            </td>
            <td>{Cortina.AnchoTela}</td>
            <td>{Cortina.AnchoTubo}</td>
            <td>
              <Form.Select
                value={JSON.stringify(Cortina.cano)}
                onChange={(e) => handleInputChange(e, "cano")}
                style={{ width: "80px" }} 
              >
                {CanosRoller.map((cano) => (
                  <option key={cano.id} value={JSON.stringify(cano)}>
                    {cano.tipo}
                  </option>
                ))}
              </Form.Select>
            </td>
            <td>
              <input
                type="text"
                value={Cortina.alto}
                size={10}
                onChange={(e) => handleInputChange(e, "alto")}
              />
            </td>
            <td>{Cortina.AltoTela}</td>
            <td>1</td>
            <td>
              <input
                type="text"
                size={10}
                value={Cortina.LargoCadena}
                onChange={(e) => handleInputChange(e, "LargoCadena")}
              />
            </td>
            <td>
              <Form.Select
                value={JSON.stringify(Cortina.ladoCadena)}
                onChange={(e) => handleInputChange(e, "ladoCadena")}
              >
                {LadosCadenas.map((lado) => (
                  <option key={lado.ladoId} value={JSON.stringify(lado)}>
                    {lado.lado}
                  </option>
                ))}
              </Form.Select>
            </td>
            <td>
              <Form.Select
                value={JSON.stringify(Cortina.posicion)}
                onChange={(e) => handleInputChange(e, "posicion")}
              >
                {Posiciones.map((pos) => (
                  <option key={pos.posicionId} value={JSON.stringify(pos)}>
                    {pos.posicion}
                  </option>
                ))}
              </Form.Select>
            </td>
            <td>{Cortina.Exterior ? "Sí" : "No"}</td>
          </tr>
        </tbody>
      </Table>
      <button className="Butooneditable" onClick={handleConfirmEdit}>
        Confirmar
      </button>
      <button className="Butooneditable" onClick={callBackCancel}>
        Cancelar
      </button>
    </>
  );
};
