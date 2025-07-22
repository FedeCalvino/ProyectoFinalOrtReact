import React, { useMemo } from "react";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { selectArticulos, removeArticulo } from "../Features/ArticulosReducer";
import Button from "react-bootstrap/Button";

export const TablaRomana = () => {
  const dispatch = useDispatch();
  const Articulos = useSelector(selectArticulos);

  // Filtrar solo las cortinas romanas
  const Romanas = useMemo(
    () => Articulos.filter((articulo) => articulo.tipoArticulo === "romana"),
    [Articulos]
  );

  const handleDelete = (num) => {
    dispatch(removeArticulo({ numeroArticulo: num }));
  };

  return (
    <Table responsive>
      <thead>
        <tr>
          <th>Numero</th>
          <th>Ambiente</th>
          <th>Tela</th>
          <th>Ancho</th>
          <th>Alto</th>
          <th>Caídas</th>
          <th>Varillas</th>
          <th>Distancia Varillas</th>
          <th>Lado Cadena</th>
          <th>Factor Cadena</th>
          <th>Largo Cadena</th>
          <th>Detalle Instalación</th>
          <th>Borrar</th>
        </tr>
      </thead>
      <tbody>
        {Romanas.map((rom) => (
          <tr key={rom.numeroArticulo}>
            <td>{rom.numeroArticulo}</td>
            <td>{rom.Ambiente}</td>
            <td>{rom.telaStr || rom.TelaNombre}</td>
            <td>{rom.Ancho}</td>
            <td>{rom.Alto}</td>
            <td>{rom.caidasStr || rom.caidas}</td>
            <td>{rom.varillasStr || rom.cantvarillas}</td>
            <td>{rom.distanciavarillas}</td>
            <td>{rom.ladoCadenaStr || (rom.ladoCadena && rom.ladoCadena.lado)}</td>
            <td>{rom.factorLargoCadena}</td>
            <td>{rom.LargoCadena}</td>
            <td>{rom.detalleInstalacion}</td>
            <td>
              <Button variant="danger" onClick={() => handleDelete(rom.numeroArticulo)}>
                Borrar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};