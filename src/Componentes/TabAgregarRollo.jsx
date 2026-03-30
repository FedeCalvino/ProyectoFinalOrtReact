import React, { useEffect, useState } from "react";
import { Row, Col, Form, Button, Card } from "react-bootstrap";
import toast from "react-hot-toast";

const TabAgregarRollo = () => {

  const [telas, setTelas] = useState([]);

  const [form, setForm] = useState({
    idTela: "",
    largo: "",
    ancho: "",
    ubicacion: ""
  });

  useEffect(() => {
    fetchTelas();
  }, []);

  const fetchTelas = async () => {
    try {
      const res = await fetch("/VentasEP3/Ventas/Telas2");
      const data = await res.json();
      setTelas(data.body);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const guardarRollo = async () => {
    form.idTela = parseInt(form.idTela);
    console.log("form",form)
    
    if (!form.idTela) {
      toast.error("Completa los datos obligatorios");
      return;
    }

    try {
      const res = await fetch("/deposito/rollo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      
      console.log("response", res);
      
      const data = await res.json();
      console.log("data", data);
      toast.success("Rollo agregado al depósito");

    } catch (error) {
      toast.error("Error al guardar rollo");
    }

  };

  return (
    <Card className="shadow-sm border-0">
      <Card.Body>

        <h5 style={{marginBottom:20}}>
          Agregar Rollo al Depósito
        </h5>

        <Row className="g-3">

          <Col md={6}>
            <Form.Group>
              <Form.Label>Tela</Form.Label>
              <Form.Select
                name="idTela"
                value={form.idTela}
                onChange={handleChange}
              >
                <option value="">Seleccionar tela</option>

                {telas.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.nombre} - {t.color}
                  </option>
                ))}

              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>Largo (m)</Form.Label>
              <Form.Control
                name="largo"
                value={form.largo}
                onChange={handleChange}
                placeholder="25"
              />
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>Ancho</Form.Label>
              <Form.Control
                name="ancho"
                value={form.ancho}
                onChange={handleChange}
                placeholder="2.80"
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group>
              <Form.Label>Ubicación</Form.Label>
              <Form.Control
                name="ubicacion"
                value={form.ubicacion}
                onChange={handleChange}
                placeholder="Ej: A1 / Depósito / Estante 2"
              />
            </Form.Group>
          </Col>

          <Col md={12} className="mt-3">

            <Button
              variant="primary"
              onClick={guardarRollo}
              style={{marginRight:10}}
            >
              Guardar Rollo
            </Button>

            <Button
              variant="secondary"
              onClick={() =>
                setForm({
                  idTela: "",
                  largo: "",
                  ancho: "",
                  ubicacion: ""
                })
              }
            >
              Limpiar
            </Button>

          </Col>

        </Row>

      </Card.Body>
    </Card>
  );
};

export default TabAgregarRollo;