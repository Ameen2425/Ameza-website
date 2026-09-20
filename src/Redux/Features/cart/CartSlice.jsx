import { createSlice } from "@reduxjs/toolkit";

let cartData = JSON.parse(localStorage.getItem("cartData")) || [];

const cartSlice = createSlice({
  name: "cart",
  initialState: cartData,
  reducers: {
    ADD: (state, action) => {
      let item = action.payload;
      let qtyToAdd = item.quantity && Number(item.quantity) > 0 ? Number(item.quantity) : 1;

      let existingItem = state.find((pro) => pro.id === item.id);

      if (existingItem) {
        existingItem.quantity += qtyToAdd;
      } else {
        state.push({
          ...item,
          quantity: qtyToAdd,
        });
      }

      localStorage.setItem("cartData", JSON.stringify(state));
    },

    REMOVE: (state, action) => {
      let item = action.payload;

      let updatedCart = state.filter((pro) => pro.id !== item);

      localStorage.setItem("cartData",JSON.stringify(updatedCart));

      return updatedCart;
    },

    INC: (state, action) => {
      let item = action.payload;

      let existingItem = state.find((pro) => pro.id === item);

      if (existingItem) {
        existingItem.quantity += 1;
      }

      localStorage.setItem("cartData",JSON.stringify(state));
    },

    DEC: (state, action) => {
      let item = action.payload;

      let existingItem = state.find((pro) => pro.id === item);

      if (existingItem) {
        if (existingItem.quantity > 1) {
          existingItem.quantity -= 1;

          localStorage.setItem("cartData",JSON.stringify(state));
        } else {
          let updatedCart = state.filter((pro) => pro.id !== item);

          localStorage.setItem("cartData",JSON.stringify(updatedCart));

          return updatedCart;
        }
      }
    },

    CLEAR: () => {
      localStorage.setItem("cartData", JSON.stringify([]));
      return [];
    },
  },
});

export const { ADD, REMOVE, INC, DEC, CLEAR } = cartSlice.actions;

export default cartSlice.reducer;
