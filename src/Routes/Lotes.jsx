import React, { useState, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Toaster, toast } from "react-hot-toast";
import "./Css/Lote.css";
export const Lotes = () => {

  const [Lotes, setLotes] = useState([]);

  const [dateRange, setDateRange] = useState([]);

  const [OrdenSelecc, setOrdenSelecc] = useState(null);
  const [VentaSelecc, setVentaSelecc] = useState(null);
  const [articuloSelecc, setarticuloSelecc] = useState(null);

  const [LoteClick, setLoteClick] = useState(null);

  const [Ventas, setVentas] = useState([]);
  const [Ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [Modal, setModal] = useState(false);
  const UrlVenta = "/VentasEP/Wordenes";

  const AlertaError = (Mensaje) => {
    console.log(Mensaje);
    toast.error(Mensaje);
  };

  useEffect(() => {
    console.log(Modal);
  }, [Modal]);

  useEffect(() => {
    const generateDateRange = () => {
      const today = new Date();
      const daysAhead = 9;
      const range = [];

      for (let i = 2; i <= daysAhead; i++) {
        // Empieza desde 1 para excluir hoy y comenzar desde mañana
        const currentDate = new Date(today);
        currentDate.setDate(today.getDate() + i);

          range.push(currentDate.toISOString().split("T")[0]);
      }
      setDateRange(range);
    };

    const fetchDataOrdenes = async () => {
      try {
        const data = await fetch("http://localhost:8083/Orden");
        const response = await data.json();
        console.log("response orden", response);

        setOrdenes(response.body);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };

    const fetchDataVentas = async () => {
      try {
        const data = await fetch(UrlVenta);
        const response = await data.json();
        setVentas(response.body.reverse());
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    const fetchDataLotes = async () => {
      try {
        const data = await fetch("/LoteEp");
        const response = await data.json();
        console.log("response",response)
        setLotes(response.body);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    generateDateRange();
    fetchDataLotes();
    fetchDataOrdenes();
    fetchDataVentas();
  }, []);

  const setPasosVenta = (VenId) => {
    const orden = Ordenes.find((Orden) => Orden.idVenta === parseInt(VenId));
    const Venta = Ventas.find((ven) => ven.id === parseInt(VenId));

    let Articulos = [];
    Ordenes.map((Orden) => {
      if (Orden.idVenta === parseInt(VenId)) {
        Articulos.push(Orden.articulo);
      }
    });
    setOrdenSelecc(orden);
    setVentaSelecc(Venta);
    setarticuloSelecc(Articulos);
    setModal(true);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    return `${day}/${month}`;
  };

  const GetPasos = (idVenta) => {
    if (loading) {
      return "Cargando pasos...";
    }

    const orden = Ordenes.find((Orden) => Orden.idVenta === parseInt(idVenta));

    if (!orden || !orden.pasos) {
      return "No hay pasos disponibles";
    }

    return orden.pasos.map((paso) => paso.paso.replace("_", " ")).join("-");
  };

  const GetPasosLote = (lote) => {
    if (!lote.pasosordenes || lote.pasosordenes.length === 0) {
      return "No hay pasos disponibles";
    }

    // Contar las ocurrencias de cada paso
    const pasoCounts = lote.pasosordenes.reduce((counts, paso) => {
      const pasoTexto = paso.paso.replace("_", " ");
      counts[pasoTexto] = (counts[pasoTexto] || 0) + 1;
      return counts;
    }, {});

    // Generar el resultado agrupado
    return Object.entries(pasoCounts).map(([paso, count], index) => (
      <p key={index} style={{ margin: "0px" }}>
        {paso} {count > 1 ? `x${count}` : "x1"}
      </p>
    ));
  };

  const setLoteClickFunct = (idlote) => {
    if (idlote === LoteClick) setLoteClick(null);
    else setLoteClick(idlote);
  };

  const DeleteLote = async () => {

    const loadingToast = toast.loading("Eliminando");
    const requestOptions = {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    };

    try {
      const response = await fetch(
        "/LoteEp" + LoteClick,
        requestOptions
      );

      if (!response.ok) {
        console.error("Error en la solicitud:", response.statusText);
        toast.error("Error al eliminar");
        toast.dismiss(loadingToast);
        return;
      }

      const result = await response.json();
      console.log("Response Venta", result);

      if (result.status === "OK") {
        const newLotes = Lotes.filter((lote) => lote.idlote !== LoteClick);
        setLotes(newLotes);
        setLoteClick(null);
        toast.success("Eliminado");
        const response = await fetch("/VentasEP/Mensaje");
        toast.dismiss(loadingToast);
      } else {
        console.log("error");
        toast.dismiss(loadingToast);
        AlertaError(result.message);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      AlertaError("Error al realizar la solicitud");
    }

  };

  const CrearLote = async (ObjLote) => {
    const loadingToast = toast.loading("Cargando...");

    console.log("ObjLote", ObjLote);

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ObjLote),
    };

    try {
      const response = await fetch(
        "/LoteEp",
        requestOptions
      );
      const result = await response.json();
      console.log("result", result);
      if (result.status !== "OK") {
        throw new Error(result.message);
      } else {
        console.log("mensaje");
        const response = await fetch("/VentasEP/Mensaje");
        toast.success("Lote agregado");
      }
      const newLotes = Lotes
      newLotes.push(result.body)
      setLotes(newLotes)

      toast.dismiss(loadingToast);
    } catch (error) {
      toast.dismiss(loadingToast);
      AlertaError(error.message);
    }

    setLotes([...Lotes]);
  };

  const todayN = new Date().toISOString().split("T")[0];
  const tomorrow = new Date(todayN);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(tomorrow);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);
  const today = tomorrow.toISOString().split("T")[0];
  console.log(" console.log(today)", todayN);

  const handleDragEndVenta = async (result) => {
    const { source, destination } = result;

    if (!destination) return;

    if (source.droppableId === destination.droppableId) return;

    const Venta = await Ventas.find(
      (ven) => ven.id === parseInt(result.draggableId)
    );

    let Pasos = [];

    Ordenes.forEach((ord) => {
      if (ord.idVenta === parseInt(result.draggableId)) {
        Pasos = Pasos.concat(ord.pasos);
      }
    });
    let newFechaComienzo = null;
    if (destination.droppableId === "hoy") {
      newFechaComienzo = new Date();
    } else if (!isNaN(Date.parse(destination.droppableId))) {
      newFechaComienzo = new Date(destination.droppableId);
    }
    const localDate = new Date(newFechaComienzo);

    const offset = localDate.getTimezoneOffset();
    localDate.setMinutes(localDate.getMinutes() - offset);

    let newDate = new Date(newFechaComienzo);

    let newFechaComienzoSuma = newDate.toISOString().split("T")[0];

    const ObjLote = {
      PasosOrdenes: Pasos,
      Nombre: Venta.cliente.nombre,
      fecha: newFechaComienzoSuma,
    };

    if (destination.droppableId !== "sin-fecha") {
      Venta.fechaComienzo = newFechaComienzoSuma;
      CrearLote(ObjLote);
    }

    setLotes([...Lotes]);
  };

  const LotesSinFecha = (Lotes || []).filter((lote) => !lote.fechaComienzo);

  const LotesHoy = (Lotes || []).filter((lote) => lote.fecha === todayN);

  const groupedLotes = (Lotes || []).reduce((acc, lote) => {
    if (lote.fecha) {
      // Convertir la fecha a un objeto Date
      const date = new Date(lote.fecha);

      // Sumamos un día a la fecha
      date.setDate(date.getDate() + 1);

      // Convertimos la fecha ajustada a string en formato 'yyyy-MM-dd'
      const dateKey = date.toISOString().split("T")[0];

      if (!acc[dateKey]) acc[dateKey] = [];
      acc[dateKey].push(lote);
    }
    return acc;
  }, {});

  return (
    <>
      <DragDropContext onDragEnd={handleDragEndVenta}>
        <div className="container">
          <Row style={{ marginTop: "80px" }}>
            <h1 className="title">LOTES</h1>
          </Row>
          <Row>
            <Col md={3}>
              <Droppable droppableId={String(tomorrow)}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="day-card mb-4"
                  >
                    <div className="day-header">
                      <h3>HOY</h3>
                    </div>
                    {LotesHoy.map((lote, index) => (
                      <div>
                        <div
                          className="venta-card shadow-sm p-3 mb-4 bg-white rounded"
                          onClick={() => setLoteClickFunct(lote.idlote)}
                        >
                          <Row className="align-items-center">
                            <Col>
                              <div
                                style={{ fontSize: "20px" }}
                                className="fw-bold"
                              >
                                {lote.nombre}
                              </div>
                              <div style={{ fontSize: "15px" }}>
                                {GetPasosLote(lote)}
                              </div>
                            </Col>
                          </Row>
                        </div>
                        <Row>
                          {LoteClick === lote.idlote && (
                            <Col
                              className="venta-card"
                              style={{ marginBottom: "25px", width: "30px" }}
                            >
                              <Button onClick={DeleteLote}>Eliminar</Button>
                            </Col>
                          )}
                        </Row>
                      </div>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </Col>
            <Col md={6}>
              <Row>
                {dateRange.map((date) => (
                  <Col md={6} key={date}>
                    <Droppable droppableId={String(date)}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="day-card mb-4"
                        >
                          <div className="day-header">
                            <h3>{formatDate(date)}</h3>
                          </div>
                          {(groupedLotes[date] || []).map((lote, index) => (
                            <div>
                            <div
                              className="venta-card shadow-sm p-3 mb-4 bg-white rounded"
                              onClick={() => setLoteClickFunct(lote.idlote)}
                            >
                              <Row className="align-items-center">
                                <Col>
                                  <div
                                    style={{ fontSize: "24px" }}
                                    className="fw-bold"
                                  >
                                    {lote.nombre}
                                  </div>
                                  <div style={{ fontSize: "15px" }}></div>
                                </Col>
                              </Row>
                            </div>
                            <Row>
                          {LoteClick === lote.idlote && (
                            <Col
                              className="venta-card"
                              style={{ marginBottom: "25px", width: "30px" }}
                            >
                              <Button onClick={DeleteLote}>Eliminar</Button>
                            </Col>
                          )}
                        </Row>
                            </div>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </Col>
                ))}
              </Row>
            </Col>
            <Col md={3}>
              {Modal ? (
                <DragDropContext onDragEnd={handleDragEndPaso}>
                  <Droppable droppableId="sin-fecha">
                    {(provided) => (
                       <div ref={provided.innerRef} {...provided.droppableProps}>
                        <Button
                          className="butt"
                          onClick={() => setModal(false)}
                        >
                          Cerrar
                        </Button>
                        <h2>{VentaSelecc.cliente.nombre}</h2>
                        <h2>{VentaSelecc.obra}</h2>
                        <h3>{VentaSelecc.fechaInstalacion}</h3>
                        {articuloSelecc.map((art, index) => (
                          <Draggable
                            draggableId={String(art.idRoller)}
                            index={index}
                            key={art.idRoller}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="venta-card shadow-sm p-3 mb-4 bg-white rounded"
                              >
                                <Row className="align-items-start">
                                  <Col>
                                    <div className="fw-bold">
                                      {art.tipoArticulo}
                                    </div>
                                    <div>
                                      {art.ancho} X {art.alto}
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              ) : (
                <Droppable droppableId="sin-fecha">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      <div className="day-header">
                        <h3>Ventas</h3>
                      </div>
                      {Ventas.map((Venta, index) => (
                        <Draggable
                          draggableId={String(Venta.id)}
                          index={index}
                          key={Venta.id}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="venta-card3 shadow-sm p-3 mb-4 bg-white rounded"
                              onClick={() => setPasosVenta(Venta.id)}
                            >
                              <Row className="align-items-center">
                                <Col>
                                  <div
                                    style={{ fontSize: "18px" }}
                                    className="fw-bold"
                                  >
                                    {Venta.cliente.nombre}
                                  </div>
                                  <div style={{ fontSize: "15px" }}>
                                    {GetPasos(Venta.id)}
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              )}
            </Col>
          </Row>
        </div>
      </DragDropContext>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            zIndex: 9999,
          },
        }}
      />
    </>
  );
};
