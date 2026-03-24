import React, { useEffect, useMemo, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#f59e0b",
  "#dc2626",
  "#7c3aed",
  "#0891b2",
  "#ea580c",
  "#4f46e5",
];

const monthNames = {
  1: "Ene",
  2: "Feb",
  3: "Mar",
  4: "Abr",
  5: "May",
  6: "Jun",
  7: "Jul",
  8: "Ago",
  9: "Sep",
  10: "Oct",
  11: "Nov",
  12: "Dic",
};

const SAMPLE_DATA = [
  { anio: 2026, mes: 1, tipo_cortina: "ROLLER", tela: "Screen 5%", color: "Natural", codigo: "SCR5NAT", cantidad_vendida: 18, tipo_tela: 1 },
  { anio: 2026, mes: 1, tipo_cortina: "ROLLER", tela: "Blackout", color: "Blanco", codigo: "BOBLA", cantidad_vendida: 10, tipo_tela: 2 },
  { anio: 2026, mes: 1, tipo_cortina: "TRADICIONAL", tela: "Lino", color: "Arena", codigo: "LINARE", cantidad_vendida: 6, tipo_tela: 3 },
  { anio: 2026, mes: 2, tipo_cortina: "ROLLER", tela: "Screen 5%", color: "Natural", codigo: "SCR5NAT", cantidad_vendida: 21, tipo_tela: 1 },
  { anio: 2026, mes: 2, tipo_cortina: "ROMANA", tela: "Screen 3%", color: "Gris", codigo: "SCR3GR", cantidad_vendida: 5, tipo_tela: 1 },
  { anio: 2026, mes: 3, tipo_cortina: "ROLLER", tela: "Screen 5%", color: "Natural", codigo: "SCR5NAT", cantidad_vendida: 25, tipo_tela: 1 },
  { anio: 2026, mes: 3, tipo_cortina: "TRADICIONAL", tela: "Lino", color: "Arena", codigo: "LINARE", cantidad_vendida: 9, tipo_tela: 3 },
  { anio: 2025, mes: 10, tipo_cortina: "ROLLER", tela: "Blackout", color: "Beige", codigo: "BOBEI", cantidad_vendida: 9, tipo_tela: 2 },
];

function safeNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function formatMonth(anio, mes) {
  return `${monthNames[mes] || mes}/${String(anio).slice(-2)}`;
}

function sortDesc(array, field) {
  return [...array].sort((a, b) => safeNumber(b[field]) - safeNumber(a[field]));
}

function getFamiliaTela(nombre = "") {
  const lower = nombre.toLowerCase();
  if (lower.includes("screen")) return "SCREEN";
  if (lower.includes("black out") || lower.includes("blackout")) return "BLACKOUT";
  if (lower.includes("voile")) return "VOILE";
  if (lower.includes("lino")) return "LINO";
  if (lower.includes("bambula")) return "BAMBULA";
  return nombre || "OTRAS";
}

function Card({ title, value, subtitle, accent = "#2563eb" }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 18,
        padding: 18,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        borderTop: `4px solid ${accent}`,
      }}
    >
      <div style={{ fontSize: 13, color: "#64748b", marginBottom: 10 }}>{title}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: "#0f172a", marginBottom: 6 }}>{value}</div>
      <div style={{ fontSize: 13, color: "#475569" }}>{subtitle}</div>
    </div>
  );
}

function Section({ title, children, right }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 22,
        padding: 20,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 10,
          marginBottom: 18,
          flexWrap: "wrap",
        }}
      >
        <h3 style={{ margin: 0, fontSize: 20, color: "#0f172a" }}>{title}</h3>
        {right}
      </div>
      {children}
    </div>
  );
}

function TopList({ items, valueField = "valor", labelField = "label", secondaryField = "detalle" }) {
  return (
    <div style={{ display: "grid", gap: 10 }}>
      {items.map((item, index) => (
        <div
          key={`${item[labelField]}-${index}`}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px 14px",
            borderRadius: 14,
            background: index === 0 ? "#eff6ff" : "#f8fafc",
            border: index === 0 ? "1px solid #bfdbfe" : "1px solid #e2e8f0",
          }}
        >
          <div>
            <div style={{ fontWeight: 600, color: "#0f172a" }}>
              #{index + 1} {item[labelField]}
            </div>
            {item[secondaryField] ? (
              <div style={{ fontSize: 12, color: "#64748b", marginTop: 4 }}>{item[secondaryField]}</div>
            ) : null}
          </div>
          <div style={{ fontWeight: 700, color: "#1e293b" }}>{item[valueField]}</div>
        </div>
      ))}
    </div>
  );
}

