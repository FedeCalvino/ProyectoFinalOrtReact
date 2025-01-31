import React, { useState, useEffect, useRef } from "react";
import { Row, Col, Form, Button, Modal } from "react-bootstrap";
import { VentaView } from "../Componentes/VentaView";
import { useDispatch, useSelector } from "react-redux";
import {
  setArticulos,
  setVenta,
  selectVenta,
} from "../Features/VentaViewReucer.js";
import "./Css/Ventas.css";
import { pdf } from "@react-pdf/renderer";
import { OrdenProduccion } from "../Componentes/OrdenProduccion.jsx";
import { Toaster, toast } from "react-hot-toast";
import {
  selectRollerConfig,
  selectConfigRiel,
} from "../Features/ConfigReducer";
import { Loading } from "../Componentes/Loading";

export const Ventas = () => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const [SearchText, setSearchText] = useState("");
  const [Tamano, setTamano] = useState("1");
  const [Ventas, setVentas] = useState([]);
  const [VentasTotales, setVentasTotales] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const idVenta = useSelector(selectVenta).id;
  let lastDay = "";
  const [ConfirmDelete, setConfirmDelete] = useState(false);
  const [loadingDelete, setloadingDelete] = useState(false);
  
  const ConfigRoller = useSelector(selectRollerConfig);

  const UrlVentas = "/VentasEP";
  const UrlVenta = "/VentasEP/";
  const UrlDelete = "/VentasEP/";
/*
  const UrlVentas = "http://localhost:8083/Ventas";
  const UrlVenta = "http://localhost:8083/Ventas/";
  const UrlDelete = "http://localhost:8083/VentasEP/";
*/
  const setVentaView = async (Venta) => {
    console.log(ConfigRoller)
    if(ConfigRoller.length!=0){
      if (Venta.id != null) {
        setShowModal(true);
        setIsLoading(true);
  
        try {
          const res = await fetch(UrlVenta + Venta.id);
          const data = await res.json();
          console.log("articulos", data.body.listaArticulos);
          console.log(data.body)
          dispatch(setArticulos(data.body.listaArticulos));
          dispatch(setVenta(data.body));
        } catch (error) {
          console.log(error);
        } finally {
          setIsLoading(false);
        }
      }
    }else{
      toast.error("Las configuraciones de rollers no estan cargadas")
    }
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
      setloadingDelete(true)
      const requestOptionsventa = {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      };
      try {
        const response = await fetch(
          UrlDelete + idVenta,
          requestOptionsventa
        );
        if (response.ok) {
          setloadingDelete(false)
          handleClose();
          FetchVentas();
          toast.success("venta eliminada")
        } else {
          toast.error("error al eliminar")
          console.error("Error al eliminar la venta", response.status);
          setloadingDelete(false)
        }
      } catch (error) {
        toast.error("error al eliminar",error)
        setloadingDelete(false)
        console.error("Error al realizar la solicitud", error);
      }
    }
  };

  const [toastloading, settoastloading] = useState(null);

const callBackToast = (mensaje, tipo) => {
  if (tipo === "error") {
    toast.error(mensaje);
  }
  if (tipo === "success") {
    toast.success(mensaje);
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
            <VentaView callBackToast={callBackToast} />
          )}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
        {loadingDelete ? 
            <div style={{marginLeft:"10px"}}>
            <Loading tipo="small"/>
            </div>
            : 

          ConfirmDelete ? (
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
      <div>
        <Toaster
          position="bottom-center"
          reverseOrder={false}
          toastOptions={{
            style: {
              zIndex: 9999,
            },
          }}
        />
      </div>
    </div>
  );
};
