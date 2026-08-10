// DrawerContext.js
import React, { createContext, useContext } from "react";

const DrawerContext = createContext({
  openDrawer: () => {},
  closeDrawer: () => {},
});

export const useDrawer = () => useContext(DrawerContext);

export default DrawerContext;
