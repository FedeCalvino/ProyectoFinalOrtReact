import { React, useState, useEffect, useCallback } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import dayjs from "dayjs";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "dayjs/locale/es";
import { Button, ListGroup } from "react-bootstrap";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ButtonToolbar from "react-bootstrap/ButtonToolbar";
import Form from "react-bootstrap/Form";
import  TimePicker  from 'react-bootstrap-time-picker'; // Time picker for selecting time.
import { FormularioInstalacion } from "./FormularioInstalacion";
import { Loading } from "./Loading";


dayjs.locale("es");
const DragAndDropCalendar = withDragAndDrop(Calendar);

export const Instalaciones = () => {
  const UrlVentas = "/VentasEP";
  const [Ventas, setVentas] = useState([]);
  const [VentaSelecc, setVentaSelecc] = useState(null);
  const [Events, setEvents] = useState([]);
  const [mostrarListaCompleta, setMostrarListaCompleta] = useState(true);
   const[loading,setloading]=useState(true)
  const FetchVentas = async () => {
    try {
      const res = await fetch(UrlVentas);
      const data = await res.json();
      console.error(data);
      setVentas(data.body);
      setloading(false)
    } catch (error) {
      console.error(error);
    }
  };

  const FetchInstalaciones = async () => {
    const Events = [];
    try {
        const response = await fetch("/InstalacionEP");
        const result = await response.json();
        console.log(result.body)
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
        console.log(Events);
    } catch (error) {
        console.log(error);
    }
};

  useEffect(() => {
    FetchVentas();
    FetchInstalaciones();
  }, []);

  const handleSelectVenta = (venta) => {
    setVentaSelecc(venta);
    setMostrarListaCompleta(false);
    console.log("Venta seleccionada:", venta);
  };

  const handleMostrarListaCompleta = () => {
    setVentaSelecc(null); 
    setMostrarListaCompleta(true); 
  };

  const localizar = dayjsLocalizer(dayjs);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: 3, padding: "10px" }}>
        <DragAndDropCalendar
          style={{ height: "80vh" }}
          localizer={localizar}
          defaultView="month"
          selectable={true}
          events={Events}
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
