import React, { useEffect, useMemo, useState } from "react";
import { Spinner } from "react-bootstrap";

const TabDepositoRollos = () => {
  const [rollos, setRollos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [telas, setTelas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filtroTipo, setFiltroTipo] = useState("");
  const [filtroTela, setFiltroTela] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [soloEnStock, setSoloEnStock] = useState(true);
  const [tabActiva, setTabActiva] = useState("tabla");

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
    if (String(tipo) === "2") return "Tradicional";
    if (String(tipo) === "1") return "Roller";
    if (String(tipo) === "3") return "Exterior";
    return `Tipo ${tipo}`;
  };

  const fetchRollos = async () => {
    try {
      const res = await fetch("/deposito/rollos");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRollos(Array.isArray(data?.body) ? data.body : []);
    } catch {
      setRollos([]);
    }
  };

  const fetchTipos = async () => {
    try {
      const res = await fetch("/VentasEP3/Ventas/Telas2");
      if (!res.ok) throw new Error();

      const data = await res.json();
      const telasArray = Array.isArray(data?.body)
        ? data.body
        : Array.isArray(data)
        ? data
        : [];

      setTelas(telasArray);

      const tiposMap = new Map();
      telasArray.forEach((t) => {
        if (t.tipo != null && !tiposMap.has(String(t.tipo))) {
          tiposMap.set(String(t.tipo), {
            id: t.tipo,
            nombre: getTipoNombreById(t.tipo),
          });
        }
      });

      setTipos(
        Array.from(tiposMap.values()).sort(
          (a, b) => Number(a.id) - Number(b.id)
        )
      );
    } catch {
      setTipos([]);
      setTelas([]);
    }
  };

  const formatUbicacion = (ubicacion) => {
    if (!ubicacion) return "Sin ubicación";

    const ld = ubicacion.match(/^LD(\d+)$/i);
    if (ld) return `Lateral derecho ${ld[1]}`;

    const li = ubicacion.match(/^LI(\d+)$/i);
    if (li) return `Lateral izquierdo ${li[1]}`;

    const s = ubicacion.match(/^S-E(\d+)-P(\d+)$/i);
    if (s) return `Subsuelo · Estante ${s[1]} · Piso ${s[2]}`;

    const e = ubicacion.match(/^E(\d+)-P(\d+)$/i);
    if (e) return `Estante ${e[1]} · Piso ${e[2]}`;

    return ubicacion;
  };

  const normalizarNumero = (valor) => {
    if (valor == null) return 0;
    const num = parseFloat(String(valor).replace(",", ".").trim());
    return isNaN(num) ? 0 : num;
  };

  const getNombreTipo = (tipo) => {
    const found = tipos.find((t) => String(t.id) === String(tipo));
    return found ? found.nombre : getTipoNombreById(tipo);
  };

  const telasFiltradasPorTipo = useMemo(() => {
    if (filtroTipo === "") return [];

    const map = new Map();
    telas.forEach((t) => {
      if (String(t.tipo) === String(filtroTipo)) {
        const key = (t.nombre || "").trim().toLowerCase();
        if (key && !map.has(key)) {
          map.set(key, { id: t.nombre, nombre: t.nombre });
        }
      }
    });

    return Array.from(map.values()).sort((a, b) =>
      a.nombre.localeCompare(b.nombre)
    );
  }, [telas, filtroTipo]);

  const rollosFiltrados = useMemo(() => {
    return rollos.filter((r) => {
      const coincideTipo =
        filtroTipo === "" || String(r.tipo) === String(filtroTipo);

      const coincideTela =
        filtroTela === "" ||
        String(r.nombreTela || "").toLowerCase() ===
          String(filtroTela).toLowerCase();

      const texto =
        `${r.nombreTela || ""} ${r.color || ""} ${r.codigo || ""} ${r.ubicacion || ""}`.toLowerCase();

      const coincideBusqueda = texto.includes(busqueda.toLowerCase());
      const coincideStock = soloEnStock ? !r.fechaSalida : true;

      return (
        coincideTipo && coincideTela && coincideBusqueda && coincideStock
      );
    });
  }, [rollos, filtroTipo, filtroTela, busqueda, soloEnStock]);

  const stats = useMemo(() => {
    const porTela = new Map();
    const porColor = new Map();
    const porUbicacion = new Map();
    const porAncho = new Map();

    rollosFiltrados.forEach((r) => {
      const tela = r.nombreTela || "Sin nombre";
      const color = r.color || "Sin color";
      const ubic = formatUbicacion(r.ubicacion);
      const ancho = r.ancho ? `${normalizarNumero(r.ancho)} m` : "Sin dato";

      porTela.set(tela, (porTela.get(tela) || 0) + 1);
      porColor.set(color, (porColor.get(color) || 0) + 1);
      porUbicacion.set(ubic, (porUbicacion.get(ubic) || 0) + 1);
      porAncho.set(ancho, (porAncho.get(ancho) || 0) + 1);
    });

    const ordenar = (map) =>
      Array.from(map.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([nombre, cantidad]) => ({ nombre, cantidad }));

    return {
      porTela: ordenar(porTela),
      porColor: ordenar(porColor),
      porUbicacion: ordenar(porUbicacion),
      porAncho: ordenar(porAncho),
      total: rollosFiltrados.length,
      enStock: rollosFiltrados.filter((r) => !r.fechaSalida).length,
      empezados: rollosFiltrados.filter((r) => r.empezado).length,
    };
  }, [rollosFiltrados]);

  const Barra = ({ nombre, cantidad, max, color }) => (
    <div style={{ marginBottom: 10 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 13,
          marginBottom: 3,
        }}
      >
        <span
          style={{
            fontWeight: 500,
            color: "#212529",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            maxWidth: "80%",
          }}
        >
          {nombre}
        </span>
        <span style={{ color: "#6c757d", flexShrink: 0, marginLeft: 8 }}>
          {cantidad}
        </span>
      </div>

      <div
        style={{
          height: 8,
          background: "#e9ecef",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${Math.round((cantidad / max) * 100)}%`,
            background: color,
            borderRadius: 4,
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );

  const StatCard = ({ label, valor, color }) => (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        background: "#fff",
        border: "1px solid #dee2e6",
        borderRadius: 10,
        padding: "14px 18px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <div style={{ fontSize: 12, color: "#6c757d", marginBottom: 2 }}>
        {label}
      </div>
      <div
        style={{
          fontSize: 30,
          fontWeight: 700,
          color,
          lineHeight: 1.1,
        }}
      >
        {valor}
      </div>
    </div>
  );

  const GraficaCard = ({ titulo, items, max, color }) => (
    <div
      style={{
        flex: 1,
        minWidth: 0,
        background: "#fff",
        border: "1px solid #dee2e6",
        borderRadius: 10,
        padding: "16px 20px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          fontSize: 13,
          fontWeight: 600,
          color: "#495057",
          marginBottom: 14,
        }}
      >
        {titulo}
      </div>

      {items.length === 0 ? (
        <div style={{ fontSize: 13, color: "#6c757d" }}>Sin datos</div>
      ) : (
        items.map(({ nombre, cantidad }) => (
          <Barra
            key={nombre}
            nombre={nombre}
            cantidad={cantidad}
            max={max}
            color={color}
          />
        ))
      )}
    </div>
  );

  return (
    <div style={{ width: "100%", boxSizing: "border-box" }}>
      {/* Filtros */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #dee2e6",
          borderRadius: 10,
          padding: "18px 20px",
          marginBottom: 16,
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 16,
            flexWrap: "wrap",
            alignItems: "flex-end",
          }}
        >
          <div style={{ flex: "1 1 180px" }}>
            <label
              style={{
                fontSize: 13,
                fontWeight: 500,
                display: "block",
                marginBottom: 4,
              }}
            >
              Tipo de tela
            </label>
            <select
              value={filtroTipo}
              onChange={(e) => {
                setFiltroTipo(e.target.value);
                setFiltroTela("");
              }}
              style={{
                width: "100%",
                padding: "6px 10px",
                borderRadius: 6,
                border: "1px solid #ced4da",
                fontSize: 14,
              }}
            >
              <option value="">Todos</option>
              {tipos.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.nombre}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: "1 1 220px" }}>
            <label
              style={{
                fontSize: 13,
                fontWeight: 500,
                display: "block",
                marginBottom: 4,
              }}
            >
              Tela
            </label>
            <select
              value={filtroTela}
              onChange={(e) => setFiltroTela(e.target.value)}
              disabled={filtroTipo === ""}
              style={{
                width: "100%",
                padding: "6px 10px",
                borderRadius: 6,
                border: "1px solid #ced4da",
                fontSize: 14,
                background: filtroTipo === "" ? "#f8f9fa" : "#fff",
              }}
            >
              <option value="">
                {filtroTipo === "" ? "Primero elegí un tipo" : "Todas"}
              </option>
              {telasFiltradasPorTipo.map((t) => (
                <option key={t.id} value={t.nombre}>
                  {t.nombre}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: "2 1 260px" }}>
            <label
              style={{
                fontSize: 13,
                fontWeight: 500,
                display: "block",
                marginBottom: 4,
              }}
            >
              Buscar
            </label>
            <input
              type="text"
              placeholder="Nombre, color, código o ubicación"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 10px",
                borderRadius: 6,
                border: "1px solid #ced4da",
                fontSize: 14,
                boxSizing: "border-box",
              }}
            />
          </div>

          <div
            style={{
              fontSize: 13,
              color: "#6c757d",
              whiteSpace: "nowrap",
              paddingBottom: 2,
            }}
          >
            <strong style={{ color: "#212529" }}>
              {filtroTipo === "" ? "Todos los tipos" : getNombreTipo(filtroTipo)}
              {filtroTela !== "" ? ` / ${filtroTela}` : ""}
            </strong>
          </div>
        </div>
      </div>

      {/* Tabs full width */}
      <div
        style={{
          display: "flex",
          width: "100%",
          marginBottom: -1,
          borderBottom: "1px solid #dee2e6",
          gap: 0,
        }}
      >
        {[
          {
            key: "tabla",
            label: (
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <span>Rollos</span>
                <span
                  style={{
                    background: tabActiva === "tabla" ? "#0d6efd" : "#6c757d",
                    color: "#fff",
                    borderRadius: 999,
                    padding: "2px 9px",
                    fontSize: 12,
                    fontWeight: 600,
                    lineHeight: 1.2,
                  }}
                >
                  {rollosFiltrados.length}
                </span>
              </span>
            ),
          },
          {
            key: "estadisticas",
            label: "Estadísticas",
          },
        ].map(({ key, label }) => {
          const activa = tabActiva === key;

          return (
            <button
              key={key}
              onClick={() => setTabActiva(key)}
              style={{
                flex: 1,
                width: "50%",
                padding: "15px 18px",
                border: "1px solid #dee2e6",
                borderBottom: activa ? "2px solid #fff" : "1px solid #dee2e6",
                background: activa ? "#fff" : "#f8f9fa",
                color: activa ? "#0d6efd" : "#495057",
                fontWeight: activa ? 700 : 600,
                fontSize: 15,
                cursor: "pointer",
                transition: "all 0.2s ease",
                borderRadius: 0,
                boxShadow: activa ? "0 -1px 0 #dee2e6, inset 0 3px 0 #0d6efd" : "none",
              }}
              onMouseEnter={(e) => {
                if (!activa) {
                  e.currentTarget.style.background = "#eef3ff";
                }
              }}
              onMouseLeave={(e) => {
                if (!activa) {
                  e.currentTarget.style.background = "#f8f9fa";
                }
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: 24,
                }}
              >
                {label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Contenido */}
      <div
        style={{
          background: "#fff",
          border: "1px solid #dee2e6",
          borderTop: "none",
          borderRadius: "0 0 10px 10px",
          padding: "20px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        }}
      >
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            {tabActiva === "tabla" && (
              <div style={{ overflowX: "auto" }}>
                <table
                  style={{
                    width: "100%",
                    borderCollapse: "collapse",
                    fontSize: 14,
                  }}
                >
                  <thead>
                    <tr style={{ background: "#f8f9fa" }}>
                      {[
                        "Tela",
                        "Color",
                        "Código",
                        "Tipo",
                        "Ancho",
                        "Ubicación",
                        "Empezado",
                      ].map((h) => (
                        <th
                          key={h}
                          style={{
                            padding: "10px 12px",
                            textAlign: "left",
                            borderBottom: "2px solid #dee2e6",
                            fontWeight: 600,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rollosFiltrados.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          style={{
                            textAlign: "center",
                            padding: "32px 0",
                            color: "#6c757d",
                          }}
                        >
                          No hay rollos para mostrar
                        </td>
                      </tr>
                    ) : (
                      rollosFiltrados.map((r) => (
                        <tr
                          key={r.idRollo}
                          style={{ borderBottom: "1px solid #f0f0f0" }}
                        >
                          <td style={{ padding: "9px 12px", fontWeight: 600 }}>
                            {r.nombreTela || "-"}
                          </td>
                          <td style={{ padding: "9px 12px" }}>
                            {r.color || "-"}
                          </td>
                          <td style={{ padding: "9px 12px" }}>
                            {r.codigo || "-"}
                          </td>
                          <td style={{ padding: "9px 12px" }}>
                            {getNombreTipo(r.tipo)}
                          </td>
                          <td style={{ padding: "9px 12px" }}>
                            {r.ancho || "-"}
                          </td>
                          <td style={{ padding: "9px 12px" }}>
                            {formatUbicacion(r.ubicacion)}
                          </td>
                          <td style={{ padding: "9px 12px" }}>
                            {r.empezado ? "Sí" : "No"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {tabActiva === "estadisticas" && (
              <div>
                <div
                  style={{
                    display: "flex",
                    gap: 14,
                    marginBottom: 20,
                    flexWrap: "wrap",
                  }}
                >
                  <StatCard
                    label="Total rollos"
                    valor={stats.total}
                    color="#0d6efd"
                  />
                  <StatCard
                    label="En stock"
                    valor={stats.enStock}
                    color="#198754"
                  />
                  <StatCard
                    label="Empezados"
                    valor={stats.empezados}
                    color="#fd7e14"
                  />
                  <StatCard
                    label="Tipos de tela"
                    valor={stats.porTela.length}
                    color="#6f42c1"
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    gap: 14,
                    flexWrap: "wrap",
                    marginBottom: 14,
                  }}
                >
                  <GraficaCard
                    titulo="Rollos por tela"
                    items={stats.porTela}
                    max={stats.porTela[0]?.cantidad || 1}
                    color="#0d6efd"
                  />
                  <GraficaCard
                    titulo="Rollos por color"
                    items={stats.porColor}
                    max={stats.porColor[0]?.cantidad || 1}
                    color="#6f42c1"
                  />
                </div>

                <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                  <GraficaCard
                    titulo="Rollos por ubicación"
                    items={stats.porUbicacion}
                    max={stats.porUbicacion[0]?.cantidad || 1}
                    color="#198754"
                  />
                  <GraficaCard
                    titulo="Rollos por ancho"
                    items={stats.porAncho}
                    max={stats.porAncho[0]?.cantidad || 1}
                    color="#fd7e14"
                  />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default TabDepositoRollos;