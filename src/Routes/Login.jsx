import { React, useState } from 'react'
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import './Css/Login.css'
import Figure from 'react-bootstrap/Figure';
import { Row } from 'react-bootstrap';
import Alert from 'react-bootstrap/Alert';

export const Login = ({ loginFnct, error }) => {


  const [Mail, setMail] = useState("")
  const [Pass, setPass] = useState("")

  const LoginValidation = () => {
    console.log("error?",error)
    const user = { "mail": Mail + "@Gmail.com", "Pass": Pass }
    loginFnct(user)
  }

  const AlertaCliente = () => {
    console.log('entro')
    return (
      <>
         <Alert 
        variant="danger" 
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem'
        }}
      >
        Error en el login 
      </Alert>
      </>
    )
  }
  return (
    <div className="login">
      <Row> {error ? <AlertaCliente /> : null}</Row>
      <div className="d-flex justify-content-center align-items-center" style={{ height: '90vh' }}>
        <Form className="custom-form"> {/* Reacuadrar y aplicar estilos personalizados */}
          <Figure style={{ marginBottom: "100px" }}>
            <Figure.Image
              width={400}
              height={440}
              alt="200x480"
              src="\ImgLogo.png"
            />
          </Figure>
          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Mail"
              value={Mail}
              onChange={(e) => { setMail(e.target.value) }}
              aria-label="Recipient's username"
              aria-describedby="basic-addon2"
            />
            <InputGroup.Text id="basic-addon2">@Gmail.com</InputGroup.Text>
          </InputGroup>
          <Form.Group className="mb-3" controlId="formBasicPassword">

            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={Pass}
              onChange={(e) => { setPass(e.target.value) }}
              placeholder="Password" />
          </Form.Group>
          <Button variant="primary" onClick={() => LoginValidation()}>
            Login
          </Button>
        </Form>
      </div>
    </div>
  )
}
