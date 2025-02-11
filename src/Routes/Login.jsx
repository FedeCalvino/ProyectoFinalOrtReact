import { React, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "./Css/Login.css";
import Figure from "react-bootstrap/Figure";
import { Toaster, toast } from "react-hot-toast";
import { Loading } from "../Componentes/Loading";

export const Login = ({ loginFnct }) => {
  
  const [Nombre, setNombre] = useState("");
  const [Pass, setPass] = useState("");
  const [loading, setloading] = useState(false);
  
  const LoginValidation = async () => {
    setloading(true);
    const user = { nombre: Nombre, password: Pass };
    const result = await loginFnct(user);
    console.log("result",result)

    if (!result || result.status !== "OK" ) {
      if(result?.message && result.message!=null){
        toast.error(result.message);
      }else{
        toast.error("Error en la conexion"); 
      }
      setloading(false);
    } else [];

    console.log("result", result);
  };

  return (
    <div className="login">
      <Toaster
        position="bottom-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            zIndex: 9999,
          },
        }}
      />
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "90vh" }}
      >
        <Form className="custom-form">
          <div style={{ height: "300px", width: "400px" }}>
            {loading ? (
              <Loading tipo="loading" />
            ) : (
              <Figure style={{ marginBottom: "100px" }}>
                <Figure.Image
                  width={400}
                  height={440}
                  alt="200x480"
                  src="\ImgLogo.png"
                />
              </Figure>
            )}
          </div>
          <InputGroup className="mb-3">
            {loading ? (
              <Form.Control
                placeholder="Nombre"
                disabled
                value={Nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                }}
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
              />
            ) : (
              <Form.Control
                placeholder="Nombre"
                value={Nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                }}
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
              />
            )}
          </InputGroup>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            {loading ? (
              <Form.Control
              disabled
                type="password"
                value={Pass}
                onChange={(e) => {
                  setPass(e.target.value);
                }}
                placeholder="Password"
              />
            ) : (
              <Form.Control
                type="password"
                value={Pass}
                onChange={(e) => {
                  setPass(e.target.value);
                }}
                placeholder="Password"
              />
            )}
          </Form.Group>
          <Button variant="primary" onClick={() => LoginValidation()}>
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};
