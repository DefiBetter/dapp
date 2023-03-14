import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {

  const [theme, setTheme] = useState('dark');
  // const [theme, setTheme] = useState(
  //   typeof window !== "undefined" ? localStorage.theme : "dark"
  // );

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", newTheme);
    }
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
