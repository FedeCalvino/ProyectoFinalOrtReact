import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Articulos: [],
    Indice: 0
};

const ArticulosReducer = createSlice({
    name: "Articulos",
    initialState,
    reducers: {
        setArticulosFeature: (state, action) => {
            state.Articulos = action.payload;
        },
        addArticulo: (state, action) => {
            const newArticulo= {
                ...action.payload,
                numeroArticulo: state.Indice + 1
            };
            state.Articulos.push(newArticulo);
            state.Indice++;
        },

        removeArticulos: (state, action) => {
            const numeroToRemove = action.payload.numeroArticulo;
            console.log(numeroToRemove)
            state.Articulos = state.Articulos.filter(
                Articulos => Articulos.numeroArticulo !== numeroToRemove
            );
            state.Articulos.forEach(Articulo => {
                if (Articulo.numeroArticulo > numeroToRemove) Articulo.numeroArticulo--;
            });
            state.Indice--; // Reduce the index once
        },
    }
});

export const { 
    setArticulosFeature,
    addArticulo, 
    removeArticulos
} = ArticulosReducer.actions;

// Selectors
export const selectArticulos = (state) => state.Articulos.Articulos;

export default ArticulosReducer.reducer;
