import React, { useEffect } from 'react'
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from 'react-redux';
import {selectArticulos,removeArticulo} from "../Features/ArticulosReducer"
import Button from "react-bootstrap/Button";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

export const TablaTradicional = () => {

const dispatch = useDispatch()
    const Tradicionales = useSelector(selectArticulos)
    function BorrarCor(num) {dispatch(removeArticulo({numeroCortina:num}))}
    useEffect(()=>{console.log(Tradicionales)},[Tradicionales])
    
  return (
    <Table responsive>
                <thead>
                  <tr>
                    <th>Numero</th>
                    <th>Area</th>
                    <th>Tela</th>
                    <th>Ancho / Ancho Izquierdo</th>
                    <th>Ancho Derecho</th>
                    <th>Largo</th>
                    <th>Paños</th>
                    <th>Lado Acumula</th>
                    <th>Pinza</th>
                    <th>Motorizada</th>
                    <th>Detalle</th>
                  </tr>
                </thead>
                <tbody>
                  {Tradicionales.map(
                    (Cor, index) =>

                        <tr key={index} style={{ marginBottom: "1em" }}>
                          <td>{Cor.numeroCortina}</td>
                          <td>{Cor.Ambiente}</td>
                          <td>{Cor.TelaNombre}</td>
                          <td>{Cor.ancho}</td>
                          <td>{Cor.AnchoDerecho}</td>
                          <td>{Cor.alto}</td>
                          <td>{Cor.CantidadPanos}</td>
                          <td>{Cor.Acumula}</td>
                          <td>{Cor.Pinza}</td>
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
