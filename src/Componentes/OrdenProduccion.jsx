import React from "react";
import {
  Document,
  Text,
  Page,
  StyleSheet,
  Image,
  View,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 20,
  },
  tableHeader: {
    backgroundColor: "#f0f0f0",
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    fontSize: 12,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    width: "100%",
  },
  itemD: {
    marginBottom: "20px",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    fontSize: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    width: "100%",
  },
  // Columnas de la tabla
  tableHeaderCell2: {
    width: "4%", // Número
    textAlign: "center",
  },
  tableHeaderCell1: {
    width: "15%", // Ambiente tiene más espacio
    textAlign: "center",
  },
  tableHeaderCell: {
    width: "6%", // Otras columnas pequeñas
    textAlign: "center",
  },
  tableHeaderCellTipo:{
    width: "16%",
    textAlign: "center",
  },
  tableHeaderCell3: {
    width: "6%", // Otras columnas pequeñas
    textAlign: "center",
  },
  tableHeaderCellPosicion: {
    width: "15%", // Posición con mayor prioridad
    textAlign: "center",
  },
  tableHeaderCellLado: {
    width: "10%", // Lado con mayor prioridad
    textAlign: "center",
  },
  tableHeaderCellMotor: {
    width: "10%", // Motor con mayor prioridad
    textAlign: "center",
  },

  // Celdas de la tabla
  tableCell2: {
    width: "4%", // Número
    textAlign: "center",
  },
  tableCell1: {
    width: "15%", // Ambiente tiene más espacio
    textAlign: "center",
  },
  logoContainer: {
    position: "absolute",
    top: 12,
    right: 21,
  },
  logo: {
    marginTop: "5px",
    width: 80,
    height: 60,
    marginBottom: 15,
  },
  title1: {
    fontSize: 22,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  tableCell: {
    width: "6%", // Otras celdas pequeñas
    textAlign: "center",
  },
  tableCellPosicion: {
    width: "15%", // Posición con mayor prioridad
    textAlign: "center",
  },
  tableCellLado: {
    width: "10%", // Lado con mayor prioridad
    textAlign: "center",
  },
  tableCellMotor: {
    width: "10%", // Motor con mayor prioridad
    textAlign: "center",
  },
  itemContainer: {
    border: "1px solid #ddd",
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
    boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
  },
  itemText: {
    marginBottom: 5,
    lineHeight: 1.5,
  },
  itemLabel: {
    fontWeight: "bold",
    color: "#333",
  },
  pageRiel: {
    flexDirection: "column",
    padding: 10,
  },
  containerRiel: {
    flexDirection: "row",
    flexWrap: "wrap", // Permite que los elementos se dividan en dos filas
    justifyContent: "space-between",
  },
  itemContainerRiel: {
    width: "48%", // Ocupa la mitad del ancho con un pequeño margen
    height: "48%",
    border: "2px solid black",
    borderRadius: 5,
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#fff",
  },
  subtitle2:{
    fontSize:28
  }
});

const FormatearFecha = ({ fecha }) => {
  if (!fecha) return ""; // Maneja el caso donde la fecha es nula o indefinida
  const partesFecha = fecha.split("-");
  if (partesFecha.length !== 3) return ""; // Maneja el caso donde la fecha no tiene el formato correcto
  const [anio, mes, dia] = partesFecha;
  return `${dia}/${mes}/${anio}`;
};

const Header = ({ Datos }) => (
  <>
    {Datos.fechaInst ? (
      <Text style={styles.title1}>
        Fecha Instalación: <FormatearFecha fecha={Datos.fechaInst} />
      </Text>
    ) : (
      <Text style={styles.title1}>Fecha Instalación: A confirmar</Text>
    )}
    <View style={styles.logoContainer}>
      <Image style={styles.logo} src="ImgLogo2.png" />
    </View>
    <Text style={styles.subtitle2}>Cliente: {Datos.cliNomb}</Text>
    <Text style={styles.subtitle}>Obra: {Datos.obra || "N/A"}</Text>
  </>
);



const ItemDetail = ({ label, value }) => (
  <Text style={styles.itemText}>
    <Text style={styles.itemLabel}>{label}: </Text>
    {value || "N/A"}
  </Text>
);

