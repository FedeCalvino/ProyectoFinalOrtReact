import React, { useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { FormRollers } from "../Forms/FormRollers";
import { FormTradicional } from "../Forms/FormTradicional";
import { FormRieles } from "../Forms/FormRieles";
import { Row, Col } from "react-bootstrap";
import { TablaArticulos } from "../Tables/TablaArticulos";

export const AgregarArticulo = () => {
  const toastCallBack = () => {};
  return (
    <Row>
      <Col>
        <Tabs
          defaultActiveKey="Roller"
          id="fill-tab-example"
          className="mb-2 custom-tabs"
          fill
        >
          <Tab eventKey="Roller" title="Roller">
            <FormRollers toastCallBack={toastCallBack} />
          </Tab>
          <Tab eventKey="Rieles" title="Rieles">
            <FormRieles toastCallBack={toastCallBack} />
          </Tab>
          <Tab eventKey="Tradicional" title="Tradicional">
            <FormTradicional toastCallBack={toastCallBack} />
          </Tab>
          <Tab eventKey="Romana" title="Romana">
            <FormRomanas toastCallBack={toastCallBack} />
          </Tab>
        </Tabs>
      </Col>
      <Col>
        <TablaArticulos />
      </Col>
    </Row>
  );
};
