import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useDispatch, useSelector } from "react-redux";
import { selectCliente } from "../Features/ClienteReducer";
import { setClienteFeature } from "../Features/ClienteReducer";

export const ClienteSeleccted = () => {
  const [showAll, setshowAll] = useState(false);
  const dispatch = useDispatch();
  const ClienteData = useSelector(selectCliente);

  const cambiarCli = () => {
    const newCli = { ...ClienteData, set: false };
    dispatch(setClienteFeature(newCli));
  };

  return (
    <Card
      style={{
        maxWidth: "400px",
        margin: "20px auto",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <Card.Body>
        <Card.Title
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "15px",
          }}
        >
                      <span style={{ textAlign: "center",width:"100%"}}>
            {ClienteData.Nombre}
          </span>
             {!showAll ? (
            <Button
              style={{ width: "90px", marginLeft: "auto" }}
              variant="primary"
              onClick={() => setshowAll(true)}
            >
              Mostrar
            </Button>
          ) : (
            <Button
              style={{ marginLeft: "auto" }}
              variant="primary"
              onClick={() => setshowAll(false)}
            >
              Ocultar
            </Button>
          )}
        </Card.Title>
        {showAll && (
          <>
            <Card.Text
              style={{
                fontSize: "0.9rem",
                color: "#555",
                marginBottom: "10px",
              }}
            >
              <strong>Tipo:</strong> {ClienteData.Tipo}
            </Card.Text>
            <Card.Text
              style={{
                fontSize: "0.9rem",
                color: "#555",
                marginBottom: "10px",
              }}
            >
              <strong>Teléfono:</strong> {ClienteData.NumeroTelefono}
            </Card.Text>
            <Card.Text
              style={{
                fontSize: "0.9rem",
                color: "#555",
                marginBottom: "10px",
              }}
            >
              <strong>Rut:</strong> {ClienteData.rut}
            </Card.Text>
            <Card.Text
              style={{
                fontSize: "0.9rem",
                color: "#555",
                marginBottom: "10px",
              }}
            >
              <strong>Dirección:</strong> {ClienteData.direccion}
            </Card.Text>
            <Card.Text
              style={{
                fontSize: "0.9rem",
                color: "#555",
                marginBottom: "10px",
              }}
            >
              <strong>Mail:</strong> {ClienteData.mail}
            </Card.Text>
          </>
        )}
        <div className="text-center">
          <Button variant="primary" onClick={cambiarCli}>
            Cambiar Cliente
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};
