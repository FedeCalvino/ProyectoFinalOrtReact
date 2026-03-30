import React, { useEffect, useMemo, useState } from "react";
import {
  Row,
  Col,
  Form,
  Table,
  Card,
  Spinner,
  InputGroup,
  Button,
  Badge,
} from "react-bootstrap";

const TabEditarRollos = () => {
  const [rollos, setRollos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [telas, setTelas] = useState([]);

  const [loading, setLoading] = useState(false);
  const [guardando, setGuardando] = useState(false);

  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("");
  const [rolloSeleccionado, setRolloSeleccionado] = useState(null);

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true);
      await fetchTipos();
      await fetchRollos();
      setLoading(false);
    };

    cargarDatos();
  }, []);

  const getTipoNombreById = (tipo) => {
    if (String(tipo) === "1") return "Roller";
    if (String(tipo) === "2") return "Tradicional";
    return `Tipo ${tipo}`;
  };
  const getIdTela=(nombreTela,ColorTela)=>{
    return telas.find(tela=>{tela.color===ColorTela && tela.nombre===nombreTela}).id
  }

  const fetchRollos = async () => {
    try {
      const res = await fetch("/deposito/rollos");
      if (!res.ok) throw new Error("Error al obtener rollos");

      const data = await res.json();
      const rollosArray = Array.isArray(data?.body) ? data.body : [];
      console.log(rollosArray)
      setRollos(rollosArray);
    } catch (error) {
      console.error("Error cargando rollos:", error);
      setRollos([]);
    }
  };

  const fetchTipos = async () => {
    try {
      const res = await fetch("/VentasEP3/Ventas/Telas2");
      if (!res.ok) throw new Error("Error al obtener telas");

      const data = await res.json();

      const telasArray = Array.isArray(data?.body)
        ? data.body
        : Array.isArray(data)
        ? data
        : [];

      setTelas(telasArray);

      const tiposMap = new Map();

      telasArray.forEach((t) => {
        const tipo = t.tipo;
        if (tipo !== null && tipo !== undefined && !tiposMap.has(String(tipo))) {
          tiposMap.set(String(tipo), {
            id: tipo,
            nombre: getTipoNombreById(tipo),
          });
        }
      });

      const tiposUnicos = Array.from(tiposMap.values()).sort(
        (a, b) => Number(a.id) - Number(b.id)
      );

      setTipos(tiposUnicos);
    } catch (error) {
      console.error("Error cargando tipos:", error);
      setTipos([]);
      setTelas([]);
    }
  };

  const getNombreTipo = (tipo) => {
    const encontrado = tipos.find((t) => String(t.id) === String(tipo));
    return encontrado ? encontrado.nombre : getTipoNombreById(tipo);
  };

  const rollosFiltrados = useMemo(() => {
    return rollos.filter((r) => {
      const coincideTipo =
        filtroTipo === "" || String(r.tipo) === String(filtroTipo);

      const texto =
        `${r.idRollo || ""} ${r.nombreTela || ""} ${r.color || ""} ${r.ubicacion || ""}`.toLowerCase();

      const coincideBusqueda = texto.includes(busqueda.toLowerCase());

      return coincideTipo && coincideBusqueda;
    });
  }, [rollos, busqueda, filtroTipo]);

  const telasDelTipoSeleccionado = useMemo(() => {
    if (!rolloSeleccionado?.tipo && rolloSeleccionado?.tipo !== 0) return [];

    return telas
      .filter((t) => String(t.tipo) === String(rolloSeleccionado.tipo))
      .sort((a, b) => {
        const ta = `${a.nombre || ""} ${a.color || ""}`;
        const tb = `${b.nombre || ""} ${b.color || ""}`;
        return ta.localeCompare(tb);
      });
  }, [telas, rolloSeleccionado]);

  const seleccionarRollo = (rollo) => {
    setRolloSeleccionado({
      idRollo: rollo.idRollo,
      largo: rollo.largo || "",
      ancho: rollo.ancho || "",
      fechaEntrada: rollo.fechaEntrada || "",
      idTela: rollo.idTela ?? "",
      ubicacion: rollo.ubicacion || "",
      fechaSalida: rollo.fechaSalida || "",
      tipo: rollo.tipo ?? "",
      nombreTela: rollo.nombreTela || "",
      color: rollo.color || "",
    });
  };

  const handleChangeRollo = (campo, valor) => {
    setRolloSeleccionado((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  };

  const handleChangeTipo = (tipoNuevo) => {
    setRolloSeleccionado((prev) => ({
      ...prev,
      tipo: tipoNuevo,
      idTela: "",
    }));
  };

  const handleChangeTela = (idTelaNuevo) => {
    const telaElegida = telas.find((t) => String(t.id) === String(idTelaNuevo));

    setRolloSeleccionado((prev) => ({
      ...prev,
      idTela: idTelaNuevo,
      nombreTela: telaElegida?.nombre || "",
      color: telaElegida?.color || "",
    }));
  };

  const guardarCambios = async () => {
    if (!rolloSeleccionado) return;

    try {
      setGuardando(true);

      const body = {
        idRollo: rolloSeleccionado.idRollo,
        largo: rolloSeleccionado.largo,
        ancho: rolloSeleccionado.ancho,
        fechaEntrada: rolloSeleccionado.fechaEntrada || null,
        idTela:
          rolloSeleccionado.idTela === ""
            ? null
            : Number(rolloSeleccionado.idTela),
        ubicacion: rolloSeleccionado.ubicacion,
        fechaSalida: rolloSeleccionado.fechaSalida || null,
      };

      const res = await fetch("/deposito/rollo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "No se pudo actualizar el rollo");
      }

      await fetchRollos();

      const actualizado = {
        ...rolloSeleccionado,
        idTela: body.idTela,
      };

      setRolloSeleccionado(actualizado);
      alert("Rollo actualizado correctamente");
    } catch (error) {
      console.error("Error actualizando rollo:", error);
      alert(error.message || "Error actualizando rollo");
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div>
      <Card className="shadow-sm border-0 mb-3">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Buscar rollo</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="ID, tela, color o ubicación"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </Col>

            <Col md={3}>
              <Form.Group>
                <Form.Label>Filtrar por tipo</Form.Label>
                <Form.Select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value)}
                >
                  <option value="">Todos</option>
                  {tipos.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>

            <Col md={5} className="d-flex align-items-end">
              <div style={{ fontSize: 14, color: "#6c757d" }}>
                Rollos encontrados: <strong>{rollosFiltrados.length}</strong>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row className="g-3">
        <Col md={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <h5 style={{ marginBottom: 16 }}>Lista de rollos</h5>

              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" />
                </div>
              ) : (
                <div style={{ maxHeight: "600px", overflowY: "auto" }}>
                  <Table hover bordered className="align-middle">
                    <thead>
                      <tr>
                        <th>Tela</th>
                        <th>Ubicacion</th>
                        <th>Color</th>
                        <th>Tipo</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {rollosFiltrados.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-4">
                            No se encontraron rollos
                          </td>
                        </tr>
                      ) : (
                        rollosFiltrados.map((r) => (
                          <tr
                            key={r.idRollo}
                            style={{
                              backgroundColor:
                                rolloSeleccionado?.idRollo === r.idRollo
                                  ? "rgba(13,110,253,0.08)"
                                  : "transparent",
                            }}
                          >
                            <td>{r.nombreTela || "-"}</td>
                            <td>{r.ubicacion}</td>
                            <td>{r.color || "-"}</td>
                            <td>{getNombreTipo(r.tipo)}</td>
                            <td>
                              <Button
                                size="sm"
                                variant="outline-primary"
                                onClick={() => seleccionarRollo(r)}
                                style={{color:"black"}}
                              >
                                Editar
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <h5 style={{ marginBottom: 16 }}>Edición de rollo</h5>

              {!rolloSeleccionado ? (
                <div className="text-center py-5" style={{ color: "#6c757d" }}>
                  Seleccioná un rollo para editar
                </div>
              ) : (
                <Row className="g-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>ID Rollo</Form.Label>
                      <Form.Control value={rolloSeleccionado.idRollo} disabled />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Tipo</Form.Label>
                      <Form.Select
                        value={String(rolloSeleccionado.tipo ?? "")}
                        onChange={(e) => handleChangeTipo(e.target.value)}
                      >
                        <option value="">Seleccionar</option>
                        {tipos.map((tipo) => (
                          <option key={tipo.id} value={tipo.id}>
                            {tipo.nombre}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Tela</Form.Label>
                      <Form.Select
                        value={rolloSeleccionado ? getIdTela(rolloSeleccionado.nombre , rolloSeleccionado.color):""}
                        onChange={(e) => handleChangeTela(e.target.value)}
                      >
                        <option value="">Seleccionar</option>
                        {telasDelTipoSeleccionado.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.nombre} {t.color ? `- ${t.color}` : ""}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Ancho</Form.Label>
                      <Form.Control
                        value={rolloSeleccionado.ancho}
                        onChange={(e) =>
                          handleChangeRollo("ancho", e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Largo</Form.Label>
                      <Form.Control
                        value={rolloSeleccionado.largo}
                        onChange={(e) =>
                          handleChangeRollo("largo", e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Ubicación</Form.Label>
                      <Form.Control
                        value={rolloSeleccionado.ubicacion}
                        onChange={(e) =>
                          handleChangeRollo("ubicacion", e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Fecha entrada</Form.Label>
                      <Form.Control
                        type="date"
                        value={rolloSeleccionado.fechaEntrada || ""}
                        onChange={(e) =>
                          handleChangeRollo("fechaEntrada", e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Fecha salida</Form.Label>
                      <Form.Control
                        type="date"
                        value={rolloSeleccionado.fechaSalida || ""}
                        onChange={(e) =>
                          handleChangeRollo("fechaSalida", e.target.value)
                        }
                      />
                    </Form.Group>
                  </Col>

                  <Col md={12}>
                    <div className="mb-3">
                      {!rolloSeleccionado.fechaSalida ? (
                        <Badge bg="success">En stock</Badge>
                      ) : (
                        <Badge bg="secondary">Sin stock</Badge>
                      )}
                    </div>
                  </Col>

                  <Col md={12} className="d-flex justify-content-end gap-2">
                    <Button
                      variant="outline-secondary"
                      onClick={() => setRolloSeleccionado(null)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      variant="primary"
                      onClick={guardarCambios}
                      disabled={guardando}
                    >
                      {guardando ? "Guardando..." : "Guardar cambios"}
                    </Button>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TabEditarRollos;