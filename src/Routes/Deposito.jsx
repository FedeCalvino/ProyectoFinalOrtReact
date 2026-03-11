import React from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import TabDepositoRollos from "../Componentes/TabDepositoRollos";
import TabAgregarRollo from "../Componentes/TabAgregarRollo";

export const Deposito = () => {
  return (
    <>
    <h1 style={{display:"flex",justifyContent:"center",margin:"40px"}}>Deposito</h1>
<Tabs
  defaultActiveKey="stock"
  fill
  justify
  className="mb-3"
  style={{
    width: "100%",
    display: "flex",
    justifyContent: "center"
  }}
>

  <Tab
    eventKey="stock"
    title="Stock Rollos"
    tabClassName="text-center"
  >
    <TabDepositoRollos />
  </Tab>

  <Tab
    eventKey="agregar"
    title="Agregar Rollo"
    tabClassName="text-center"
  >
    <TabAgregarRollo />
  </Tab>

</Tabs>
</>
  );
};

