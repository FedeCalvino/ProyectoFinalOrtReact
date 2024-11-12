import { configureStore } from '@reduxjs/toolkit';
import ClienteReducer from '../Features/ClienteReducer'
export const store = configureStore({
  reducer: {
    Cliente:ClienteReducer,
  },
});

