import React from 'react'
import Table from 'react-bootstrap/Table';
import { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import styled from 'styled-components'
import Accordion from 'react-bootstrap/Accordion';
import './Css/Ventas.css';
import Spinner from 'react-bootstrap/Spinner';

import { Loading } from '../Componentes/Loading';

const StyledTableRow = styled.tr`
&:hover {
    background-color: beige;
}
`;

export const Ventas = () => {

    const [loading, setLoading] = useState(true);

    const [Venta, setVenta] = useState(null)
    const [SearchText, setSearchText] = useState("")
    const [loadingTable, setloadingTable] = useState(true)
    const [Ventas, setVentas] = useState([])
    //const Rollers = Venta.listaArticulos.filter(art=>art.tipoArticulo="roller")
    const UrlVentas = "/VentasEP"


    const FetchVentas = async () => {
            try {
                const res = await fetch(UrlVentas)
                const data = await res.json()
                setVentas(data.body);
                setLoading(false);
                console.log(data.body);
            } catch (error) {
                console.log(error)
            }
    };

    useEffect(() => {

        const fetchData = async () => {
            try {
                console.log("entr")
                await FetchVentas();
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);
  
    if (loading) {
        return (
            <Loading tipo="all" />
        );
    }
    return (
        <>
            <Row className="text-center mt-4 mb-4">
                <h1 style={{ fontFamily: 'Arial', fontSize: '32px', fontWeight: 'bold', color: '#333' }}>
                    VENTAS
                </h1>
            </Row>
            {Ventas.length !== 0 ?
                <Accordion>
                    {Ventas.map(Ven =>
                        <>
                            <Accordion.Item key={Ven.id} eventKey={Ven.id} >
                                <Accordion.Header key={`header_${Ven.id}`}>
                                    <div style={{ fontSize: "20px", fontWeight: "bold", whiteSpace: "pre-line" }}>
                                        {Ven.cliente.nombre}{'\n'} Fecha: {Ven.fecha} {'\n'}{Ven.obra ? Ven.obra : null}
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body >
                                <Table responsive>
                                            <thead style={{ justifyContent: "center", fontFamily: 'Arial, sans-serif' }}>
                                                <tr>
                                                    <th>Ancho</th>
                                                    <th>Ancho tela</th>
                                                    <th>Ancho Caño</th>
                                                    <th>caño</th>
                                                    <th>Alto Cortina</th>
                                                    <th>Alto Tela</th>
                                                    <th>Largo Cadena</th>
                                                    <th>posicion</th>
                                                    <th>Lado Cadena</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                              {Ven.listaArticulos.length>0 &&
                                                Ven.listaArticulos.map(Cor =>
                                                    <tr key={Cor.idRoller}>
                                                        <td>{Cor.ancho}</td>
                                                        <td>{Cor.AnchoTela}</td>
                                                        <td>{Cor.AnchoTubo}</td>
                                                        <td>{Cor.Tubo}</td>
                                                        <td>{Cor.alto}</td>
                                                        <td>{Cor.AltoTela}</td>
                                                        <td>{Cor.largoCadena}</td>
                                                        <td>{Cor.posicion}</td>
                                                        <td>{Cor.ladoCadena}</td>
                                                    </tr>
                                                )
                                              }
                                            </tbody>
                                        </Table>
                                </Accordion.Body>
                            </Accordion.Item>
                        </>
                    )}
                </Accordion> :
                SearchText.length == 0 ? null : <h1></h1>
            }
        </>
    );
}
