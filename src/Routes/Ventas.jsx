import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Form, Button, Modal } from "react-bootstrap";
import { VentaView } from "../Componentes/VentaView";
import { useDispatch, useSelector } from "react-redux";
import {
  setCortinas,
  setVenta,
  selectVenta,
} from "../Features/VentaViewReucer.js";
import "./Css/Ventas.css";
import { pdf } from "@react-pdf/renderer";
import { PDFTela } from "../Componentes/PDFTela";

export const Ventas = () => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const [SearchText, setSearchText] = useState("");
  const [Tamano, setTamano] = useState("1");
  const [Ventas, setVentas] = useState([]);
  const [VentasTotales, setVentasTotales] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const idVenta = useSelector(selectVenta).IdVenata;
  let lastDay = "";
  const [ConfirmDelete, setConfirmDelete] = useState(false);
  const UrlVentas = "/VentasEp";
  const UrlVenta = "/VentasEp/";
  const UrlDelete = "/Ventas/Del/";

  const setVentaView = async (Venta) => {
    if (Venta.id != null) {
      setShowModal(true);
      setIsLoading(true);

      try {
        const res = await fetch(UrlVenta + Venta.id);
        const data = await res.json();
        console.log("articulos", data.body.listaArticulos);
        console.log(data.body)
        dispatch(setCortinas(data.body.listaArticulos));
        dispatch(setVenta(data.body));
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const downloadPDF = async () => {
    // Generar el documento PDF utilizando la función `pdf`
    setloadingpdf(true);
    console.log(ComentarioVenta);
    const blob = await pdf(<PDFTela Venta={Ven} />).toBlob();

    // Crear un enlace de descarga
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${Ven.NombreCliente} O.C.pdf`;

    link.click();

    URL.revokeObjectURL(link.href);
    setloadingpdf(false);
  };

  const FetchVentas = async () => {
    try {
      const res = await fetch(UrlVentas);
      const data = await res.json();
      console.log(data);
      const sortedData = data.body.sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha)
      );
      setVentas(sortedData);
      setVentasTotales(sortedData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    FetchVentas();
  }, []);

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

  const groupedVentas = Ventas.reduce((acc, venta) => {
    const dateKey = venta.fecha.split("T")[0];
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(venta);
    return acc;
  }, {});

  const FiltrarVentas = () => {
    if (SearchText.trim()) {
      const filtered = VentasTotales.filter((venta) =>
        venta.NombreCliente.toLowerCase().includes(SearchText.toLowerCase())
      );
      setVentas(filtered);
    } else {
      setVentas(VentasTotales);
    }
  };

  useEffect(() => {
    FiltrarVentas();
    lastDay = "";
  }, [SearchText]);

  const handleClose = () => {
    setConfirmDelete(false);
    setShowModal(false);
    setIsLoading(false); // Restablece el estado de carga
  };
  
  const handleDelete = async () => {
    console.log(idVenta);
    if (idVenta != null) {
      const requestOptionsCliente = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      };
      try {
        const response = await fetch(
          UrlDelete + idVenta,
          requestOptionsCliente
        );
        if (response.ok) {
          handleClose();
          FetchVentas();
        } else {
          console.error("Error al eliminar la venta", response.status);
        }
      } catch (error) {
        console.error("Error al realizar la solicitud", error);
      }
    }
  };

  return (
    <div className="container">
      <Row style={{ marginTop: "80px" }}>
        <h1 className="title">VENTAS</h1>
      </Row>
      <Row>
        <Col></Col>
        <Col>
          <div className="search-container">
            <Form.Control
              type="text"
              value={SearchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Buscar por cliente"
              className="search-input"
            />
          </div>
        </Col>
        <Col></Col>
      </Row>

      <div>
        {Object.entries(groupedVentas).map(([date, ventasDelDia]) => {
          const sortedVentasDelDia = ventasDelDia
            .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
            .reverse();

          return (
            <React.Fragment key={date}>
              <MostrarDia Day={date} />
              {sortedVentasDelDia.map((Ven) => (
                <div
                  className={`venta-card${Tamano} shadow-sm p-3 mb-4 bg-white rounded`}
                  onClick={() => setVentaView(Ven)}
                  key={Ven.id}
                >
                  <Row className="align-items-center">
                    <Col md={7}>
                      <div style={{ fontSize: "26px" }} className="fw-bold">
                        {Ven.cliente.nombre}
                      </div>
                      <div className="text-muted">{Ven.obra && Ven.obra}</div>
                    </Col>
                  </Row>
                </div>
              ))}
            </React.Fragment>
          );
        })}
      </div>

      <Modal
        show={showModal}
        onHide={handleClose}
        dialogClassName="custom-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title style={{ textAlign: "center", width: "100%" }}>
            {isLoading ? null : <>Detalle de la Venta</>}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {isLoading ? (
            <div className="text-center">
              <div
                className="spinner-border"
                role="status"
                style={{ width: "4rem", height: "4rem" }} // Cambia el tamaño aquí
              >
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          ) : (
            <VentaView />
          )}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          {ConfirmDelete ? (
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
    </div>
  );
};
