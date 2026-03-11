import React, { useEffect, useMemo, useState } from "react";
import {
  Row,
  Col,
  Form,
  Table,
  Card,
  Badge,
  Spinner,
  InputGroup,
} from "react-bootstrap";

const TabDepositoRollos = () => {
  const [rollos, setRollos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filtroTipo, setFiltroTipo] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [soloEnStock, setSoloEnStock] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Podés usar uno o ambos endpoints.
      const [rollosRes, tiposRes] = await Promise.all([
        fetch("http://localhost:8085/rollos/stock"),
        fetch("http://localhost:8085/telas/tipos"),
      ]);

      if (!rollosRes.ok) throw new Error("Error al obtener rollos");
      if (!tiposRes.ok) throw new Error("Error al obtener tipos");

      const rollosData = await rollosRes.json();
      const tiposData = await tiposRes.json();

      setRollos(Array.isArray(rollosData) ? rollosData : []);
      setTipos(Array.isArray(tiposData) ? tiposData : []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const normalizarNumero = (valor) => {
    if (valor === null || valor === undefined) return 0;
    const limpio = String(valor).replace(",", ".").trim();
    const num = parseFloat(limpio);
    return Number.isNaN(num) ? 0 : num;
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "-";
    const d = new Date(fecha);
    if (Number.isNaN(d.getTime())) return fecha;
    return d.toLocaleDateString("es-UY");
  };

  const getNombreTipo = (tipo) => {
    const encontrado = tipos.find((t) => String(t.id) === String(tipo));
    return encontrado ? encontrado.nombre : `Tipo ${tipo ?? "-"}`;
  };

  const rollosFiltrados = useMemo(() => {
    return rollos.filter((r) => {
      const coincideTipo =
        filtroTipo === "" || String(r.tipo) === String(filtroTipo);

      const texto = `${r.nombreTela || ""} ${r.color || ""} ${r.codigo || ""} ${r.ubicacion || ""}`.toLowerCase();
      const coincideBusqueda = texto.includes(busqueda.toLowerCase());

      const enStock = !r.fechaSalida;
      const coincideStock = soloEnStock ? enStock : true;

      return coincideTipo && coincideBusqueda && coincideStock;
    });
  }, [rollos, filtroTipo, busqueda, soloEnStock]);

  const totalRollos = rollosFiltrados.length;

  const totalMetros = useMemo(() => {
    return rollosFiltrados.reduce((acc, r) => acc + normalizarNumero(r.largo), 0);
  }, [rollosFiltrados]);

  const totalMetrosTexto = totalMetros.toFixed(2);

  return (
    <div>
      <Row className="mb-3 g-3">
        <Col md={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div style={{ fontSize: 13, color: "#6c757d" }}>Rollos visibles</div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{totalRollos}</div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div style={{ fontSize: 13, color: "#6c757d" }}>Metros visibles</div>
              <div style={{ fontSize: 28, fontWeight: 700 }}>{totalMetrosTexto} m</div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body>
              <div style={{ fontSize: 13, color: "#6c757d" }}>Filtro activo</div>
              <div style={{ fontSize: 20, fontWeight: 600 }}>
                {filtroTipo === "" ? "Todos los tipos" : getNombreTipo(filtroTipo)}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm border-0">
        <Card.Body>
          <Row className="g-3 mb-3">
            <Col md={4}>
              <Form.Group>
                <Form.Label>Tipo de tela</Form.Label>
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

            <Col md={5}>
              <Form.Group>
                <Form.Label>Buscar</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Nombre, color, código o ubicación"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </InputGroup>
              </Form.Group>
            </Col>

            <Col md={3} className="d-flex align-items-end">
              <Form.Check
                type="switch"
                id="solo-en-stock"
                label="Mostrar solo en stock"
                checked={soloEnStock}
                onChange={(e) => setSoloEnStock(e.target.checked)}
              />
            </Col>
          </Row>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" />
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <Table bordered hover responsive className="align-middle">
                <thead style={{ background: "#f8f9fa" }}>
                  <tr>
                    <th>ID Rollo</th>
                    <th>Tela</th>
                    <th>Color</th>
                    <th>Código</th>
                    <th>Tipo</th>
                    <th>Ancho</th>
                    <th>Largo</th>
                    <th>Ubicación</th>
                    <th>Fecha entrada</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {rollosFiltrados.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center py-4">
                        No hay rollos para mostrar
                      </td>
                    </tr>
                  ) : (
                    rollosFiltrados.map((r) => {
                      const enStock = !r.fechaSalida;

                      return (
                        <tr key={r.idRollo}>
                          <td>{r.idRollo}</td>
                          <td style={{ fontWeight: 600 }}>{r.nombreTela || "-"}</td>
                          <td>{r.color || "-"}</td>
                          <td>{r.codigo || "-"}</td>
                          <td>{getNombreTipo(r.tipo)}</td>
                          <td>{r.ancho || "-"}</td>
                          <td>{r.largo || "-"}</td>
                          <td>{r.ubicacion || "-"}</td>
                          <td>{formatearFecha(r.fechaEntrada)}</td>
                          <td>
                            {enStock ? (
                              <Badge bg="success">En stock</Badge>
                            ) : (
                              <Badge bg="secondary">Sin stock</Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default TabDepositoRollos;