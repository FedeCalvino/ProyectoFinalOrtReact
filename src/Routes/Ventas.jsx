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
import { AgregarArticulo } from "../Componentes/AgregarArticulo.jsx";
import { removeAllArticulos, selectArticulos } from "../Features/ArticulosReducer";
import { VentaPreview } from "../Componentes/VentaPreview";
import StatusCard from "../Componentes/StatusCard.jsx";
export const Ventas = () => {
  const [isLoading, setIsLoading] = useState(false);
  const Ven = useSelector(selectVenta);
  const dispatch = useDispatch();
  const [SearchText, setSearchText] = useState("");
  const [Tamano, setTamano] = useState("1");
  const [Ventas, setVentas] = useState([]);
  const [VentasTotales, setVentasTotales] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [ShowModalConfirmArt, setShowModalConfirmArt] = useState(false);
  const [VentaInfo, setVentaInfo] = useState(null);
  const [AddArt, setAddArt] = useState(false);
  const [Agregando, setAgregando] = useState(false);
  const Articulos = useSelector(selectArticulos);
  const idVenta = Ven.id;
  let lastDay = "";
  const [ConfirmDelete, setConfirmDelete] = useState(false);
  const [loadingDelete, setloadingDelete] = useState(false);
  const [Pagina, setPagina] = useState(0);
  const ConfigRoller = useSelector(selectRollerConfig);


  
  const UrlVentas = "/VentasEP";
  const UrlVenta = "/VentasEP/";
  const UrlDelete = "/VentasEP/";
  
/*
  const UrlVentas = "http://200.40.89.254:8081/Ventas";
  const UrlVenta = "http://200.40.89.254:8086/Ventas/";
  const UrlDelete = "http://200.40.89.254:8086/Ventas/";
*/


  const setVentaView = async (Venta) => {
    console.log(ConfigRoller)
    if (ConfigRoller.length != 0) {
      if (Venta.id != null) {
        setShowModal(true);
        setIsLoading(true);

        try {
          const res = await fetch(UrlVenta + Venta.id, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIyIiwiaWF0IjoxNzM4NzY4NjA3LCJleHAiOjE3Mzg3NzIyMDcsIm5vbWJyZSI6IjEyMzQ1In0.Ihx6ZdPhMp9xP8-5erZDkD5lUS-afw5SciY75OPweu2vtAAS4XMnVUX0yM02wggCcOqVhdzgcm18oV55y9kP0w`,
              'Content-Type': 'application/json'
            }
          });
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
    } else {
      toast.error("Las configuraciones de rollers no estan cargadas")
    }
  };
  const callBackAddArt = () => {
    setAddArt(true)
    setShowModal(false)
    dispatch(removeAllArticulos())
  }
  const sumarPagina = () => {
    console.log("Pagina", Pagina)
    FetchVentas(+1)
    setPagina(prev => prev + 1);
  };
  const restarPagina = () => {
    FetchVentas(-1)
    setPagina(prev => prev - 1);
  };
  const FetchVentas = async (adelanto) => {
    setVentas([]);
    try {
      console.log("Pagina", Pagina);
      const nuevaPagina = parseInt(Pagina) + parseInt(adelanto);
      console.log(nuevaPagina)
      const res = await fetch(`${UrlVentas}/Paginas/${nuevaPagina}`);
      const data = await res.json();
      console.log("dataaa", data);
      const sortedData = data.body.sort(
        (a, b) => new Date(b.fecha) - new Date(a.fecha)
      );
      setVentas(sortedData);
      setVentasTotales(sortedData);
    } catch (error) {
      console.log(error);
      toast.error("Error al cargar las ventas");
    }
  };




  useEffect(() => {
    FetchVentas(0);
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
        venta.obra.cliente.nombre.toLowerCase().includes(SearchText.toLowerCase())
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
    setIsLoading(false);
    setAddArt(false)
  };

  const handleCloseAddArt = () => {
    setConfirmDelete(false);
    setShowModal(true);
    setIsLoading(false);
    setAddArt(false)
  };

  const ConfirmAgregarArticulos = async () => {
    if (Articulos.length > 0) {
      setAgregando(true);
      const loadingToast = toast.loading("Cargando...");

      const VentaModel = {
        Articulos
      };

      console.log("VentaModel", VentaModel)

      console.log("VentaModel", VentaModel);

      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Articulos),
      };

      console.log(Articulos);

      try {
        const response = await fetch(UrlVenta + "AddArt/" + Ven.id, requestOptions);

        console.log("Response:", response);

        if (!response.ok) {
          toast.dismiss(loadingToast);
          setCreando(false);
          toast.error("Error al crea la ventar");
          console.error("Error en la solicitud:", response.statusText);
          return;
        }
        toast.dismiss(loadingToast);
        setShowModal(false)
        setShowModalConfirmArt(false)
        const result = await response.json();
        setAgregando(false);
        console.log("Response Venta", result);
      } catch (error) {
        setAgregando(false);
        toast.dismiss(loadingToast);
        toast.error("Error al crea la ventar")
      }
    } else {
      setAgregando(false);
      setShowModal(false)
      toast.error("No hay articulos");
    }
  }

  const ConfirmAddArt = () => {
    const VentaInfoObj = {
      CliNombre: Ven.obra.cliente.Nombre,
      Obra: Ven.obra.nombre,
      FechaInstalacion: Ven.obra.fechaInstalacion
    }
    setVentaInfo(VentaInfoObj)
    setAddArt(false)
    setShowModalConfirmArt(true)
  }

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
          FetchVentas(0);
          toast.success("venta eliminada")
        } else {
          toast.error("error al eliminar")
          console.error("Error al eliminar la venta", response.status);
          setloadingDelete(false)
        }
      } catch (error) {
        toast.error("error al eliminar", error)
        setloadingDelete(false)
        console.error("Error al realizar la solicitud", error);
      }
    }
  };
  const getStatus = (Venid) => {

  }


  const [toastloading, settoastloading] = useState(null);

  const callBackToast = (mensaje, tipo) => {
    if (tipo === "error") {
      toast.error(mensaje);
    }
    if (tipo === "success") {
      toast.success(mensaje);
    }
  };
  const getStatuses =()=>{

  }


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
        <Col>
        </Col>
      </Row>

      <div>
        {Object.entries(groupedVentas).map(([date, ventasDelDia]) => {
          const sortedVentasDelDia = ventasDelDia
            .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
            ;

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
                        {Ven.obra.cliente?.nombre}
                      </div>
                      <div className="text-muted">{Ven.obra.nombre && Ven.obra.nombre}</div>
                    </Col>
                    <Col>
                      {!Ven.fechaInstalacion ? (
                        <span style={{ color: "red" }}>
                          Sin fecha de entrega
                        </span>
                      ) : new Date(Ven.fechaInstalacion) < Date.now() ? (
                         <span style={{ color: "green" }}>
                          Fecha de entrega pasada
                        </span>
                      ) : (
                        <StatusCard statuses={{ telaCortada: Ven.estadoCorteTela, canoCortado: false, armado: true, probado: false }} />
                       
                      )}

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
            {isLoading ? null : <>Detalle de la Venta: {Ven.id - 19000}</>}
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
            <VentaView callBackToast={callBackToast} callBackAddArt={callBackAddArt} />
          )}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          {loadingDelete ?
            <div style={{ marginLeft: "30px" }}>
              <Loading tipo="small" />
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

      {/*modal de agregar articulo */}
      <Modal show={AddArt} onHide={handleCloseAddArt} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{Ven.obra?.cliente?.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AgregarArticulo />
          <Button style={{ margin: "40px", width: "80%" }} variant="primary" onClick={ConfirmAddArt}>
            Agregar
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>

      {/*modal confirmar agregar articulo */}
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
              {Agregando ?
                <Loading tipo="small" />
                :
                <Button
                  className="custom-button"
                  variant="primary"
                  onClick={() => {
                    ConfirmAgregarArticulos();
                  }}
                >
                  Agregar
                </Button>
              }
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
            style: {
              zIndex: 9999,
            },
          }}
        />
      </div>
      <Row>
        <div style={{ padding: '20px' }}>
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button onClick={restarPagina} disabled={Pagina === 0}>
              ⬅️
            </button>
            <span>Página {Pagina + 1}</span>
            <button onClick={sumarPagina}>
              ➡️
            </button>
          </div>
        </div>
      </Row>
    </div>
  );
};
