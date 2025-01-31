import React, { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import TimePicker from "react-bootstrap-time-picker"; // Time picker for selecting time.

export const FormularioInstalacion = ({ Venta, callBackVolver }) => {
  const [ComienzoHoras, setComienzoHoras] = useState("08:00"); // Hora de comienzo
  const [FinHoras, setFinHoras] = useState("18:00"); // Hora de fin
  const [Detalles, setDetalles] = useState("");
  const [fechaInstalacion, setFechaInstalacion] = useState(
    Venta.fechaInstalacion
  );

  const handleFechaChange = (e) => {
    const selectedDate = new Date(e);
    const DateOk = selectedDate.toISOString().split("T")[0];
    setFechaInstalacion(DateOk);
  };

  const CrearInstalacion = () => {
    try {
      const fecha = fechaInstalacion;

      const segundosAHora = (segundos) => {
        const horas = Math.floor(segundos / 3600);
        const minutos = Math.floor((segundos % 3600) / 60);
        return `${horas.toString().padStart(2, "0")}:${minutos
          .toString()
          .padStart(2, "0")}`;
      };

      const comienzoHora = segundosAHora(ComienzoHoras);
      const finHora = segundosAHora(FinHoras);

      const startDatetime = `${fecha}T${comienzoHora}:00`;
      const endDatetime = `${fecha}T${finHora}:00`;
      const body = {
        Idventa: Venta.id,
        start: startDatetime,
        end: endDatetime,
        aclaraciones: Detalles,
        title: Venta.cliente.nombre,
        dia: fechaInstalacion,
      };
      console.log(body);
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      };
      fetch("/InstalacionEP", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          window.location.reload();
        })
        .catch((error) => console.error("Error:", error));
    } catch (error) {
      console.error("Error creando instalación:", error);
    }
  };

  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <p
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "10px",
          color: "#333",
          display: "flex",
          alignItems: "start",
        }}
      >
        <Row style={{ alignItems: "start" }}>
          <Col xs="auto" className="d-flex align-items-start">
            <Button variant="secondary" onClick={callBackVolver}>
              ← Volver
            </Button>
          </Col>

          <Col className="d-flex align-items-start text-left">
            {Venta.cliente.nombre}
          </Col>
        </Row>
      </p>

      <p style={{ fontSize: "18px", color: "gray", marginBottom: "20px" }}>
        {Venta.obra}
      </p>

      {/* Date Picker */}
      <Row className="justify-content-center mt-3">
        <Form.Group controlId="formGroupDate">
          <Form.Label
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              marginBottom: "10px",
              color: "#555",
            }}
          >
            Fecha
          </Form.Label>
          <Form.Control
            value={fechaInstalacion}
            onChange={(e) => handleFechaChange(e.target.value)}
            type="date"
            style={{
              borderRadius: "10px",
              padding: "10px",
              fontSize: "16px",
              width: "200px",
              border: "1px solid #ddd",
            }}
          />
        </Form.Group>
      </Row>

      {/* Time Slot Selection */}
      <Row>
        <Col>
          <Form.Label
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              color: "#555",
            }}
          >
            Hora
          </Form.Label>
        </Col>
      </Row>

      <Row className="justify-content-center mt-3">
  <p>Comienzo</p>
  <TimePicker
    start="08:00" // Hora de inicio en formato 24h
    end="18:00" // Hora de fin en formato 24h
    value={ComienzoHoras}
    onChange={(newHoras) => setComienzoHoras(newHoras)}
    format="HH:mm" // Especifica el formato de 24 horas
    step={1800} // Intervalos de 30 minutos
    style={{
      width: "100px",
      borderRadius: "10px",
      border: "1px solid #ddd",
    }}
  />
</Row>
<Row className="justify-content-center mt-3">
  <p>Fin</p>
  <TimePicker
    start="08:00"
    end="18:00"
    value={FinHoras}
    onChange={(newHoras) => setFinHoras(newHoras)}
    format="HH:mm" // Especifica el formato de 24 horas
    step={1800} // Intervalos de 30 minutos
    style={{
      width: "100px",
      borderRadius: "10px",
      padding: "10px",
      border: "1px solid #ddd",
    }}
  />
</Row>

      {/* Details Input */}
      <Row className="mt-3">
        <Form.Group controlId="validationCustom01">
          <h3
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              marginBottom: "15px",
              color: "#555",
            }}
          >
            Detalles
          </h3>
          <Form.Control
            style={{
              height: "60px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              fontSize: "16px",
              padding: "10px",
              width: "100%",
            }}
            type="text"
            value={Detalles}
            onChange={(e) => setDetalles(e.target.value)}
          />
        </Form.Group>
      </Row>

      {/* Submit Button */}
      <Row>
        <Col md={12} style={{ marginTop: "30px" }}>
          <Button
            onClick={CrearInstalacion}
            variant="success"
            style={{
              padding: "12px 30px",
              fontSize: "18px",
              borderRadius: "5px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.target.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.2)")
            }
            onMouseLeave={(e) =>
              (e.target.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.2)")
            }
          >
            Crear instalación
          </Button>
        </Col>
      </Row>
    </div>
  );
};
