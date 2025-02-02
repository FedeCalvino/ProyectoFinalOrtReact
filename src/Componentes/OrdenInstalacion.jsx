import React from "react";
import {
  Document,
  Text,
  Page,
  StyleSheet,
  Image,
  View,
} from "@react-pdf/renderer";

export const OrdenInstalacion = ({ Venta }) => {
  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#ffffff",
      padding: 20,
    },
    header: {
      marginBottom: 20,
      textAlign: "center",
    },
    title1: {
      fontSize: 20,
      fontWeight: "bold",
      marginBottom: 5,
    },
    subtitle: {
      fontSize: 12,
      marginBottom: 2,
    },
    logoContainer: {
      position: "absolute",
      top: 10,
      right: 20,
    },
    logo: {
      width: 100,
      height: 50,
    },
    sectionTitle: {
      fontSize: 18,
      paddingBottom:"20px",
      borderBottom:"1px solid black",
      fontWeight: "bold",
      marginVertical: 8,
      textAlign: "center",
    },
    tableHeader: {
      flexDirection: "row",
      backgroundColor: "#f0f0f0",
      padding: 5,
      fontSize: 10,
      fontWeight: "bold",
    },
    tableRow: {
      flexDirection: "row",
      padding: 5,
      alignItems: "center",
    },
    tableRowAlternate: {
      backgroundColor: "#f7f7f7",
    },
    tableCell: {
      textAlign: "center",
      fontSize: 15,
      flex: 1,
    },
  });

  const Header = ({ Cliente }) => (
    <View style={styles.header}>
      <Text style={styles.title1}>Orden de Instalación</Text>
      <Text style={styles.subtitle}>Nombre: {Cliente.nombre}</Text>
      <Text style={styles.subtitle}>Dirección: {Cliente.Direccion}</Text>
      <Text style={styles.subtitle}>Teléfono: {Cliente.numeroTelefono}</Text>
      <View style={styles.logoContainer}>
        <Image style={styles.logo} src="ImgLogo.png" />
      </View>
    </View>
  );

  const TableHeader = ({ headers }) => (
    <View style={styles.tableHeader}>
      {headers.map((header, index) => (
        <Text key={index} style={styles.tableCell}>
          {header}
        </Text>
      ))}
    </View>
  );

  const Cliente = Venta.Cliente;
  const Cortinasroller = Venta.listaArticulos.filter((art) => art.nombre === "Roller");
  const Rieles = Venta.listaArticulos.filter((art) => art.nombre === "Riel");

  return (
    <Document>
      <Page size="A4" style={styles.page} orientation="landscape">
        <Header Cliente={Cliente} />

        {Cortinasroller.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Rollers</Text>
            <TableHeader headers={["Número", "Ambiente", "Ancho", "Alto", "Detalle"]} />
            {Cortinasroller.map((cortina, index) => (
              <View
                key={cortina.Id}
                style={[styles.tableRow, index % 2 === 0 && styles.tableRowAlternate]}
              >
                <Text style={styles.tableCell}>{cortina.numeroArticulo}</Text>
                <Text style={styles.tableCell}>{cortina.Ambiente}</Text>
                <Text style={styles.tableCell}>{cortina.ancho.toFixed(3)}</Text>
                <Text style={styles.tableCell}>{cortina.alto.toFixed(3)}</Text>
                <Text style={styles.tableCell}>{cortina.detalleInstalacion}</Text>
              </View>
            ))}
          </>
        )}

        {Rieles.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Rieles</Text>
            <TableHeader headers={["Número", "Ambiente", "Ancho", "Tipo", "Detalle"]} />
            {Rieles.map((riel, index) => (
              <View
                key={riel.idRiel}
                style={[styles.tableRow, index % 2 === 0 && styles.tableRowAlternate]}
              >
                <Text style={styles.tableCell}>{riel.numeroArticulo}</Text>
                <Text style={styles.tableCell}>{riel.ambiente}</Text>
                <Text style={styles.tableCell}>{riel.ancho.toFixed(3)}</Text>
                <Text style={styles.tableCell}>{riel.tipoRiel.tipo}</Text>
                <Text style={styles.tableCell}>{riel.detalleInstalacion}</Text>
              </View>
            ))}
          </>
        )}
      </Page>
    </Document>
  );
};
