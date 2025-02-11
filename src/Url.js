const isProduction = process.env.NODE_ENV === "production";

const baseURL = isProduction ? "" : "http://200.40.89.254:8085";

const urls = {
  ventasEP: (path = "") => isProduction ? `/VentasEP/` : `${baseURL}/Ventas/`,
  loteEP: (path = "") => isProduction ? `/LoteEp/` : `${baseURL}/Lote/`,
  loteFecha: (fecha) => isProduction ? `/LoteFecha/` : `${baseURL}/Lote/Fecha/`,
  instalacionEP: isProduction ? "/InstalacionEP" : `${baseURL}/Instalacion`,
  clientesEP: (path = "") => isProduction ? `/ClientesEP/` : `${baseURL}/Cliente/`,
  configuracionTiposCli: isProduction ? "/ConfiguracionEP/TiposCli" : `${baseURL}/Conf/TiposCli`,
  configuracionEP: isProduction ? "/ConfiguracionEP" : `${baseURL}/Conf`,
  telasEP: isProduction ? "/TelasEP" : `${baseURL}/Telas`,
  loginEP: isProduction ? "/LoginEp" : `${baseURL}/auth`,
  ordenEP: isProduction ? "/OrdenEp" : `${baseURL}/Orden`,
  cortinaEP: (path = "") => isProduction ? `/CortinaEp/` : `${baseURL}/Cortina/`,
  rielEP: (path = "") => isProduction ? `/RielEp/` : `${baseURL}/Riel/`,
  tradicionalEP: (path = "") => isProduction ? `/TradicionalEp/` : `${baseURL}/Tradicional/`,
};

export default urls;
