import { configureStore } from '@reduxjs/toolkit';
import CortinasReducer from '../Features/CortinasReducer'; // Asegúrate de que la ruta es correcta
import TelasReducer from '../Features/TelasReducer';
import ClienteReducer from '../Features/ClienteReducer'
import VentaViewReducer from "../Features/VentaViewReucer"
export const store = configureStore({
  reducer: {
    Cortinas: CortinasReducer,
    Telas:TelasReducer,
    Cliente:ClienteReducer,
    Venta:VentaViewReducer
  },
});