const TelaTitle = ({ tela }) => <Text style={styles.title}>Tela: {tela}</Text>;

export const OrdenProduccion = ({ Venta }) => {
  console.log("Ventas", Venta);
  //Ventas.map((Venta)=>{

  const Cortinasroller = Venta.listaArticulos.filter(
    (art) => art.nombre === "Roller"
  );
  const existeAlgunMotor = Cortinasroller.find(Roll=>Roll.MotorRoller.idMotor!==1)
  console.log("existeAlgunMotor",existeAlgunMotor)
  const Rieles = Venta.listaArticulos.filter((art) => art.nombre === "Riel");
  const Tradicionales = Venta.listaArticulos.filter(
    (art) => art.nombre === "Tradicional"
  );

  const groupedCortinas = Object.entries(
    Cortinasroller.reduce((groups, cortina) => {
      const key = `${cortina.nombreTela} ${cortina.colorTela}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(cortina);
      return groups;
    }, {})
  );

  const groupedRieles = [];
  for (let i = 0; i < Rieles.length; i += 4) {
    groupedRieles.push(Rieles.slice(i, i + 4));
  }
  

  const groupedTradicionals = [];
  for (let i = 0; i < Tradicionales.length; i += 2) {
    groupedTradicionals.push(Tradicionales.slice(i, i + 2));
  }

  const TableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.tableHeaderCell2, styles.subtitle]}>Nº</Text>
      <Text style={[styles.tableHeaderCell1, styles.subtitle]}>Ambiente</Text>
      <Text style={[styles.tableHeaderCell, styles.subtitle]}>Ancho AF-AF</Text>
      <Text style={[styles.tableHeaderCell, styles.subtitle]}>Ancho Tela</Text>
      <Text style={[styles.tableHeaderCell, styles.subtitle]}>Ancho Caño</Text>
      <Text style={[styles.tableHeaderCell, styles.subtitle]}>Caño</Text>
      <Text style={[styles.tableHeaderCell, styles.subtitle]}>Alto Cortina</Text>
      <Text style={[styles.tableHeaderCell, styles.subtitle]}>Alto Tela</Text>
      <Text style={[styles.tableHeaderCellTipo, styles.subtitle]}>Tipo Cadena</Text>
      <Text style={[styles.tableHeaderCell, styles.subtitle]}>Alto Cadena</Text>
      <Text style={[styles.tableHeaderCellPosicion, styles.subtitle]}>
        Posición
      </Text>
      <Text style={[styles.tableHeaderCellLado, styles.subtitle]}>Lado</Text>
      { existeAlgunMotor &&
      <Text style={[styles.tableHeaderCellMotor, styles.subtitle]}>Motor</Text>
      }
    </View>
  );

  if (Cortinasroller.length > 9) {
    const pages = [];

    groupedCortinas.forEach(([key, cortinas]) => {
      // Dividimos las cortinas en bloques de 9
      for (let i = 0; i < cortinas.length; i += 9) {
        const cortinasSlice = cortinas.slice(i, i + 9);
        pages.push({
          tela: key,
          cortinas: cortinasSlice,
        });
      }
    });

    return (
      <Document>
        {pages.map((page, index) => (
          <Page
            key={index}
            size="A4"
            style={styles.page}
            orientation="landscape"
          >
            <Header Datos={Venta.Datos} />
            <TelaTitle tela={page.tela} />
            <TableHeader />
            {page.cortinas.map((Roll, cortinaIndex) => (
              <View style={styles.tableRow} key={cortinaIndex} border>
                <Text style={[styles.tableCell2, styles.text]}>
                  {Roll.IdArticulo}
                </Text>
                <Text style={[styles.tableCell1, styles.text]}>
                  {Roll.Ambiente}
                </Text>
                <Text style={[styles.tableCell, styles.text]}>
                  {Roll.ancho.toFixed(3)}
                </Text>
                <Text style={[styles.tableCell, styles.text]}>
                  {Roll.AnchoTela.toFixed(3)}
                </Text>
                <Text style={[styles.tableCell, styles.text]}>
                  {Roll.AnchoTubo.toFixed(3)}
                </Text>
                <Text style={[styles.tableCell, styles.text]}>
                  {Roll.cano.tipo}
                </Text>
                <Text style={[styles.tableCell, styles.text]}>
                  {Roll.alto.toFixed(3)}
                </Text>
                <Text style={[styles.tableCell, styles.text]}>
                  {Roll.AltoTela.toFixed(3)}
                </Text>
                
                <Text style={[styles.tableHeaderCellTipo, styles.text]}>
                  {Roll.TipoCadena.tipoCadena}
                </Text>
                <Text style={[styles.tableCell, styles.text]}>
                  {Roll.LargoCadena.toFixed(3)}
                </Text>
                <Text style={[styles.tableCellPosicion, styles.text]}>
                  {Roll.posicion.posicion}
                </Text>
                <Text style={[styles.tableCellLado, styles.text]}>
                  {Roll.ladoCadena.lado}
                </Text>
                { existeAlgunMotor &&
                <Text style={[styles.tableCellMotor, styles.text]}>
                  {Roll.MotorRoller.nombre}
                </Text>   
                }
              </View>
            ))}
          </Page>
        ))}
       {groupedRieles.map((group, pageIndex) => (
          <Page
            key={pageIndex}
            size="A4"
            style={styles.pageRiel}
            orientation="portrait"
          >
            <Header Datos={Venta.Datos} />

            <View style={styles.containerRiel}>
              {group.map((riel, rielIndex) => (
                <View style={styles.itemContainerRiel} key={rielIndex}>
                  <ItemDetail label="Numero" value={riel.numeroArticulo} />
                  <ItemDetail label="Ambiente" value={riel.ambiente} />
                  <ItemDetail label="Ancho" value={riel.ancho.toFixed(3)} />
                  <ItemDetail label="Tipo" value={riel.tipoRiel.tipo} />
                  <ItemDetail label="Acumula" value={riel.ladoAcumula.nombre} />
                  <ItemDetail label="Bastones" value={riel.bastones.nombre} />
                  <ItemDetail
                    label="Cantidad de Bastones"
                    value={riel.bastones.cantidad}
                  />
                  <ItemDetail label="Soportes" value={riel.soportes.nombre} />
                  <ItemDetail
                    label="Cantidad de Soportes"
                    value={riel.soportes.cantidad}
                  />
                  <ItemDetail label="Detalle" value={riel.detalle} />
                </View>
              ))}
            </View>
          </Page>
        ))}
      </Document>
    );
  } else {
    return (
      <Document>
        {Cortinasroller.length > 0 && (
          <>
            <Page size="A4" style={styles.page} orientation="landscape">
              {/* Header */}
              <Header Datos={Venta.Datos} />

              {groupedCortinas.map(([key, cortinas], index) => (
                <React.Fragment key={index}>
                  {/* Tela Title */}
                  <TelaTitle tela={key} />

                  {cortinas.length > 0 && (
                    <>
                      {/* Table Header */}
                      <TableHeader />

                      {/* Cortinas Data Rows */}
                      {cortinas.map((Roll, cortinaIndex) => (
                        <View style={styles.tableRow} key={cortinaIndex} border>
                          <Text style={[styles.tableCell2, styles.text]}>
                            {Roll.numeroArticulo}
                          </Text>
                          <Text style={[styles.tableCell1, styles.text]}>
                            {Roll.Ambiente}
                          </Text>
                          <Text style={[styles.tableCell, styles.text]}>
                            {Roll.ancho.toFixed(3)}
                          </Text>
                          <Text style={[styles.tableCell, styles.text]}>
                            {Roll.AnchoTela.toFixed(3)}
                          </Text>
                          <Text style={[styles.tableCell, styles.text]}>
                            {Roll.AnchoTubo.toFixed(3)}
                          </Text>
                          <Text style={[styles.tableCell, styles.text]}>
                            {Roll.cano.tipo}
                          </Text>
                          <Text style={[styles.tableCell, styles.text]}>
                            {Roll.alto.toFixed(3)}
                          </Text>
                          <Text style={[styles.tableCell, styles.text]}>
                            {Roll.AltoTela.toFixed(3)}
                          </Text>
                          <Text style={[styles.tableHeaderCellTipo, styles.text]}>
                            {Roll.TipoCadena.tipoCadena}
                          </Text>
                          <Text style={[styles.tableCell, styles.text]}>
                            {Roll.LargoCadena.toFixed(3)}
                          </Text>
                          <Text style={[styles.tableCellPosicion, styles.text]}>
                            {Roll.posicion.posicion}
                          </Text>
                          <Text style={[styles.tableCellLado, styles.text]}>
                            {Roll.ladoCadena.lado}
                          </Text>
                          { existeAlgunMotor &&
                          <Text style={[styles.tableCellMotor, styles.text]}>
                            {Roll.MotorRoller.nombre}
                          </Text>
                          }
                        </View>
                      ))}
                    </>
                  )}
                </React.Fragment>
              ))}
            </Page>
          </>
        )}
        {groupedRieles.map((group, pageIndex) => (
          <Page
            key={pageIndex}
            size="A4"
            style={styles.pageRiel}
            orientation="portrait"
          >
            <Header Datos={Venta.Datos} />

            <View style={styles.containerRiel}>
              {group.map((riel, rielIndex) => (
                <View style={styles.itemContainerRiel} key={rielIndex}>
                  <ItemDetail label="Numero" value={riel.numeroArticulo} />
                  <ItemDetail label="Ambiente" value={riel.ambiente} />
                  <ItemDetail label="Ancho" value={riel.ancho.toFixed(3)} />
                  <ItemDetail label="Tipo" value={riel.tipoRiel.tipo} />
                  <ItemDetail label="Acumula" value={riel.ladoAcumula.nombre} />
                  <ItemDetail label="Bastones" value={riel.bastones.nombre} />
                  <ItemDetail
                    label="Cantidad de Bastones"
                    value={riel.bastones.cantidad}
                  />
                  <ItemDetail label="Soportes" value={riel.soportes.nombre} />
                  <ItemDetail
                    label="Cantidad de Soportes"
                    value={riel.soportes.cantidad}
                  />
                  <ItemDetail label="Detalle" value={riel.detalle} />
                </View>
              ))}
            </View>
          </Page>
        ))}

        {groupedTradicionals.map((group, pageIndex) => (
          <Page
            key={pageIndex}
            size="A4"
            style={styles.page}
            orientation="portrait"
          >
            <Header Datos={Venta.Datos} />
            {group.map((tradi, rielIndex) => (
              <View style={styles.itemContainer} key={rielIndex}>
                <ItemDetail
                  label="Tela"
                  value={tradi.nombreTela + " " + tradi.coloTela}
                />
                <ItemDetail label="Numero" value={tradi.numeroArticulo} />
                <ItemDetail label="Ambiente" value={tradi.Ambiente} />
                <ItemDetail label="Pinza" value={tradi.Pinza.nombre} />
                <ItemDetail label="Ganchos" value={tradi.ganchos.nombre} />
                <ItemDetail label="Paños" value={tradi.cantidadPanos} />
                {tradi.cantidadPanos === 1 ? (
                  <>
                    <ItemDetail label="Ancho" value={tradi.ancho.toFixed(3)} />
                  </>
                ) : (
                  <>
                    <ItemDetail
                      label="Ancho Izquierdo"
                      value={tradi.ancho.toFixed(3)}
                    />
                    <ItemDetail
                      label="Ancho Derecho"
                      value={tradi.anchoDerecho.toFixed(3)}
                    />
                  </>
                )}
                {tradi.cantidadAltos === 1 ? (
                  <>
                    <ItemDetail label="Alto" value={tradi.alto.toFixed(3)} />
                  </>
                ) : (
                  <>
                    <ItemDetail
                      label="Alto Izquierdo"
                      value={tradi.alto.toFixed(3)}
                    />
                    <ItemDetail
                      label="Alto Derecho"
                      value={tradi.altoDerecho.toFixed(3)}
                    />
                  </>
                )}
              </View>
            ))}
          </Page>
        ))}
      </Document>
    );
  }
  //  })
};
