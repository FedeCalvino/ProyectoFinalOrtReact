import { React, useState, useEffect } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import "dayjs/locale/es";  // Asegúrate de importar el idioma español
import { Button, ListGroup } from "react-bootstrap";
import { FormularioInstalacion } from "./FormularioInstalacion";
import { Loading } from "./Loading";

// Configura el idioma de Day.js a español
dayjs.locale("es");

// Crea el localizador para react-big-calendar usando dayjs
const localizer = dayjsLocalizer(dayjs);

// Mensajes en español para las vistas del calendario
const messages = {
  allDay: "Todo el día",
  previous: "Anterior",
  next: "Siguiente",
  today: "Hoy",
  month: "Mes",
  week: "Semana",
  day: "Día",
  agenda: "Agenda",
  date: "Fecha",
  time: "Hora",
  event: "Evento",
  showMore: (total) => `+ Ver más (${total})`, // Puedes personalizar esta línea
};

const DragAndDropCalendar = withDragAndDrop(Calendar);

export const Instalaciones = () => {
  const UrlVentas = "/VentasEP";
  const [Ventas, setVentas] = useState([]);
  const [VentaSelecc, setVentaSelecc] = useState(null);
  const [Events, setEvents] = useState([]);
  const [mostrarListaCompleta, setMostrarListaCompleta] = useState(true);
  const [loading, setLoading] = useState(true);

  const FetchVentas = async () => {
    try {
      const res = await fetch(UrlVentas);
      const data = await res.json();
      setVentas(data.body);
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const FetchInstalaciones = async () => {
    const Events = [];
    try {
      const response = await fetch("/InstalacionEP");
      const result = await response.json();
      result.body.forEach(res => {
        const startDayjs = dayjs(res.start);
        const endDayjs = dayjs(res.end);
        const startDate = startDayjs.toDate();
        const endDate = endDayjs.toDate();
        const NewEvent = {
          IdInstalacion: res.id,
          Aclaraciones: res.aclaraciones,
          IdVenta: res.idVenta,
          start: startDate,
          end: endDate,
          title: res.title
        };
        Events.push(NewEvent);
      });
      setEvents(Events);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    FetchVentas();
    FetchInstalaciones();
  }, []);

  const handleSelectVenta = (venta) => {
    setVentaSelecc(venta);
    setMostrarListaCompleta(false);
  };

  const handleMostrarListaCompleta = () => {
    setVentaSelecc(null);
    setMostrarListaCompleta(true);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: 3, padding: "10px" }}>
        <DragAndDropCalendar
          style={{ height: "80vh" }}
          localizer={localizer}
          defaultView="month"
          selectable={true}
          events={Events}
          messages={messages}  // Agrega los mensajes en español aquí
        />
      </div>
      <div style={{ flex: 1, ...(loading ? { display: "flex", justifyContent: "center", alignItems: "center" } : {}) }}>
        {loading ? (
          <Loading tipo="loading" />
        ) : (
          <>
            {mostrarListaCompleta ? (
              <>
                <h5>Ventas Disponibles</h5>
                <ListGroup style={{ height: "90%" }}>
                  {Ventas.map((venta) => (
                    <ListGroup.Item
                      key={venta.id}
                      action
                      onClick={() => handleSelectVenta(venta)}
                      active={VentaSelecc?.id === venta.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <p style={{ margin: 0 }}>{venta.cliente.nombre}</p>
                      {venta.fechaInstalacion != null && (
                        <p style={{ margin: 0 }}>{venta.fechaInstalacion.slice(-5)}</p>
                      )}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </>
            ) : (
              <FormularioInstalacion Venta={VentaSelecc} callBackVolver={handleMostrarListaCompleta} />
            )}
          </>
        )}
      </div>
    </div>
  );
};
