import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCartDrawerOpen: false,
  toasts: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openCartDrawer: (state) => {
      state.isCartDrawerOpen = true;
    },
    closeCartDrawer: (state) => {
      state.isCartDrawerOpen = false;
    },
    toggleCartDrawer: (state) => {
      state.isCartDrawerOpen = !state.isCartDrawerOpen;
    },
    addToast: (state, action) => {
      const id = Date.now() + Math.random().toString(36).substring(2, 6);
      const toast = {
        id,
        type: action.payload.type || "info", // "cart" | "wishlist" | "success" | "info"
        title: action.payload.title || "Notification",
        message: action.payload.message || "",
        thumbnail: action.payload.thumbnail || null,
        duration: action.payload.duration || 3800,
        actionLabel: action.payload.actionLabel || null,
        actionPath: action.payload.actionPath || null,
      };

      // Cap at 4 simultaneous toasts
      if (state.toasts.length >= 4) {
        state.toasts.shift();
      }
      state.toasts.push(toast);
    },
    removeToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const {
  openCartDrawer,
  closeCartDrawer,
  toggleCartDrawer,
  addToast,
  removeToast,
  clearToasts,
} = uiSlice.actions;

export default uiSlice.reducer;
