import { createSlice } from "@reduxjs/toolkit";

const initialState = { // Renamed for convention
    orders: [],        // This will hold the LIST of all orders
    latestOrder: null  // NEW: This will hold only the SINGLE, most recent order
}

const orderSlice = createSlice({
    name: 'orders', // Changed name to plural for clarity
    initialState: initialState,
    reducers: {
        setOrders: (state, action) => { // Renamed for clarity
            state.orders = [...action.payload]
        },
        // NEW: This reducer sets only the latest successful order
        setLatestOrder: (state, action) => {
            state.latestOrder = action.payload
        }
    }
})

// Export the new action
export const { setOrders, setLatestOrder } = orderSlice.actions;
export default orderSlice.reducer;