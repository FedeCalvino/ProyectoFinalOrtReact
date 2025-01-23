import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Venta: {
        Venta: [],
        Cliente: [],
        Articulos: [

        ]
    }
};

export const VentaViewReducer = createSlice({
    name: "Venta",
    initialState,
    reducers: {
        setVentaFeature: (state, action) => {
            state.Venta = action.payload;
        },
        setVenta: (state, action) => {
            state.Venta.Venta = action.payload;
        },
        setCliente: (state, action) => {
            state.Venta.Cliente = action.payload;
        },
        setArticulos: (state, action) => {
            state.Venta.Articulos = action.payload;
        },
    }
});

// Exporting actions
export const { setVentaFeature, setVenta, setCliente, setArticulos } = VentaViewReducer.actions;

// Selectors for each state
export const selectVenta = (state) => state.Venta.Venta.Venta;
export const selectCliente = (state) => state.Venta.Cliente;
export const selectArticulos= (state) => state.Venta.Venta.Articulos;

// Export the reducer
export default VentaViewReducer.reducer;
