import { configureStore } from "@reduxjs/toolkit";
import { globalSliceReducer } from "./slices";

const makeStore = () => {
  return configureStore({
    reducer: {
      global: globalSliceReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat([]),
  });
};

export default makeStore;