export const Estadisticas = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [anioSeleccionado, setAnioSeleccionado] = useState("TODOS");
  const [mesSeleccionado, setMesSeleccionado] = useState("TODOS");
  const [tipoSeleccionado, setTipoSeleccionado] = useState("TODOS");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("http://localhost:8081/Ventas/Estadisticas");

        if (!response.ok) {
          throw new Error("No se pudieron cargar las estadísticas");
        }

        const result = await response.json();
        const lista = result.body;
        setData(Array.isArray(lista) ? lista : []);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los datos. Se muestran datos de ejemplo.");
        setData(SAMPLE_DATA);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const years = useMemo(() => [...new Set(data.map((r) => r.anio))].sort((a, b) => b - a), [data]);
  const tipos = useMemo(
    () => [...new Set(data.map((r) => r.tipo_cortina).filter(Boolean))].sort(),
    [data]
  );

  const filtered = useMemo(() => {
    return data.filter((row) => {
      const okAnio = anioSeleccionado === "TODOS" || String(row.anio) === String(anioSeleccionado);
      const okMes = mesSeleccionado === "TODOS" || String(row.mes) === String(mesSeleccionado);
      const okTipo = tipoSeleccionado === "TODOS" || row.tipo_cortina === tipoSeleccionado;
      return okAnio && okMes && okTipo;
    });
  }, [data, anioSeleccionado, mesSeleccionado, tipoSeleccionado]);

  const totalVendidas = useMemo(
    () => filtered.reduce((acc, row) => acc + safeNumber(row.cantidad_vendida), 0),
    [filtered]
  );

  const totalTelasDistintas = useMemo(() => {
    return new Set(filtered.map((r) => `${r.tela}__${r.color || ""}__${r.codigo || ""}`)).size;
  }, [filtered]);

  const topTela = useMemo(() => {
    const map = new Map();
    filtered.forEach((row) => {
      const key = `${row.tela} | ${row.color || "Sin color"}`;
      const actual = map.get(key) || { label: key, valor: 0, detalle: row.codigo || "Sin código" };
      actual.valor += safeNumber(row.cantidad_vendida);
      map.set(key, actual);
    });
    return sortDesc([...map.values()], "valor")[0] || null;
  }, [filtered]);

  const topTipo = useMemo(() => {
    const map = new Map();
    filtered.forEach((row) => {
      const key = row.tipo_cortina || "OTRO";
      map.set(key, (map.get(key) || 0) + safeNumber(row.cantidad_vendida));
    });
    return sortDesc(
      [...map.entries()].map(([label, valor]) => ({ label, valor })),
      "valor"
    )[0] || null;
  }, [filtered]);

  const ventasPorMes = useMemo(() => {
    const map = new Map();
    filtered.forEach((row) => {
      const key = `${row.anio}-${String(row.mes).padStart(2, "0")}`;
      const actual = map.get(key) || {
        periodo: formatMonth(row.anio, row.mes),
        sortKey: key,
        cantidad: 0,
      };
      actual.cantidad += safeNumber(row.cantidad_vendida);
      map.set(key, actual);
    });
    return [...map.values()].sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  }, [filtered]);

  const ventasAcumuladas = useMemo(() => {
    let acumulado = 0;
    return ventasPorMes.map((row) => {
      acumulado += safeNumber(row.cantidad);
      return { ...row, acumulado };
    });
  }, [ventasPorMes]);

  const promedioMensual = useMemo(() => {
    if (!ventasPorMes.length) return 0;
    return (
      ventasPorMes.reduce((acc, row) => acc + safeNumber(row.cantidad), 0) / ventasPorMes.length
    ).toFixed(1);
  }, [ventasPorMes]);

  const periodoTop = useMemo(() => {
    return sortDesc(
      ventasPorMes.map((row) => ({ label: row.periodo, valor: row.cantidad })),
      "valor"
    )[0] || null;
  }, [ventasPorMes]);

  const ultimaVariacion = useMemo(() => {
    if (ventasPorMes.length < 2) return null;
    const ultimo = safeNumber(ventasPorMes[ventasPorMes.length - 1]?.cantidad);
    const anterior = safeNumber(ventasPorMes[ventasPorMes.length - 2]?.cantidad);
    if (anterior === 0) return null;
    return {
      valor: (((ultimo - anterior) / anterior) * 100).toFixed(1),
      detalle: `${ventasPorMes[ventasPorMes.length - 2]?.periodo} → ${ventasPorMes[ventasPorMes.length - 1]?.periodo}`,
    };
  }, [ventasPorMes]);

  const ventasPorTipo = useMemo(() => {
    const map = new Map();
    filtered.forEach((row) => {
      const key = row.tipo_cortina || "OTRO";
      map.set(key, (map.get(key) || 0) + safeNumber(row.cantidad_vendida));
    });
    return sortDesc(
      [...map.entries()].map(([name, value]) => ({ name, value })),
      "value"
    );
  }, [filtered]);

  const topTelas = useMemo(() => {
    const map = new Map();
    filtered.forEach((row) => {
      const key = `${row.tela} | ${row.color || "Sin color"}`;
      const actual = map.get(key) || {
        label: key,
        valor: 0,
        detalle: row.codigo || "Sin código",
      };
      actual.valor += safeNumber(row.cantidad_vendida);
      map.set(key, actual);
    });
    return sortDesc([...map.values()], "valor").slice(0, 10);
  }, [filtered]);

  const topTelasBar = useMemo(() => {
    return topTelas.map((item) => ({
      nombre: item.label.length > 24 ? `${item.label.slice(0, 24)}...` : item.label,
      cantidad: item.valor,
      completo: item.label,
    }));
  }, [topTelas]);

  const combinacionTipoTela = useMemo(() => {
    const map = new Map();
    filtered.forEach((row) => {
      const key = `${row.tipo_cortina}__${row.tela}`;
      const actual = map.get(key) || {
        label: `${row.tipo_cortina} - ${row.tela}`,
        valor: 0,
        detalle: row.color || "",
      };
      actual.valor += safeNumber(row.cantidad_vendida);
      map.set(key, actual);
    });
    return sortDesc([...map.values()], "valor").slice(0, 8);
  }, [filtered]);

  const topMeses = useMemo(() => {
    const grouped = new Map();

    filtered.forEach((row) => {
      const key = `${row.anio}-${String(row.mes).padStart(2, "0")}`;
      const list = grouped.get(key) || [];
      list.push(row);
      grouped.set(key, list);
    });

    return [...grouped.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .slice(0, 6)
      .map(([key, rows]) => {
        const telasMap = new Map();
        rows.forEach((row) => {
          const telaKey = `${row.tela} | ${row.color || "Sin color"}`;
          telasMap.set(telaKey, (telasMap.get(telaKey) || 0) + safeNumber(row.cantidad_vendida));
        });
        const top = sortDesc(
          [...telasMap.entries()].map(([label, valor]) => ({ label, valor })),
          "valor"
        )[0];

        return {
          label: `${monthNames[Number(key.split("-")[1])]} ${key.split("-")[0]}`,
          valor: top?.valor || 0,
          detalle: top?.label || "-",
        };
      });
  }, [filtered]);

  const coloresTop = useMemo(() => {
    const map = new Map();
    filtered.forEach((row) => {
      const key = row.color || "Sin color";
      const actual = map.get(key) || { label: key, valor: 0, detalle: row.tipo_cortina || "" };
      actual.valor += safeNumber(row.cantidad_vendida);
      map.set(key, actual);
    });
    return sortDesc([...map.values()], "valor").slice(0, 8);
  }, [filtered]);

  const familiasResumen = useMemo(() => {
    const map = new Map();
    filtered.forEach((row) => {
      const familia = getFamiliaTela(row.tela);
      map.set(familia, (map.get(familia) || 0) + safeNumber(row.cantidad_vendida));
    });
    return sortDesc(
      [...map.entries()].map(([name, value]) => ({ name, value })),
      "value"
    );
  }, [filtered]);

  const mixMensual = useMemo(() => {
    const grouped = new Map();
    filtered.forEach((row) => {
      const key = `${row.anio}-${String(row.mes).padStart(2, "0")}`;
      const actual = grouped.get(key) || {
        periodo: formatMonth(row.anio, row.mes),
        sortKey: key,
        ROLLER: 0,
        ROMANA: 0,
        TRADICIONAL: 0,
        OTRO: 0,
      };
      const tipo = row.tipo_cortina || "OTRO";
      actual[tipo] = safeNumber(actual[tipo]) + safeNumber(row.cantidad_vendida);
      grouped.set(key, actual);
    });
    return [...grouped.values()].sort((a, b) => a.sortKey.localeCompare(b.sortKey));
  }, [filtered]);

  const mesesActivosTela = useMemo(() => {
    const mapaTelas = new Map();
    filtered.forEach((row) => {
      const keyTela = `${row.tela} | ${row.color || "Sin color"}`;
      const mesKey = `${row.anio}-${String(row.mes).padStart(2, "0")}`;
      const actual = mapaTelas.get(keyTela) || new Set();
      actual.add(mesKey);
      mapaTelas.set(keyTela, actual);
    });

    return sortDesc(
      [...mapaTelas.entries()].map(([label, meses]) => ({
        label,
        valor: meses.size,
        detalle: "Presencia repetida en varios meses",
      })),
      "valor"
    ).slice(0, 6);
  }, [filtered]);

  const dispersionMes = useMemo(() => {
    return ventasPorMes.map((row) => ({
      ...row,
      sobrePromedio: +(safeNumber(row.cantidad) - safeNumber(promedioMensual)).toFixed(1),
    }));
  }, [ventasPorMes, promedioMensual]);

  const resumenTipoTela = useMemo(() => {
    const rows = filtered.filter((row) => row.tipo_tela !== undefined && row.tipo_tela !== null);
    const map = new Map();
    rows.forEach((row) => {
      const key = `Tipo ${row.tipo_tela}`;
      map.set(key, (map.get(key) || 0) + safeNumber(row.cantidad_vendida));
    });
    return sortDesc(
      [...map.entries()].map(([name, value]) => ({ name, value })),
      "value"
    );
  }, [filtered]);

  if (loading) {
    return (
      <div style={{ padding: 30, fontSize: 18, color: "#334155" }}>
        Cargando estadísticas...
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%)",
        padding: 24,
      }}
    >
      <div style={{ maxWidth: 1500, margin: "0 auto" }}>
        <div style={{ marginBottom: 22 }}>
          <h1 style={{ margin: 0, fontSize: 34, color: "#0f172a" }}>Estadísticas de ventas</h1>
          <div style={{ marginTop: 8, color: "#475569", fontSize: 16 }}>
            Visión general de ventas, mix de productos y rotación de telas.
          </div>
          {error ? (
            <div
              style={{
                marginTop: 12,
                background: "#fff7ed",
                color: "#9a3412",
                border: "1px solid #fdba74",
                borderRadius: 12,
                padding: 12,
              }}
            >
              {error}
            </div>
          ) : null}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: 14,
            marginBottom: 20,
          }}
        >
          <FilterBox label="Año">
            <select value={anioSeleccionado} onChange={(e) => setAnioSeleccionado(e.target.value)} style={selectStyle}>
              <option value="TODOS">Todos</option>
              {years.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </FilterBox>

          <FilterBox label="Mes">
            <select value={mesSeleccionado} onChange={(e) => setMesSeleccionado(e.target.value)} style={selectStyle}>
              <option value="TODOS">Todos</option>
              {Object.entries(monthNames).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </FilterBox>

          <FilterBox label="Tipo de cortina">
            <select value={tipoSeleccionado} onChange={(e) => setTipoSeleccionado(e.target.value)} style={selectStyle}>
              <option value="TODOS">Todos</option>
              {tipos.map((tipo) => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </FilterBox>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <Card title="Total vendido" value={totalVendidas} subtitle="Cantidad total según filtros" accent="#2563eb" />
          <Card title="Telas distintas" value={totalTelasDistintas} subtitle="Variedad vendida" accent="#16a34a" />
          <Card title="Tela líder" value={topTela ? topTela.label : "-"} subtitle={topTela ? `${topTela.valor} ventas` : "Sin datos"} accent="#f59e0b" />
          <Card title="Tipo líder" value={topTipo ? topTipo.label : "-"} subtitle={topTipo ? `${topTipo.valor} ventas` : "Sin datos"} accent="#7c3aed" />
          <Card title="Promedio mensual" value={promedioMensual} subtitle="Promedio de ventas por mes" accent="#dc2626" />
          <Card title="Mes más fuerte" value={periodoTop ? periodoTop.label : "-"} subtitle={periodoTop ? `${periodoTop.valor} cortinas` : "Sin datos"} accent="#0891b2" />
          <Card title="Variación último mes" value={ultimaVariacion ? `${ultimaVariacion.valor}%` : "-"} subtitle={ultimaVariacion ? ultimaVariacion.detalle : "Se necesitan 2 meses"} accent="#ea580c" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 18, marginBottom: 18 }}>
          <Section title="Evolución mensual">
            <div style={{ width: "100%", height: 340 }}>
              <ResponsiveContainer>
                <LineChart data={ventasPorMes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="periodo" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="cantidad" stroke="#2563eb" strokeWidth={3} name="Ventas" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <Section title="Participación por tipo de cortina">
            <div style={{ width: "100%", height: 340 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={ventasPorTipo} dataKey="value" nameKey="name" outerRadius={110} innerRadius={55} label>
                    {ventasPorTipo.map((entry, index) => (
                      <Cell key={`pie-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Section>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 18, marginBottom: 18 }}>
          <Section title="Acumulado de ventas en el período">
            <div style={{ width: "100%", height: 320 }}>
              <ResponsiveContainer>
                <AreaChart data={ventasAcumuladas}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="periodo" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="acumulado" stroke="#7c3aed" fill="#ddd6fe" name="Acumulado" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <Section title="Colores con más salida">
            <TopList items={coloresTop} />
          </Section>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 18, marginBottom: 18 }}>
          <Section title="Mix mensual por tipo de cortina">
            <div style={{ width: "100%", height: 360 }}>
              <ResponsiveContainer>
                <BarChart data={mixMensual}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="periodo" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="ROLLER" stackId="a" fill="#2563eb" />
                  <Bar dataKey="ROMANA" stackId="a" fill="#16a34a" />
                  <Bar dataKey="TRADICIONAL" stackId="a" fill="#f59e0b" />
                  <Bar dataKey="OTRO" stackId="a" fill="#dc2626" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <Section title="Familias de tela con más rotación">
            <div style={{ width: "100%", height: 340 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={familiasResumen} dataKey="value" nameKey="name" outerRadius={115} label>
                    {familiasResumen.map((entry, index) => (
                      <Cell key={`fam-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Section>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: 18, marginBottom: 18 }}>
          <Section title="Top 10 telas más vendidas">
            <div style={{ width: "100%", height: 420 }}>
              <ResponsiveContainer>
                <BarChart data={topTelasBar} layout="vertical" margin={{ left: 20, right: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis type="category" dataKey="nombre" width={170} />
                  <Tooltip formatter={(value, name, props) => [value, props?.payload?.completo || name]} />
                  <Bar dataKey="cantidad" fill="#2563eb" radius={[0, 10, 10, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <Section title="Ranking rápido de telas">
            <TopList items={topTelas.slice(0, 8)} />
          </Section>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginBottom: 18 }}>
          <Section title="Combinaciones más fuertes">
            <div style={{ width: "100%", height: 360 }}>
              <ResponsiveContainer>
                <BarChart data={combinacionTipoTela}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" tickFormatter={(value) => (value.length > 16 ? `${value.slice(0, 16)}...` : value)} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="valor" fill="#16a34a" name="Ventas" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Section>

          <Section title="Top por mes reciente">
            <TopList items={topMeses} />
          </Section>
        </div>

        
      </div>
    </div>
  );
};

function FilterBox({ label, children }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 18,
        padding: 14,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      }}
    >
      <div style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>{label}</div>
      {children}
    </div>
  );
}

function Insight({ children }) {
  return (
    <div
      style={{
        background: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: 14,
        padding: 14,
        color: "#334155",
        lineHeight: 1.45,
      }}
    >
      {children}
    </div>
  );
}

const selectStyle = {
  width: "100%",
  padding: 10,
  borderRadius: 12,
  border: "1px solid #cbd5e1",
  fontSize: 14,
};


