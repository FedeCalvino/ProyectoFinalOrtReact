import React, { useEffect, useMemo } from "react";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { selectArticulos, removeArticulo } from "../Features/ArticulosReducer";
import Button from "react-bootstrap/Button";

export const TablaArticulos = () => {

  const dispatch = useDispatch();
  const Articulos = useSelector(selectArticulos);

  const Cortinas = useMemo(
    () => Articulos.filter((Cortinas) => Cortinas.nombre === "Cortina"),
    [Articulos]
  );

  const handleDelete = (num) => {
    //console.log(art)
    dispatch(removeArticulo({ numeroArticulo: num }));
  };

  const showArticulo=(Artic)=>{
    console.log("ahi")
  }

  return (
    <Table responsive>
      <thead>
        <tr>
          <th>Numero</th>
          <th>Articulo</th>
          <th>Area</th>
        </tr>
      </thead>
      <tbody>
        {Articulos.map((Art, index) => (
          <tr key={index} style={{ marginBottom: "1em" }} onClick={()=>showArticulo()}>
            <td>{Art.numeroArticulo}</td>
            <td>{Art.tipoArticulo.toUpperCase()}</td>
            <td>{Art.Ambiente}</td>
            <td>
              <Button onClick={() => handleDelete(Art.numeroArticulo)}>
                Borrar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
