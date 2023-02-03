import { createContext } from "react";

const WindowContext = createContext({
  width: 0,
  height: 0,
  screen: "xs",
});

export default WindowContext;
