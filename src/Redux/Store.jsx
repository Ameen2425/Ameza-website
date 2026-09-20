import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./Features/cart/CartSlice";
import uiReducer from "./Features/ui/uiSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    ui: uiReducer,
  },
});
