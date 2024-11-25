import { configureStore } from '@reduxjs/toolkit';
import ArticulosReducer from '../Features/ArticulosReducer'; 
import TelasReducer from '../Features/TelasReducer';
import ClienteReducer from '../Features/ClienteReducer'
export const store = configureStore({
  reducer: {
    Articulos: ArticulosReducer,
    Telas:TelasReducer,
    Cliente:ClienteReducer,
  },
});

