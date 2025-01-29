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
    // Header
    header: {
      marginBottom: 20,
    },
    title1: {
      fontSize: 20,
      fontWeight: "bold",
      textAlign: "center",
      marginBottom: 5,
    },
    subtitle: {
      fontSize: 12,
      textAlign: "center",
      marginBottom: 2,
    },
    logoContainer: {
      position: "absolute",
      top: 10,
      right: 20,
    },
    logo: {
      width: 120,
      height: 60,
    },
    // Table
    tableHeader: {
      flexDirection: "row",
      backgroundColor: "#f7f7f7",
      borderBottomColor: "#cccccc",
      borderBottomWidth: 1,
      padding: 5,
      fontSize: 10,
      fontWeight: "bold",
      alignItems: "center",
    },
    tableRow: {
      flexDirection: "row",
      borderBottomColor: "#eeeeee",
      borderBottomWidth: 1,
      padding: 5,
      alignItems: "center",
    },
    tableRowAlternate: {
      backgroundColor: "#f9f9f9",
    },
    tableHeaderCell: {
      textAlign: "center",
      fontSize: 10,
      fontWeight: "bold",
    },
    tableCell: {
      textAlign: "center",
      fontSize: 15,
    },
    // Column widths
    colNumber: { width: "8%" },
    colAmbiente: { width: "20%" },
    colDimension: { width: "12%" },
    colDetail: { width: "50%" },
    // Item container
    itemContainer: {
      marginBottom: 10,
      padding: 10,
      border: "1px solid #dddddd",
      borderRadius: 5,
      backgroundColor: "#fefefe",
    },
    itemLabel: {
      fontSize: 20,
      fontWeight: "bold",
    },
    itemText: {
      fontSize: 20,
      marginBottom: 5,
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

  const TableHeader = () => (
    <View style={styles.tableHeader}>
      <Text style={[styles.tableHeaderCell, styles.colNumber]}>Número</Text>
      <Text style={[styles.tableHeaderCell, styles.colAmbiente]}>Ambiente</Text>
      <Text style={[styles.tableHeaderCell, styles.colDimension]}>Ancho</Text>
      <Text style={[styles.tableHeaderCell, styles.colDimension]}>Alto</Text>
      <Text style={[styles.tableHeaderCell, styles.colDetail]}>Detalle</Text>
    </View>
  );

  const Cliente = Venta.Cliente;
  const Cortinasroller = Venta.listaArticulos.filter(
    (art) => art.nombre === "Roller"
  );
  const Rieles = Venta.listaArticulos.filter((art) => art.nombre === "Riel");

  const groupedRieles = [];
  for (let i = 0; i < Rieles.length; i += 2) {
    groupedRieles.push(Rieles.slice(i, i + 2));
  }

  return (
    <Document>
      {Cortinasroller.length > 0 && (
        <Page size="A4" style={styles.page} orientation="landscape">
          <Header Cliente={Cliente} />
          <TableHeader />
          {Cortinasroller.map((cortina, index) => (
            <View
              style={[
                styles.tableRow,
                index % 2 === 0 && styles.tableRowAlternate,
              ]}
              key={cortina.Id}
            >
              <Text style={[styles.tableCell, styles.colNumber]}>
                {cortina.numeroArticulo}
              </Text>
              <Text style={[styles.tableCell, styles.colAmbiente]}>
                {cortina.Ambiente}
              </Text>
              <Text style={[styles.tableCell, styles.colDimension]}>
                {cortina.ancho.toFixed(3)}
              </Text>
              <Text style={[styles.tableCell, styles.colDimension]}>
                {cortina.alto.toFixed(3)}
              </Text>
              <Text style={[styles.tableCell, styles.colDetail]}>
                {cortina.detalleInstalacion}
              </Text>
            </View>
          ))}
        </Page>
      )}
      {groupedRieles.map((group, pageIndex) => (
        <Page
          key={pageIndex}
          size="A4"
          style={styles.page}
          orientation="portrait"
        >
          <Header Cliente={Cliente} />
          {group.map((riel, rielIndex) => (
            <View style={styles.itemContainer} key={rielIndex}>
              <Text style={styles.itemLabel}>Número: </Text>
              <Text style={styles.itemText}>{riel.IdArticulo}</Text>
              <Text style={styles.itemLabel}>Ambiente: </Text>
              <Text style={styles.itemText}>{riel.ambiente}</Text>
              <Text style={styles.itemLabel}>Ancho: </Text>
              <Text style={styles.itemText}>{riel.ancho.toFixed(3)}</Text>
              {/* Add additional fields as needed */}
            </View>
          ))}
        </Page>
      ))}
    </Document>
  );
};
