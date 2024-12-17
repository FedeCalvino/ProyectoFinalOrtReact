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
  itemText: {
    fontSize: 13,
    marginBottom: 10,
  },
  itemContainer: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#eeeeee",
    borderRadius: 5,
  },
  itemLabel: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 2,
  },
  logoContainer: {
    position: "absolute",
    top: 12,
    right: 21,
  },
  logo: {
    marginTop: "10px",
    width: 180,
    height: 80,
    marginBottom: 15,
  },
  itemD: {
    marginBottom: "20px",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    borderBottomStyle: "solid",
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  title1: {
    fontSize: 22,
    marginBottom: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 12,
    marginBottom: 5,
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
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    fontSize: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  tableHeaderCell: {
    width: "8%",
    textAlign: "center",
  },
  tableHeaderCellR: {
    width: "5%",
    textAlign: "center",
  },
  tableHeaderCellPP: {
    width: "18%",
    textAlign: "center",
  },
  tableHeaderCell1: {
    width: "18%",
    textAlign: "center",
  },
  tableCell: {
    width: "8%",
    textAlign: "center",
  },tableCell2: {
    width: "4%",
    textAlign: "center",
  },
  tableCellP: {
    width: "8%",
    textAlign: "center",
  },
  tableCellPP: {
    width: "18%",
    textAlign: "center",
  },
  tableHeaderCellPD: {
    width: "36%",
    textAlign: "center",
  },
  tableCell1: {
    width: "18%",
    textAlign: "center",
  },
  tableCellR: {
    width: "25%",
    textAlign: "center",
  },
  text: {
    fontSize: 14,
  },
  text2: {
    fontSize: 8,
  },
  comment: {
    marginTop: 50,
    paddingTop: 5,
    paddingLeft: 5,
    paddingBottom: 15,
    fontSize: 12,
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
  },
  commentTitle: {
    fontSize: 20,
    fontWeight: "bold",
    paddingBottom: 5,
    textAlign: "left",
  },
  commentText: {
    marginTop: 5,
    fontSize: 15,
    textAlign: "center",
  },
});

const FormatearFecha = ({ fecha }) => {
  if (!fecha) return ""; // Maneja el caso donde la fecha es nula o indefinida
  const partesFecha = fecha.split("-");
  if (partesFecha.length !== 3) return ""; // Maneja el caso donde la fecha no tiene el formato correcto
  const [anio, mes, dia] = partesFecha;
  return `${dia}/${mes}/${anio}`;
};

const Header = ({ Venta }) => (
  <>
    <Text style={styles.title1}>
      Fecha Instalación: <FormatearFecha fecha={Venta.fechaInstalacion} />
    </Text>
    <View style={styles.logoContainer}>
      <Image style={styles.logo} src="ImgLogo.png" />
    </View>
    <Text style={styles.title}>Detalles de la Venta</Text>
    <Text style={styles.subtitle}>
      Nombre del Cliente: {Venta.cliente.nombre}
    </Text>
    <Text style={styles.subtitle}>Obra: {Venta.obra || "N/A"}</Text>
  </>
);

const TableHeader = () => (
  <View style={styles.tableHeader}>
    <Text style={[styles.tableHeaderCell1, styles.subtitle]}>Ambiente</Text>
    <Text style={[styles.tableHeaderCell, styles.subtitle]}>Ancho AF-AF</Text>
    <Text style={[styles.tableHeaderCell, styles.subtitle]}>Ancho Tela</Text>
    <Text style={[styles.tableHeaderCell, styles.subtitle]}>Ancho Caño</Text>
    <Text style={[styles.tableHeaderCell, styles.subtitle]}>Caño</Text>
    <Text style={[styles.tableHeaderCell, styles.subtitle]}>Alto Cortina</Text>
    <Text style={[styles.tableHeaderCell, styles.subtitle]}>Alto Tela</Text>
    <Text style={[styles.tableHeaderCell, styles.subtitle]}>Cadena</Text>
    <Text style={[styles.tableHeaderCell, styles.subtitle]}>Posición</Text>
    <Text style={[styles.tableHeaderCell, styles.subtitle]}>Lado</Text>
    <Text style={[styles.tableHeaderCell, styles.subtitle]}>Motor</Text>
  </View>
);

const TelaTitle = ({ tela }) => <Text style={styles.title}>Tela: {tela}</Text>;

export const PDFTela = ({ Venta }) => {
  const Cortinasroller = Venta.listaArticulos.filter((art) => art.tipoArticulo === "roller");

  return (
    <Document>
      {Cortinasroller.length > 0 && (
        <Page size="A4" style={styles.page} orientation="landscape">
          <Header Venta={Venta} />
          {Cortinasroller.length > 0 && (
            <>
              <TableHeader />
              {Cortinasroller.map((cortina, cortinaIndex) => (
                <View style={styles.tableRow} key={cortinaIndex}>
                  <Text style={[styles.tableCell1, styles.text]}>{cortina.Ambiente}</Text>
                  <Text style={[styles.tableCell, styles.text]}>{cortina.ancho}</Text>
                  <Text style={[styles.tableCell, styles.text]}>{cortina.AnchoTela}</Text>
                  <Text style={[styles.tableCell, styles.text]}>{cortina.AnchoTubo}</Text>
                  <Text style={[styles.tableCell, styles.text]}>{cortina.cano.tipo}</Text>
                  <Text style={[styles.tableCell, styles.text]}>{cortina.alto}</Text>
                  <Text style={[styles.tableCell, styles.text]}>{cortina.AltoTela}</Text>
                  <Text style={[styles.tableCell, styles.text]}>{cortina.LargoCadena}</Text>
                  <Text style={[styles.tableCell, styles.text]}>{cortina.posicion.posicion}</Text>
                  <Text style={[styles.tableCell, styles.text]}>{cortina.ladoCadena.lado}</Text>
                  <Text style={[styles.tableCell, styles.text]}>{cortina.motorRoller.nombre}</Text>
                </View>
              ))}
            </>
          )}
        </Page>
      )}
    </Document>
  );
};
