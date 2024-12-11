import React, { useEffect, useMemo } from "react";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { selectArticulos, removeArticulo } from "../Features/ArticulosReducer";
import Button from "react-bootstrap/Button";

export const TableRollers = () => {
  const dispatch = useDispatch();
  const Articulos = useSelector(selectArticulos);

  const Rollers = useMemo(
    () => Articulos.filter((articulo) => articulo.tipoArticulo === "roller"),
    [Articulos]
  );

  const handleDelete = (num) => {
    dispatch(removeArticulo({ numeroArticulo: num }));
  };

  useEffect(() => {
    console.log("Rollers", Rollers);
  }, [Rollers]);

  return (
    <Table responsive>
      <thead>
        <tr>
          <th>Numero</th>
          <th>Area</th>
          <th>Tela</th>
          <th>Ancho</th>
          <th>Largo</th>
          <th>Caño</th>
          <th>Lado Cadena</th>
          <th>Posicion</th>
          <th>Motorizada</th>
          <th>Borrar</th>
        </tr>
      </thead>
      <tbody>
        {Rollers.map((Cor) => (
          <tr key={Cor.numeroArticulo}>
            <td>{Cor.numeroArticulo}</td>
            <td>{Cor.Ambiente}</td>
            <td>{Cor.TelaNombre}</td>
            <td>{Cor.Ancho}</td>
            <td>{Cor.Alto}</td>
            <td>{Cor.Tubo}</td>
            <td>{Cor.LadoCadena}</td>
            <td>{Cor.Posicion}</td>
            <td>{Cor.motorizada ? "Si" : "No"}</td>
            <td>
              <Button variant="danger" onClick={() => handleDelete(Cor.numeroArticulo)}>
                Borrar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
