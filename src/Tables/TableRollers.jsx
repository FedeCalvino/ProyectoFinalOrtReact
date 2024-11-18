import React, { useEffect } from 'react'
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from 'react-redux';
import {selectRollers,removeRoller} from "../Features/CortinasReducer"
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
export const TableRollers = () => {
    const dispatch = useDispatch()

    const Rollers = useSelector(selectRollers)

    function BorrarCor(num) {dispatch(removeRoller({numeroCortina:num}))}

    useEffect(()=>{console.log("Rollers",Rollers)},[Rollers])
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
                    <th>Comentario</th>
                  </tr>
                </thead>
                <tbody>
                  {Rollers.map(
                    (Cor, index) =>
                        <tr key={index} style={{ marginBottom: "1em" }}>
                          <td>{Cor.numeroCortina}</td>
                          <td>{Cor.Ambiente}</td>
                          <td>{Cor.TelaNombre}</td>
                          <td>{Cor.ancho}</td>
                          <td>{Cor.alto}</td>
                          <td>{Cor.Tubo}</td>
                          <td>{Cor.LadoCadena}</td>
                          <td>{Cor.Posicion}</td>
                          {Cor.motorizada ? <td> Si</td> : <td>No</td>}
                          <td>
                            <OverlayTrigger
                              key="top"
                              placement="top"
                              overlay={
                                <Tooltip id={`tooltip-top`}>
                                  {Cor.detalle}
                                </Tooltip>
                              }
                            >
                              <Button variant="secondary">Comentario</Button>
                            </OverlayTrigger>
                          </td>
                          <td>
                            <Button onClick={() => BorrarCor(Cor.numeroCortina)}>
                              Borrar
                            </Button>
                          </td>
                        </tr>
                      
                  )}
                </tbody>
              </Table>
  )
}
