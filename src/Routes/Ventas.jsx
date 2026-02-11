// Ventas.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Row, Col, Form, Button, Modal } from "react-bootstrap";
import { VentaView } from "../Componentes/VentaView";
import { useDispatch, useSelector } from "react-redux";
import {
  setArticulos,
  setVenta,
  selectVenta,
} from "../Features/VentaViewReucer.js";
import "./Css/Ventas.css";
import { OrdenProduccion } from "../Componentes/OrdenProduccion.jsx";
import { Toaster, toast } from "react-hot-toast";
import { selectRollerConfig } from "../Features/ConfigReducer";
import { Loading } from "../Componentes/Loading";
import { AgregarArticulo } from "../Componentes/AgregarArticulo.jsx";
import {
  removeAllArticulos,
  selectArticulos,
} from "../Features/ArticulosReducer";
import { VentaPreview } from "../Componentes/VentaPreview";
import Status from "../Componentes/Status.jsx";
import { Client } from "@stomp/stompjs";

export const Ventas = () => {
  const [isLoading, setIsLoading] = useState(false);
  const Ven = useSelector(selectVenta);
  const dispatch = useDispatch();

  const [SearchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");
  const [Tamano, setTamano] = useState("1");

  const [Ventas, setVentas] = useState([]);
  const [VentasActivas, setVentasActivas] = useState([]);
  const [VentasTotales, setVentasTotales] = useState([]);
  const [filterType, setFilterType] = useState("todas"); // "todas", "activas"
  const [showModal, setShowModal] = useState(false);

  const [ShowModalConfirmArt, setShowModalConfirmArt] = useState(false);
  const [VentaInfo, setVentaInfo] = useState(null);
  const [AddArt, setAddArt] = useState(false);
  const [Agregando, setAgregando] = useState(false);
  const Articulos = useSelector(selectArticulos);

  const idVenta = Ven?.id;
  let lastDay = "";

  const [ConfirmDelete, setConfirmDelete] = useState(false);
  const [loadingDelete, setloadingDelete] = useState(false);
  const [Pagina, setPagina] = useState(0);

  const ConfigRoller = useSelector(selectRollerConfig);

  // ✅ acciones / historial
  const [Acciones, setAcciones] = useState([]);

  // ✅ highlight + toast por WS (orden)
  const [highlightActionId, setHighlightActionId] = useState(null);
  const accionesPrevRef = useRef([]);
  const highlightTimerRef = useRef(null);

  const clientVentasRef = useRef(null);
  const clientOrdenesRef = useRef(null);

  const subVentasRef = useRef(false);
  const subOrdenesRef = useRef(false);

  // ✅ evita closure viejo en callbacks
  const filterTypeRef = useRef(filterType);
  useEffect(() => {
    filterTypeRef.current = filterType;
  }, [filterType]);

  // ---- URLs ----
  /*
  const UrlVentas = "http://200.40.89.254:8088/Ventas";
  const UrlVenta = "http://200.40.89.254:8088/Ventas/";
  const UrlVenta2 = "http://200.40.89.254:8081/Ventas/";
  const UrlDelete = "http://200.40.89.254:8088/Ventas/";
  const UrlActividades = "http://200.40.89.254:8081/Acciones/Ultimas";
*/
const UrlVentas = "/VentasEP";
const UrlVenta = "/VentasEP/";
const UrlVenta2 = "/VentasEP3/Ventas";
const UrlDelete = "/VentasEP/";
const UrlActividades = "/VentasEP3/Acciones/Ultimas";
  // ✅ auth helper (NO hardcode token)
  const getAuthHeaders = () => {
    const token = localStorage.getItem("token"); // ajustá el key si es otro
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const setVentaView = async (Venta) => {
    if (ConfigRoller.length !== 0) {
      if (Venta?.id != null) {
        setShowModal(true);
        setIsLoading(true);

        try {
          if (filterType === "todas") {
            const res = await fetch(UrlVenta + Venta.id, {
              method: "GET",
              headers: {
                ...getAuthHeaders(),
                "Content-Type": "application/json",
              },
            });
            const data = await res.json();
            dispatch(setArticulos(data.body.listaArticulos));
            dispatch(setVenta(data.body));
          } else {
            const res = await fetch(UrlVenta2 + "/EstadoPasos/" + Venta.id, {
              method: "GET",
              headers: {
                ...getAuthHeaders(),
                "Content-Type": "application/json",
              },
            });
            const data = await res.json();
            dispatch(setArticulos(data.body.listaArticulos));
            dispatch(setVenta(data.body));
          }
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      toast.error("Las configuraciones de rollers no estan cargadas");
    }
  };

  const callBackAddArt = () => {
    setAddArt(true);
    setShowModal(false);
    dispatch(removeAllArticulos());
  };

  const sumarPagina = () => {
    FetchVentas(+1);
    setPagina((prev) => prev + 1);
  };

  const restarPagina = () => {
    FetchVentas(-1);
    setPagina((prev) => prev - 1);
  };

  const getActionId = (a) =>
    a?.idAccion ??
    a?.IdAccion ??
    a?.id ??
    a?.ID_ACCCION ?? // por si viene de SQL
    null;

  // ✅ traer acciones (con opción notify para WS)
  const FetchActividades = async ({ notify = false } = {}) => {
    try {
      console.log("UrlActividades",UrlActividades)
      const res = await fetch(UrlActividades);
      const data = await res.json();
      console.log("Actividades",data)

      const lista = data?.body ?? data ?? [];

      const sorted = [...lista].sort((a, b) => {
        const fa = new Date(a.fechaHora || a.fecha || a.Fecha || 0).getTime();
        const fb = new Date(b.fechaHora || b.fecha || b.Fecha || 0).getTime();
        return fb - fa;
      });

      const next = sorted.slice(0, 10);

      const prevTopId = getActionId(accionesPrevRef.current?.[0]);
      const nextTopId = getActionId(next?.[0]);

      setAcciones(next);
      accionesPrevRef.current = next;

      // ✅ SOLO si viene de websocket (notify=true) y cambió la acción top
      if (notify && nextTopId && nextTopId !== prevTopId) {
        toast.success("Nueva acción", {
          position: "top-right",
          duration: 2500,
        });

        setHighlightActionId(nextTopId);

        if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
        highlightTimerRef.current = setTimeout(() => {
          setHighlightActionId(null);
        }, 2500);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const FetchVentas = async (adelanto) => {
    setVentas([]);
    try {
      const nuevaPagina = parseInt(Pagina) + parseInt(adelanto);
      const res = await fetch(`${UrlVentas}/Paginas/${nuevaPagina}`);
      const data = await res.json();

      const sortedData = data.body.sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha)
      );

      setVentas(sortedData);
      setVentasTotales(sortedData);

      try {
        const res = await fetch(`${UrlVenta2}/Activas`);
        const data = await res.json();

        const sortedActivas = data.body.sort((a, b) => {
          const fechaA = new Date(a.fechaInstalacion || a.fecha);
          const fechaB = new Date(b.fechaInstalacion || b.fecha);
          return fechaA - fechaB;
        });

        setVentasActivas(sortedActivas);
      } catch (error) {
        console.log(error);
        toast.error("Error al cargar las ventas activas");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al cargar las ventas");
    }
  };

  const FetchVentasActivas = async () => {
    try {
      const res = await fetch(`${UrlVenta2}/Activas`);
      const data = await res.json();

      const sortedData = data.body.sort((a, b) => {
        const fechaA = new Date(a.fechaInstalacion || a.fecha);
        const fechaB = new Date(b.fechaInstalacion || b.fecha);
        return fechaA - fechaB;
      });

      setVentasActivas(sortedData);

      // ✅ importante: usar ref (evita closure viejo)
      if (filterTypeRef.current === "activas") {
        setVentas(sortedData);
      }
    } catch (error) {
      console.log(error);
      toast.error("Error al cargar las ventas activas");
    }
  };

  const connectVentas = () => {
    if (clientVentasRef.current?.active) return;

    const client = new Client({
      brokerURL: "ws://200.40.89.254:8088/OrdenesSocket",
      reconnectDelay: 5000,
      debug: (msg) => console.log("[VENTAS]", msg),

      onConnect: () => {
        console.log("✅ Ventas WS conectado");

        if (subVentasRef.current) return;
        subVentasRef.current = true;

        client.subscribe("/topic/orders", (message) => {
          console.log("📩 Ventas msg:", message.body);
          FetchVentasActivas();
        });
      },

      onStompError: (frame) => {
        console.error("❌ Ventas STOMP error:", frame?.headers, frame?.body);
      },
      onWebSocketError: (evt) => {
        console.error("❌ Ventas WS error:", evt);
      },
      onDisconnect: () => {
        console.log("🔌 Ventas WS desconectado");
        subVentasRef.current = false;
      },
    });

    clientVentasRef.current = client;
    client.activate();
  };

  const connectOrdenes = () => {
    if (clientOrdenesRef.current?.active) return;

    const client = new Client({
      brokerURL: "ws://localhost:8081/OrdenesSocket",
      reconnectDelay: 5000,
      debug: (msg) => console.log("[ORDENES]", msg),

      onConnect: () => {
        console.log("✅ Ordenes WS conectado");

        if (subOrdenesRef.current) return;
        subOrdenesRef.current = true;

        client.subscribe("/topic/orders", (message) => {
          console.log("📩 Ordenes msg:", message.body);

          // ✅ refrescar status + historial
          FetchVentasActivas();

          // ✅ toast top-right + titileo verde del item nuevo
          FetchActividades({ notify: true });
        });
      },

      onStompError: (frame) => {
        console.error("❌ Ordenes STOMP error:", frame?.headers, frame?.body);
      },
      onWebSocketError: (evt) => {
        console.error("❌ Ordenes WS error:", evt);
      },
      onDisconnect: () => {
        console.log("🔌 Ordenes WS desconectado");
        subOrdenesRef.current = false;
      },
    });

    clientOrdenesRef.current = client;
    client.activate();
  };

  useEffect(() => {
    FetchVentas(0);
    connectVentas();
    connectOrdenes();

    return () => {
      subVentasRef.current = false;
      subOrdenesRef.current = false;

      clientVentasRef.current?.deactivate();
      clientOrdenesRef.current?.deactivate();

      clientVentasRef.current = null;
      clientOrdenesRef.current = null;

      if (highlightTimerRef.current) clearTimeout(highlightTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ cuando entras a "activas", cargar historial (sin toast)
  useEffect(() => {
    if (filterType === "activas") {
      FetchActividades({ notify: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType]);

  const MostrarDia = ({ Day }) => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate() + 1).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      return `${day}/${month}`;
    };

    let Ok = false;
    if (lastDay !== Day) {
      Ok = true;
      lastDay = Day;
    }

    return (
      <>
        {Ok && (
          <div className="day-header">
            <h3>{formatDate(Day)}</h3>
          </div>
        )}
      </>
    );
  };

  const groupedVentas = useMemo(() => {
    return (Ventas || []).reduce((acc, venta) => {
      const dateKey =
        filterType === "activas"
          ? venta.fechaInstalacion?.split("T")[0]
          : venta.fecha.split("T")[0];
      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(venta);
      return acc;
    }, {});
  }, [Ventas, filterType]);

  const MostrarFechaInstalacion = ({ fechaInstalacion }) => {
    if (!fechaInstalacion) return null;

    const fecha = new Date(fechaInstalacion);
    const hoy = new Date();
    const diffTime = fecha - hoy;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const day = String(date.getDate() + 1).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      return `${day}/${month}`;
    };

    return (
      <div className="day-header mt-4">
        <h3>
          {formatDate(fechaInstalacion)}{" "}
          {diffDays === 1 ? (
            <span style={{ color: "white", fontSize: "18px" }}>Mañana</span>
          ) : (
            <span style={{ color: "white", fontSize: "18px" }}>
              {diffDays < 0
                ? `(${Math.abs(diffDays)} días atrás)`
                : diffDays === 0
                ? "(Hoy)"
                : `(Faltan ${diffDays} días)`}
            </span>
          )}
        </h3>
      </div>
    );
  };

  const aplicarFiltroPorTipo = async () => {
    switch (filterType) {
      case "activas":
        return VentasActivas || [];
      default:
        return VentasTotales || [];
    }
  };

  const FiltrarVentas = async () => {
    if (debouncedSearchText.trim() && debouncedSearchText.trim().length >= 3) {
      setFilterType("todas");
      try {
        const res = await fetch(
          `${UrlVenta2}/VentaNombreCli/${debouncedSearchText}`
        );
        const data = await res.json();
        const sortedData = data.body.sort(
          (a, b) => new Date(b.fecha) - new Date(a.fecha)
        );
        setVentas(sortedData);
      } catch (error) {
        console.log(error);
        toast.error("Error al cargar las ventas");
      }
    } else {
      const filteredData = await aplicarFiltroPorTipo();
      setVentas(filteredData);
    }
  };

  const CambiarTipo = async () => {
    const VentaAset = await aplicarFiltroPorTipo();
    setVentas(VentaAset);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(SearchText);
    }, 500);
    return () => clearTimeout(timer);
  }, [SearchText]);

  useEffect(() => {
    FiltrarVentas();
    lastDay = "";
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchText]);

  useEffect(() => {
    CambiarTipo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType]);

  const handleClose = () => {
    setConfirmDelete(false);
    setShowModal(false);
    setIsLoading(false);
    setAddArt(false);
  };

  const handleCloseAddArt = () => {
    setConfirmDelete(false);
    setShowModal(true);
    setIsLoading(false);
    setAddArt(false);
  };

  const ConfirmAgregarArticulos = async () => {
    if (Articulos.length > 0) {
      setAgregando(true);
      const loadingToast = toast.loading("Cargando...");

      const requestOptions = {
        method: "POST",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(Articulos),
      };

      try {
        const response = await fetch(
          UrlVenta + "AddArt/" + Ven.id,
          requestOptions
        );

        if (!response.ok) {
          toast.dismiss(loadingToast);
          toast.error("Error al crear la venta");
          return;
        }
        toast.dismiss(loadingToast);
        setShowModal(false);
        setShowModalConfirmArt(false);
        await response.json();
        setAgregando(false);
      } catch (error) {
        setAgregando(false);
        toast.dismiss(loadingToast);
        toast.error("Error al crear la venta");
      }
    } else {
      setAgregando(false);
      setShowModal(false);
      toast.error("No hay articulos");
    }
  };

  const getTieneRieles = (ven) =>
    !((ven.estadoCorteRiel || "").includes("SIN PASOS"));

  const getTieneRollers = (ven) =>
    !((ven.estadoCorteTela || "").includes("SIN PASOS"));

  const ConfirmAddArt = () => {
    const VentaInfoObj = {
      CliNombre: Ven?.obra?.cliente?.nombre,
      Obra: Ven?.obra?.nombre,
      FechaInstalacion: Ven?.obra?.fechaInstalacion,
    };
    setVentaInfo(VentaInfoObj);
    setAddArt(false);
    setShowModalConfirmArt(true);
  };

  const handleDelete = async () => {
    if (idVenta != null) {
      setloadingDelete(true);
      const requestOptionsventa = {
        method: "DELETE",
        headers: { ...getAuthHeaders(), "Content-Type": "application/json" },
      };
      try {
        const response = await fetch(UrlDelete + idVenta, requestOptionsventa);
        if (response.ok) {
          setloadingDelete(false);
          handleClose();
          FetchVentas(0);
          toast.success("Venta eliminada");
        } else {
          toast.error("Error al eliminar");
          setloadingDelete(false);
        }
      } catch (error) {
        toast.error("Error al eliminar");
        setloadingDelete(false);
      }
    }
  };

  const callBackToast = (mensaje, tipo) => {
    if (tipo === "error") toast.error(mensaje);
    if (tipo === "success") toast.success(mensaje);
  };

  // ✅ componente historial (derecha)
  const HistorialAcciones = ({ acciones = [], highlightId = null }) => {
    const last10 = [...acciones]
      .sort((a, b) => {
        const fa = new Date(a.fechaHora || a.fecha || a.Fecha || 0).getTime();
        const fb = new Date(b.fechaHora || b.fecha || b.Fecha || 0).getTime();
        return fb - fa;
      })
      .slice(0, 10);

    const formatHora = (value) => {
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return "";
      return d.toLocaleTimeString("es-UY", { hour: "2-digit", minute: "2-digit" });
    };

    const labelTipo = (tipo) => {
      const map = {
        CORTE_TELA: "Corte tela",
        CORTE_CANO: "Corte caño",
        CORTE_RIEL: "Corte riel",
        TERMINAR_VENTA: "Venta",
      };
      return map[tipo] || tipo || "Acción";
    };

    const esTerminar = (a) => {
      const v = a.terminadoDeshacer ?? a.TerminadoDeshacer ?? a.TERMINAR_DESHACER;
      return v === 1 || v === true || v === "TERMINAR";
    };

    return (
      <div
        style={{
          background: "rgba(255,255,255,0.92)",
          border: "1px solid rgba(0,0,0,0.08)",
          borderRadius: 14,
          boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
          overflow: "hidden",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            padding: "12px 14px",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          <div style={{ fontWeight: 800, fontSize: 16 }}>Últimas acciones</div>
          <div style={{ fontSize: 12, color: "rgba(0,0,0,0.55)" }}>
            {last10.length}/10
          </div>
        </div>

        <div style={{ padding: 10 }}>
          {last10.length === 0 ? (
            <div style={{ padding: 12, color: "rgba(0,0,0,0.55)", fontSize: 13 }}>
              No hay acciones recientes.
            </div>
          ) : (
            last10.map((a, idx) => {
              const nombreCliente =
                a.nombreCliente || a.NombreCliente || a.cliente || "Cliente";
              const tipo = labelTipo(a.tipoAccion || a.Accion || a.accion);
              const hora = formatHora(a.fechaHora || a.fecha || a.Fecha);
              const terminar = esTerminar(a);

              const id = getActionId(a);
              const isHi = highlightId && id && id === highlightId;

              return (
                <div
                  key={id || `${idx}-${hora}`}
                  className={isHi ? "accion-item accion-flash" : "accion-item"}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto",
                    gap: 10,
                    padding: "10px 10px",
                    borderRadius: 12,
                    border: "1px solid rgba(0,0,0,0.06)",
                    ...(isHi ? {} : { background: "white" }), // ✅ no inline bg si titila
                    marginBottom: 8,
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 800,
                        fontSize: 13,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={nombreCliente}
                    >
                      {nombreCliente}
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                        marginTop: 4,
                        flexWrap: "wrap",
                      }}
                    >
                      <span
                        style={{
                          fontSize: 12,
                          padding: "2px 8px",
                          borderRadius: 999,
                          background: "rgba(0,0,0,0.05)",
                          border: "1px solid rgba(0,0,0,0.06)",
                        }}
                      >
                        {a.descripcion || a.Descripcion || tipo}
                      </span>

                      <span
                        style={{
                          fontSize: 12,
                          padding: "2px 8px",
                          borderRadius: 999,
                          border: `1px solid ${
                            terminar ? "rgba(0,128,0,0.25)" : "rgba(220,0,0,0.25)"
                          }`,
                          background: terminar
                            ? "rgba(0,128,0,0.10)"
                            : "rgba(220,0,0,0.10)",
                          color: terminar ? "green" : "crimson",
                          fontWeight: 700,
                        }}
                      >
                        {terminar ? "Terminar" : "Deshacer"}
                      </span>
                    </div>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: "rgba(0,0,0,0.55)" }}>
                      {hora}
                    </div>
                    <div>
                      {a.idArticulo ? 
                      a.tipoArticulo
                      :
                      null
                      }
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      <Row style={{ marginTop: "80px" }}>
        <h1 className="title">VENTAS</h1>
      </Row>

      <Row className="align-items-center ventas-header my-4">
        <Col xs={12} md={3}></Col>

        <Col xs={12} md={4} className="text-center">
          <div className="search-container">
            <Form.Control
              type="text"
              value={SearchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="🔍 Buscar por cliente"
              className="search-input"
            />
            {SearchText.trim() && SearchText.trim().length <= 2 && (
              <div className="text-muted mt-2 small">
                Escribe al menos 3 caracteres para buscar
              </div>
            )}
          </div>
        </Col>

        <Col
          xs={12}
          md={5}
          className="d-flex justify-content-center flex-wrap gap-3 mt-3 mt-md-0"
        >
          <Button
            variant={filterType === "todas" ? "primary" : "outline-primary"}
            onClick={() => setFilterType("todas")}
            className="filter-btn"
          >
            Todas las Ventas
          </Button>
          <Button
            variant={filterType === "activas" ? "primary" : "outline-primary"}
            onClick={() => setFilterType("activas")}
            className="filter-btn"
          >
            Ventas Activas
          </Button>
        </Col>
      </Row>

      {/* ✅ Layout: cuando es "activas" mostramos panel derecha */}
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {Object.entries(groupedVentas).map(([date, ventasDelDia]) => {
            const sortedVentasDelDia = ventasDelDia.sort((a, b) => {
              const fechaA = new Date(
                filterType === "activas" ? a.fechaInstalacion : a.fecha
              );
              const fechaB = new Date(
                filterType === "activas" ? b.fechaInstalacion : b.fecha
              );
              return fechaA - fechaB;
            });

            return (
              <React.Fragment key={date}>
                {filterType === "activas" ? (
                  <MostrarFechaInstalacion fechaInstalacion={date} />
                ) : (
                  <MostrarDia Day={date} />
                )}

                {sortedVentasDelDia.map((Ven) => (
                  <div
                    className={`venta-card${Tamano} shadow-sm p-3 mb-4 bg-white rounded`}
                    onClick={() => setVentaView(Ven)}
                    key={Ven.id}
                  >
                    <Row className="align-items-center">
                      <Col md={3}>
                        <div style={{ fontSize: "26px" }} className="fw-bold">
                          {Ven.obra.cliente?.nombre}
                        </div>
                        <div className="text-muted">
                          {Ven.obra.nombre && Ven.obra.nombre}
                        </div>
                      </Col>

                      <Col>
                        {!Ven.fechaInstalacion ? (
                          <span style={{ color: "red" }}>
                            Sin fecha de entrega
                          </span>
                        ) : new Date(Ven.fechaInstalacion).getTime() < Date.now() ? (
                          <span style={{ color: "green" }}>
                            Fecha de entrega pasada
                          </span>
                        ) : (
                          filterType === "activas" && (
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "flex-start",
                                gap: "25px",
                                marginTop: "15px",
                              }}
                            >
                              {getTieneRollers(Ven) && (
                                <div
                                  style={{
                                    border: "2px solid #ccc",
                                    borderRadius: "10px",
                                    padding: "10px 15px",
                                    textAlign: "center",
                                    minWidth: "220px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  }}
                                >
                                  <p
                                    style={{
                                      fontWeight: "600",
                                      fontSize: "16px",
                                      marginBottom: "8px",
                                    }}
                                  >
                                    Rollers
                                  </p>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      gap: "10px",
                                    }}
                                  >
                                    <Status status={Ven.estadoCorteTela} tipo="Tela" />
                                    <Status status={Ven.estadoCorteCano} tipo="Cano" />
                                    <Status
                                      status={Ven.estadoCorteContrapeso}
                                      tipo="Contrapeso"
                                    />
                                  </div>
                                </div>
                              )}

                              {getTieneRieles(Ven) && (
                                <div
                                  style={{
                                    border: "2px solid #ccc",
                                    borderRadius: "10px",
                                    padding: "10px 15px",
                                    textAlign: "center",
                                    minWidth: "220px",
                                    boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                                  }}
                                >
                                  <p
                                    style={{
                                      fontWeight: "600",
                                      fontSize: "16px",
                                      marginBottom: "8px",
                                    }}
                                  >
                                    Rieles
                                  </p>
                                  <div
                                    style={{
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      gap: "10px",
                                    }}
                                  >
                                    <Status status={Ven.estadoCorteRiel} tipo="Riel" />
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </Col>
                    </Row>
                  </div>
                ))}
              </React.Fragment>
            );
          })}
        </div>

        {/* ✅ SOLO cuando está en Ventas Activas */}
        {filterType === "activas" && (
          <div style={{ width: 380, flexShrink: 0, position: "sticky", top: 12 }}>
            <HistorialAcciones acciones={Acciones} highlightId={highlightActionId} />
          </div>
        )}
      </div>

      <Modal show={showModal} onHide={handleClose} dialogClassName="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title style={{ textAlign: "center", width: "100%" }}>
            {isLoading ? null : <>Detalle de la Venta: {Ven.id - 19000}</>}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <div className="text-center">
              <div
                className="spinner-border"
                role="status"
                style={{ width: "4rem", height: "4rem" }}
              >
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <VentaView
              callBackToast={callBackToast}
              callBackAddArt={callBackAddArt}
              estado={filterType}
            />
          )}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          {loadingDelete ? (
            <div style={{ marginLeft: "30px" }}>
              <Loading tipo="small" />
            </div>
          ) : ConfirmDelete ? (
            <Button
              style={{ background: "red", borderColor: "red" }}
              onClick={() => handleDelete()}
            >
              Seguro que desea eliminar la orden?
            </Button>
          ) : (
            <Button
              style={{ background: "red", borderColor: "red" }}
              onClick={() => setConfirmDelete(true)}
            >
              Eliminar
            </Button>
          )}

          <Button variant="secondary" onClick={handleClose}>
            Volver
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={AddArt} onHide={handleCloseAddArt} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{Ven.obra?.cliente?.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AgregarArticulo />
          <Button
            style={{ margin: "40px", width: "80%" }}
            variant="primary"
            onClick={ConfirmAddArt}
          >
            Agregar
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={ShowModalConfirmArt}
        onHide={() => setShowModalConfirmArt(false)}
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ textAlign: "center", width: "100%" }}>
            Cortinas a agregar
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <VentaPreview Venta={VentaInfo} />
          <Row className="button-row">
            <Col className="d-flex justify-content-center">
              {Agregando ? (
                <Loading tipo="small" />
              ) : (
                <Button
                  className="custom-button"
                  variant="primary"
                  onClick={() => {
                    ConfirmAgregarArticulos();
                  }}
                >
                  Agregar
                </Button>
              )}
            </Col>
            <Col className="d-flex justify-content-center">
              <Button
                className="custom-button"
                style={{ backgroundColor: "red", borderColor: "red" }}
                onClick={() => setShowModalConfirmArt(false)}
              >
                Cancelar
              </Button>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Volver
          </Button>
        </Modal.Footer>
      </Modal>

      <div>
        <Toaster
          position="bottom-center"
          reverseOrder={false}
          toastOptions={{
            style: { zIndex: 9999 },
          }}
        />
      </div>

      {filterType === "todas" && (
        <Row>
          <div style={{ padding: "20px" }}>
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "center",
                gap: "10px",
              }}
            >
              <button onClick={restarPagina} disabled={Pagina === 0}>
                ⬅️
              </button>
              <span>Página {Pagina + 1}</span>
              <button onClick={sumarPagina}>➡️</button>
            </div>
          </div>
        </Row>
      )}
    </div>
  );
};
