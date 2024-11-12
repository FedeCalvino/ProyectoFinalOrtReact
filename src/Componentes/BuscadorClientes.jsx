import React from 'react'
import { useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import ListGroup from 'react-bootstrap/ListGroup';
import Button from 'react-bootstrap/Button';
import Toast from 'react-bootstrap/Toast';
import { debounce } from 'lodash';


export const BuscadorClientes = () => {

  const UrlCLientesLike = "http://localhost:8081/Cliente/strL/"
  const [ClienteSeleccBoolean, SetClienteSeleccBoolean] = useState(false);
  const [Clientes, setClientes] = useState([]);
  const [SearchText, setSearchText] = useState('');

  //Cliente
  const [IdCli, setIdCli] = useState(null);
  const [NombreCli, setCliNom] = useState('');
  const [TelefonoCli, setCliTel] = useState('');
  const [RutCli, setCliRut] = useState('');
  const [DireccCli, setCliDirecc] = useState('');

  useEffect(() => {
    console.log(SearchText)
    FetchClientesLike();
  }, [SearchText]);


  const FetchClientesLike = async () => {
    try {
      console.log(SearchText)
      if (SearchText.trim() !== '') {
        console.log(SearchText)
        const res = await fetch(UrlCLientesLike + SearchText)
        const data = await res.json()
        setClientes(data);
        console.log(data);
      } else {
        setClientes([]);
      }
    } catch (error) {
      console.log(error)
    }
  };

  function SeleccionarCliente() {
    SetClienteSeleccBoolean(true)
  }
  function DesSeleccionarCliente(){
    SetClienteSeleccBoolean(false)
  }

  const SelecctCliFromList = (Cli) => {
    if (Cli != null)
      setIdCli(Cli.id)
    setCliNom(Cli.nombre)
    setCliRut(Cli.rut)
    setCliDirecc(Cli.direccion)
    setCliTel(Cli.numeroTelefono)
  };

  const ClientSeleccted = () => {
    return (
        <>
            <Row style={{alignItems:"center",justifyContent:"center"}}>
                <Toast>
                    <Toast.Header>
                        <img src="holder.js/20x20?text=%20" className="rounded me-2" alt="" />
                        <strong className="me-auto">{NombreCli}</strong>
                        <small>{RutCli}</small>
                    </Toast.Header>
                    <Toast.Body>{DireccCli}</Toast.Body>
                </Toast>
                <Button type="submit" as={Col} md="1" onClick={DesSeleccionarCliente}>Cambiar Cliente</Button>
            </Row>
        </>

    )
}

  return (
    <>
    {ClienteSeleccBoolean ? <ClientSeleccted /> :
    <>
    <Row>
      <Form.Group as={Col} md="2">
        <Form.Control
          type="text"
          value={SearchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Buscar..."
        />
      </Form.Group>

      <Form.Group as={Col} md="1">
        <Form.Control
          type="text"
          readOnly={true}
          defaultValue={NombreCli}
          placeholder="Nombre"
        />
      </Form.Group>
      <Form.Group as={Col} md="1">
        <Form.Control
          required
          type="number"
          defaultValue={TelefonoCli}
          readOnly={true}
          placeholder="telefono"
        />
      </Form.Group>
    </Row>
    <Row>
      <ListGroup as={Col} md="2">
        {(Clientes.map(Cli =>
          <ListGroup.Item
            key={Cli.id}
            action
            value={Cli.id}
            onClick={() => SelecctCliFromList(Cli)}
            style={{ marginTop: "1em" }}
          >
            {Cli.nombre}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Form.Group as={Col} md="1">

      <Form.Control style={{ marginTop: "1em" }} type="number" readOnly={true} placeholder="Rut" defaultValue={RutCli} />
      </Form.Group>
      <Form.Group as={Col} md="2">

        <Form.Control style={{ marginTop: "1em" }} type="text" readOnly={true} placeholder="Direccion" defaultValue={DireccCli} />
      </Form.Group>

      <Button style={{ marginTop: "1em" }} type="submit" as={Col} md="1" onClick={SeleccionarCliente}>Seleccionar Cliente</Button>
    </Row>
    </>
    }
    </>
  )
}
