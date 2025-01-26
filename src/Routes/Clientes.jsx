import { React, useState, useEffect, useCallback } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import "./ClienteList.css";
import { Loading } from "../Componentes/Loading";

export const Clientes = () => {
  const UrlClientes = "/ClientesEP";
  const [Clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [BoolEditCli, setBoolEditCli] = useState(false);
  const [DeleteCliBoolConfirm, setDeleteCliBoolConfirm] = useState(false);
  const [EditCliId, setEditCliId] = useState(null);
  const [CliChanged, setCliChanged] = useState(false);

  useEffect(() => {
    FetchClientes();
  }, []);

  const EditCli = async (Cli) => {
    try {
      console.log(Cli)
      console.log(CliChanged)
      if (CliChanged) {
        const res = await fetch(UrlClientes, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre: Cli.nombre,
            numeroTelefono: Cli.numeroTelefono,
            rut: Cli.rut,
            direccion: Cli.direccion,
            Tipo:Cli.Tipo
          }),
        });
        // Manejar la respuesta
        if (!res.ok) {
          throw new Error(`Error: ${res.statusText}`);
        } else {
          setEditCliId(null);
        }
      }else{
        setEditCliId(null);
      }
      setCliChanged(false)
    } catch (error) {
      console.error("Error al actualizar el cliente:", error);
    }
  };
  const DeleteCli = async (IdCli) => {
    console.log("IdCli", IdCli);
    try {
      // Realizar la petición PUT
      const res = await fetch(UrlClientes + "/" + IdCli, {
        method: "Delete",
        headers: {
          "Content-Type": "application/json",
        },
      });
      // Manejar la respuesta
      if (!res.ok) {
        throw new Error(`Error: ${res.statusText}`);
      } else {
        FetchClientes();
      }
    } catch (error) {
      console.error("Error al eliminar el cliente:", error);
    }
  };

  const handleInputChange = (e, IdCli, field) => {
    setCliChanged(true)
    const updatedClis = Clientes.map((cli) => {
      if (cli.id === IdCli) {
        return { ...cli, [field]: e.target.value };
      }
      return cli;
    });
    setClientes(updatedClis);
  };

  const FetchClientes = async () => {
    try {
      const res = await fetch(UrlClientes);
      const data = await res.json();

      setClientes(data.body);
      setLoading(false);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <Loading tipo="all" />;
  }
  return (
    <Row style={{marginTop:"90px"}} className="justify-content-center">
      {Clientes.map((Cli) => (
        <Col key={Cli.id} xs={12} md={6} lg={4} className="mb-4">
          <Card
            className={`custom-card ${EditCliId === Cli.id ? "active" : ""}`}
            onClick={() => {
              if (EditCliId !== Cli.id) {
                setEditCliId(Cli.id);
                setDeleteCliBoolConfirm(false);
                setBoolEditCli(false);
                setCliChanged(false)
              }
            }}
          >
            <Card.Body>
              <Card.Title>{Cli.nombre}</Card.Title>
              <Card.Text>
                <strong>Teléfono:</strong>
                {EditCliId === Cli.id && BoolEditCli ? (
                  <>
                    <input
                      className="custom-input"
                      type="text"
                      value={Cli.numeroTelefono}
                      onChange={(e) =>
                        handleInputChange(e, Cli.id, "numeroTelefono")
                      }
                    />
                  </>
                ) : (
                  Cli.numeroTelefono
                )}
                <br />
                <strong>RUT:</strong>
                {EditCliId === Cli.id && BoolEditCli ? (
                  <>
                    <input
                      className="custom-input"
                      type="text"
                      value={Cli.rut}
                      onChange={(e) => handleInputChange(e, Cli.id, "rut")}
                    />
                  </>
                ) : (
                  Cli.rut
                )}
                <br />
                <strong>Mail:</strong>
                {EditCliId === Cli.id && BoolEditCli ? (
                  <>
                    <input
                      className="custom-input"
                      type="text"
                      value={Cli.mail}
                      onChange={(e) => handleInputChange(e, Cli.id, "mail")}
                    />
                  </>
                ) : (
                  Cli.mail
                )}
                <br />
                <strong>Dirección:</strong>
                {EditCliId === Cli.id && BoolEditCli ? (
                  <>
                    <input
                      className="custom-input2"
                      type="text"
                      value={Cli.direccion}
                      onChange={(e) =>
                        handleInputChange(e, Cli.id, "direccion")
                      }
                    />
                    <br />
                    
                    <button
                      style={{ width: "100%", border: "1px solid white" }}
                      className="custom-button"
                      onClick={() => EditCli(Cli)}
                    >
                      Confirmar
                    </button>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "10px",
                      }}
                    >
                      {DeleteCliBoolConfirm ? (
                        <button
                          style={{ width: "50%", border: "1px solid white" }}
                          className="custom-button2"
                          onClick={() => DeleteCli(Cli.id)}
                        >
                          Eliminar El Cliente?
                        </button>
                      ) : (
                        <button
                          style={{ width: "40%", border: "1px solid white" }}
                          className="custom-button2"
                          onClick={() => setDeleteCliBoolConfirm(true)}
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </>
                ) : 
                  <>
                  {Cli.direccion}
                  <br />
                  <strong>Tipo: </strong>
                  {Cli.Tipo ? Cli.Tipo : "Cliente"}
                  </>
                }
                {EditCliId === Cli.id && !BoolEditCli ? (
                  <>
                    <button
                      style={{ width: "100%", border: "1px solid white" }}
                      className="custom-button"
                      onClick={() => setBoolEditCli(true)}
                    >
                      Editar
                    </button>
                  </>
                ) : null}
                
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};