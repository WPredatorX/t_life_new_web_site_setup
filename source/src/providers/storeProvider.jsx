"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import makeStore from "@stores";

const StoreProvider = ({ mockStore = null, children }) => {
  const storeRef = useRef();

  // Create the store instance the first time this renderss
  if (!storeRef.current) {
    if (mockStore !== null) {
      storeRef.current = mockStore();
    } else {
      storeRef.current = makeStore();
    }
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
};

export default StoreProvider;
