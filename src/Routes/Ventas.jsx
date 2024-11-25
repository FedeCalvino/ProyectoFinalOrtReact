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

    const [IdVenta, setIdVenta] = useState(null)
    const [SearchText, setSearchText] = useState("")
    const [loadingTable, setloadingTable] = useState(true)
    const [Ventas, setVentas] = useState([])

    const UrlVentas = "http://localhost:8083/Ventas"
    const UrlVentaCortinas = ""





    function MostrarVenta(venta) {
        setActiveKey(prevKey => (prevKey === venta.id ? null : venta.id));
        setloadingTable(true)
        console.log("click");
        setIdVenta(venta.id)
        setClienteVenta(venta.cliente.nombre)
        setFechaVenta(venta.fecha)
    }


    const FetchVentas = async () => {
      setLoading(true)
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

    const FetchVentaCortinas = async (IdView) => {
        if (IdVenta != null) {
            try {
                const res = await fetch(UrlVenta + IdView)
                const data = await res.json()
                setCortinas(data);
                setloadingTable(false)
                console.log(data);
            } catch (error) {
                console.log(error)
            }
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
    
    useEffect(() => {
        FetchVentaCortinas(IdVenta);
    }, [IdVenta]);

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
                            <Accordion.Item key={Ven.id} eventKey={Ven.id} onClick={() => MostrarVenta(Ven)}>
                                <Accordion.Header key={`header_${Ven.id}`}>
                                    <div style={{ fontSize: "20px", fontWeight: "bold", whiteSpace: "pre-line" }}>
                                        {Ven.cliente.nombre}{'\n'} Fecha: {Ven.fecha} {'\n'}{Ven.obra ? Ven.obra : null}
                                    </div>
                                </Accordion.Header>
                                <Accordion.Body >
                                   
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
