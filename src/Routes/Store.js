import { configureStore } from '@reduxjs/toolkit';
import CortinasReducer from '../Features/CortinasReducer'; 
import TelasReducer from '../Features/TelasReducer';
import ClienteReducer from '../Features/ClienteReducer'
export const store = configureStore({
  reducer: {
    Cortinas: CortinasReducer,
    Telas:TelasReducer,
    Cliente:ClienteReducer,
  },
});

