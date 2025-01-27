import React, { useState, useEffect } from "react";
import {
  Document,
  Text,
  Page,
  StyleSheet,
  View,
  Image,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 0,
  },
  tableContainer: {
    marginTop: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "50%",
  },
  tableContainer1: {
    marginBottom: 0.2,
    borderBottomWidth: 0.1,
    borderBottomColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: 1.5,
    justifyContent: "center",
  },
  tableCell5: {
    fontSize: 1.5,
    width: "22%",
    textAlign: "center",
    borderBottomColor: "#000000",
  },
  tableCell7: {
    fontSize: 2,
    width: "18%",
    textAlign: "center",
  },
  tableCell8: {
    fontSize: 2,
    width: "18%",
    textAlign: "center",
    marginRight: 1,
    borderBottomColor: "#000000",
  },
  tableCell9: {
    fontSize: 2,
    width: "12%",
    textAlign: "center",
    borderBottomColor: "#000000",
  },
  tableCell19: {
    fontSize: 2,
    width: "12%",
    textAlign: "center",
    borderBottomColor: "#000000",
  },
  tableCell6: {
    fontSize: 2,
    width: "6%",
    textAlign: "center",
  },
  tableCell3: {
    fontSize: 2,
    marginTop: 0.2,
    width: "50%",
    textAlign: "center",
  },
  tableCell4: {
    fontSize: 1,
    width: "50%",
    textAlign: "center",
  },
  tableCell1: {
    fontSize: 1.5,
    marginBottom: 1,
    width: "33%",
    textAlign: "center",
  },
  tableCell10: {
    fontSize: 5,
    width: "10%",
    textAlign: "center",
  },
  tableCell12: {
    fontSize: 5,
    marginRight: 1.5,
    width: "10%",
    textAlign: "center",
  },
});

export const TicketCortina = ({ NombreCli, Articulos }) => {
  if (!NombreCli || !Articulos) {
    console.log(NombreCli);
    console.log(Cortinas);
    throw new Error("Faltan datos necesarios para generar el PDF");
  }

  const [fontSize, setFontSize] = useState(2);
  const [fontSizeMedidas, setfontSizeMedidas] = useState(2);
  const [fontSizeAmbiente, setfontSizeAmbiente] = useState(2);

  const Rollers = Articulos.filter((art) => art.nombre === "Roller");

  return (
    <Document>
      {Rollers.map((Cortina) => (
        <Page size={[34, 12]} style={styles.page} key={Cortina.IdCortina}>
          <View style={styles.tableContainer1}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell3]}>
                {NombreCli || "Nombre no disponible"}
              </Text>
            </View>
          </View>
          <View style={styles.tableContainer}>
            <View style={styles.tableRow}>
              <Text
                style={[
                  styles.tableCell5,
                  { fontSize: Cortina.Ambiente?.length >= 6 ? 1.8 : fontSize },
                ]}
              >
                {Cortina.Ambiente || "Ambiente no disponible"}
              </Text>
              <Text style={[styles.tableCell7, { fontSize: fontSizeMedidas }]}>
                {Cortina.ancho || "N/A"}
              </Text>
              <Text style={[styles.tableCell6, { fontSize: fontSize }]}>X</Text>
              <Text style={[styles.tableCell8, { fontSize: fontSizeMedidas }]}>
                {Cortina.alto || "N/A"}
              </Text>
              <Text style={[styles.tableCell9, { fontSize: fontSize }]}>
                {Cortina.ladoCadena.lado.slice(0, 3) || "N/A"}
              </Text>
              <Text style={[styles.tableCell9, { fontSize: fontSize }]}>
                {Cortina.posicion.posicion.slice(0, 3) || "N/A"}
              </Text>
            </View>
          </View>
        </Page>
      ))}
    </Document>
  );
};
