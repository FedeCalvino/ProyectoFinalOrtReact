import React from 'react'
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import { useDispatch, useSelector } from 'react-redux';
import {selectCliente} from "../Features/ClienteReducer"
import {setClienteFeature} from "../Features/ClienteReducer"

export const ClienteSeleccted = () => {
    const dispatch = useDispatch()
    const ClienteData = useSelector(selectCliente)

    const cambiarCli = ()=>{
        const newCli = {...ClienteData,set:false}
        dispatch(setClienteFeature(newCli))
    }

    return (
        <Row>
            <div style={{
                marginTop:"80px",
                fontSize:"20px",
                width: '100%',
                padding: '10px',
                backgroundColor: 'white',
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Adds a soft shadow
                zIndex: 999, // Ensures it's on top
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '2px solid #ccc' // Adds a bottom border
            }}>
                <h2 style={{ margin: '0 20px 0 0',marginLeft:"20px" }}>{ClienteData.Name}</h2>
                <p style={{ margin: '0 20px' }}>
                    <span style={{ fontWeight: 'bold' }}>Tipo:</span> {ClienteData.Tipo}
                </p>
                <p style={{ margin: '0 20px' }}>
                    <span style={{ fontWeight: 'bold' }}>Telefono:</span> {ClienteData.Tel}
                </p>
                <p style={{ margin: '0 20px' }}>
                    <span style={{ fontWeight: 'bold' }}>Rut:</span> {ClienteData.Rut}
                </p>
                <p style={{ margin: '0 20px' }}>
                    <span style={{ fontWeight: 'bold' }}>Direccion:</span> {ClienteData.Direcc}
                </p>
                <Button variant="primary" onClick={(()=>cambiarCli())}>Cambiar Cliente</Button>
            </div>
        </Row>
    )
}
