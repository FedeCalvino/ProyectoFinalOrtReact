import React, { useState, useEffect } from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 0,
  },
  tableContainer: {
    marginTop: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height:"50%"
  },
  tableContainer1: {
    marginBottom: 0.2,
    borderBottomWidth: 0.1,
    borderBottomColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    fontSize: 1.5,
    justifyContent: 'center',
  },
  tableCell5: {
    fontSize: 1.5,
    width: '22%',
    textAlign: 'left',
    borderBottomColor: '#000000'
  },
  tableCell7: {
    fontSize: 2,
    width: '18%',
    textAlign: 'center',
  },
  tableCell8: {
    fontSize: 2,
    width: '18%',
    textAlign: 'center',
    marginRight: 1,
    borderBottomColor: '#000000',
  },
  tableCell9: {
    fontSize: 2,
    width: '10%',
    textAlign: 'center',
    borderBottomColor: '#000000',
  },
  tableCell911: {
    fontSize: 2,
    width: '10%',
    textAlign: 'center',
    borderBottomColor: '#000000',
  },
  tableCell19: {
    fontSize: 2,
    width: '10%',
    textAlign: 'center',
    borderBottomColor: '#000000',
  },tableCell191: {
    fontSize: 2,
    width: '10%',
    textAlign: 'rigth',
    borderBottomColor: '#000000',
  },
  tableCell6: {
    fontSize: 2,
    width: '6%',
    textAlign: 'center',
  },
  tableCell3: {
    fontSize: 2,
    marginTop: 0.2,
    width: '50%',
    textAlign: 'center',
  },tableCell131:{
    fontSize: 2,
    marginTop: 0.2,
    width: '100%',
    textAlign: 'center',
  },
  tableCell4: {
    fontSize: 1,
    width: '50%',
    textAlign: 'center',
  },
  tableCell1: {
    fontSize: 1.5,
    marginBottom: 1,
    width: '33%',
    textAlign: 'center',
  },tableCell10: {
    fontSize: 5,
    width: '8%',
    textAlign: 'center',
  },
  tableCell12: {
    fontSize: 5,
    marginRight:1.5,
    width: '8%',
    textAlign: 'center',
  }
});

export const TicketCortina = ({ NombreCli, Articulos }) => {

  const Cortinasroller = Articulos.filter((art) => art.tipoArticulo === "roller");
  console.log(Cortinasroller)
  const [fontSize, setFontSize] = useState(2);
  const [fontSizeMedidas, setfontSizeMedidas] = useState(2);
  const [fontSizeAmbiente, setfontSizeAmbiente] = useState(2);
  useEffect(() => {
    // Si el nombre del cliente tiene más de 14 caracteres, reducir el tamaño de la fuente
    if (NombreCli.length > 16) {
      setFontSize(1.5);
      setfontSizeMedidas(2.5)
    } else {
      setFontSize(2.5);
      setfontSizeMedidas(2.5)
    }

    
  }, [NombreCli]);

  return (
    <Document>
      {Cortinasroller.map(cor => (
        
        <Page size={[34, 12]} style={styles.page} key={cor.idCortina}>
          <View style={styles.tableContainer1}>
            <View style={styles.tableRow}>
              
              <Text style={[styles.tableCell131]}>
                {NombreCli}
              </Text>
              
            </View>
          </View>
          <View style={styles.tableContainer}>
            <View style={styles.tableRow}>
              <Text style={[styles.tableCell5, {fontSize: cor.ambiente.length>=6 ?  1.8 : fontSize}]}>{cor.Ambiente}</Text>
              <Text style={[styles.tableCell7, { fontSize: fontSizeMedidas }]}>{cor.ancho.toFixed(3)}</Text>
              <Text style={[styles.tableCell6, { fontSize: fontSize }]}>X</Text>
              <Text style={[styles.tableCell8, { fontSize: fontSizeMedidas}]}>{cor.alto.toFixed(3)}</Text>
              <Text style={[styles.tableCell9, { fontSize: 2}] }>{cor.ladoCadena.lado.slice(0, 3)}</Text>
              <Text style={[styles.tableCell9, { fontSize: 2}] }>/</Text>
              <Text style={[styles.tableCell911, { fontSize: 2}] }>{cor.posicion.posicion.slice(0, 3)}</Text>
            </View>
          </View>
        </Page>   
      ))}
      
    </Document>
  );
};
