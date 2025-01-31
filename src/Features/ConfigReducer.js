import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    RollerConfig: [],
    RielConfig: [],
    TradicionalConfig:[]
};

export const ConfigReducer = createSlice({
    name: "Config",
    initialState,
    reducers: {
        setRollerConfig: (state, action) => {
            state.RollerConfig = action.payload;
        },
        setRielConfig: (state, action) => {
            state.RielConfig = action.payload;
        },
        setTradicionalConfig: (state, action) => {
            state.TradicionalConfig = action.payload;
        }
    },
});

export const { setRollerConfig } = ConfigReducer.actions;
export const { setRielConfig } = ConfigReducer.actions;
export const { setTradicionalConfig } = ConfigReducer.actions;


export const selectRollerConfig = (state) => state.Config.RollerConfig;
export const selectConfigRiel= (state) => state.Config.RielConfig;
export const selectConfigTradicional= (state) => state.Config.TradicionalConfig;

export default ConfigReducer.reducer;
