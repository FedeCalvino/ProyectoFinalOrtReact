import React from 'react'
import Table from 'react-bootstrap/Table';
import { useState, useEffect } from 'react';
import Row from 'react-bootstrap/Row';
import styled from 'styled-components'
import Accordion from 'react-bootstrap/Accordion';
import './Css/Ventas.css';
import { Loading } from '../Componentes/Loading';
import { PDFTela } from '../Componentes/PDFTela';
import { pdf } from "@react-pdf/renderer";
import Button from "react-bootstrap/Button";

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
                setVentas(data.body.reverse());
                setLoading(false);
                console.log(data.body);
            } catch (error) {
                console.log(error)
            }
    };
    const downloadPDF = async (Ven) => {
        const blob = await pdf(
          <PDFTela
            Venta={Ven}
          />
        ).toBlob();
    
        // Crear un enlace de descarga
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `${Ven.cliente.nombre} O.C.pdf`;
    
        // Simular el clic en el enlace de descarga
        link.click();
    
        // Liberar la URL del objeto
        URL.revokeObjectURL(link.href);
        setloadingpdf(false);
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
                                                    <th>Ambiente</th>
                                                    <th>Ancho</th>
                                                    <th>Ancho tela</th>
                                                    <th>Ancho Caño</th>
                                                    <th>Tubo</th>
                                                    <th>Alto Cortina</th>
                                                    <th>Alto Tela</th>
                                                    <th>Largo Cadena</th>
                                                    <th>posicion</th>
                                                    <th>Lado Cadena</th>
                                                    <th>Tipo Cadena</th>
                                                    <th>Motorizada</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                              {Ven.listaArticulos.length>0 &&
                                                Ven.listaArticulos.map(Cor =>
                                                    <tr key={Cor.idRoller}>
                                                        <td>{Cor.ambiente}</td>
                                                        <td>{Cor.ancho}</td>
                                                        <td>{Cor.AnchoTela}</td>
                                                        <td>{Cor.AnchoTubo}</td>
                                                        <td>{Cor.cano.tipo}</td>
                                                        <td>{Cor.alto}</td>
                                                        <td>{Cor.AltoTela}</td>
                                                        <td>{Cor.largoCadena}</td>
                                                        <td>{Cor.posicion.posicion}</td>
                                                        <td>{Cor.ladoCadena.lado}</td>
                                                        <td>{Cor.tipoCadena.tipoCadena}</td>
                                                        <td>{Cor.motorRoller.nombre}</td>
                                                    </tr>
                                                )
                                              }
                                            </tbody>
                                        </Table>
                                        <Button onClick={()=>downloadPDF(Ven)}>PDF</Button>
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
