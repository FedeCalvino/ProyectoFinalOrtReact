import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Cortinas: {
        Rieles: [],
        Rollers: [],
        Tradicionales: []
    },
    Indice: 0
};

const CortinasReducer = createSlice({
    name: "Cortinas",
    initialState,
    reducers: {
        setCortinasFeature: (state, action) => {
            state.Cortinas = action.payload;
        },
        addRoller: (state, action) => {
            const newRoller = {
                ...action.payload,
                numeroCortina: state.Indice + 1
            };
            state.Cortinas.Rollers.push(newRoller);
            state.Indice++;
        },
        addTradicional: (state, action) => {
            const newTradicional = {
                ...action.payload,
                numeroCortina: state.Indice + 1
            };
            state.Cortinas.Tradicionales.push(newTradicional);
            state.Indice++;
        },
        addRiel: (state, action) => {
            const newRiel = {
                ...action.payload,
                numeroCortina: state.Indice + 1
            };
            state.Cortinas.Rieles.push(newRiel);
            state.Indice++;
        },

        removeRoller: (state, action) => {
            const numeroToRemove = action.payload.numeroCortina;
            console.log(numeroToRemove)
            state.Cortinas.Rollers = state.Cortinas.Rollers.filter(
                roller => roller.numeroCortina !== numeroToRemove
            );
            // Update numbers for remaining cortinas
            state.Cortinas.Rollers.forEach(cortina => {
                if (cortina.numeroCortina > numeroToRemove) cortina.numeroCortina--;
            });
            state.Cortinas.Tradicionales.forEach(cortina => {
                if (cortina.numeroCortina > numeroToRemove) cortina.numeroCortina--;
            });
            state.Cortinas.Rieles.forEach(cortina => {
                if (cortina.numeroCortina > numeroToRemove) cortina.numeroCortina--;
            });
            state.Indice--; // Reduce the index once
        },
        removeTradicional: (state, action) => {
            const numeroToRemove = action.payload.numeroCortina;
            state.Cortinas.Tradicionales = state.Cortinas.Tradicionales.filter(
                tradicional => tradicional.numeroCortina !== numeroToRemove
            );
            state.Cortinas.Rollers.forEach(cortina => {
                if (cortina.numeroCortina > numeroToRemove) cortina.numeroCortina--;
            });
            state.Cortinas.Rieles.forEach(cortina => {
                if (cortina.numeroCortina > numeroToRemove) cortina.numeroCortina--;
            });
            // Update numbers for remaining cortinas
            state.Cortinas.Tradicionales.forEach(cortina => {
                if (cortina.numeroCortina > numeroToRemove) cortina.numeroCortina--;
            });
            state.Indice--;
        },
        removeRiel: (state, action) => {
            const numeroToRemove = action.payload.numeroCortina;
            state.Cortinas.Rieles = state.Cortinas.Rieles.filter(
                riel => riel.numeroCortina !== numeroToRemove
            );
            // Update numbers for remaining cortinas
            state.Cortinas.Rieles.forEach(cortina => {
                if (cortina.numeroCortina > numeroToRemove) cortina.numeroCortina--;
            });
            state.Cortinas.Tradicionales.forEach(cortina => {
                if (cortina.numeroCortina > numeroToRemove) cortina.numeroCortina--;
            });
            state.Cortinas.Rollers.forEach(cortina => {
                if (cortina.numeroCortina > numeroToRemove) cortina.numeroCortina--;
            });
            state.Indice--;
        }
    }
});

export const { 
    setCortinasFeature, 
    addRiel, 
    addTradicional, 
    addRoller, 
    removeRoller, 
    removeTradicional, 
    removeRiel 
} = CortinasReducer.actions;

// Selectors
export const selectCortinas = (state) => state.Cortinas.Cortinas;
export const selectRieles = (state) => state.Cortinas.Cortinas.Rieles;
export const selectRollers = (state) => state.Cortinas.Cortinas.Rollers;
export const selectTradicional = (state) => state.Cortinas.Cortinas.Tradicionales;

export default CortinasReducer.reducer;
