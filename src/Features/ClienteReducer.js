import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    Cliente: {
        Id: "",
        Name: "",
        Direcc: "",
        Tel: "",
        Rut: "",
        Tipo: "",
        set:false
    }
};

export const ClienteReducer = createSlice({
    name: "Cliente",
    initialState,
    reducers: {
        setClienteFeature: (state, action) => {
            state.Cliente = action.payload;
            console.log(state.Cliente)
        },
    }
});

export const { setClienteFeature } = ClienteReducer.actions;

export const selectCliente = (state) => state.Cliente.Cliente;

export default ClienteReducer.reducer;
