import { useTheme } from "../../../context/ThemeContext";
import { ToastProvider } from "../../../context/ToastContext";
import Navbar from "../../Navbar/Navbar";
import Connect from "../Connect";

const AppContainer = ({ children }) => {
  const themeProvider = useTheme();

  return (
    <main className={`${themeProvider?.theme === "dark" ? "dark" : "light"}`}>
      <div className="dark:bg-db-dark bg-white w-full dark:text-white text-black transition-colors">
        <Navbar />

        <ToastProvider>
          <div className="p-2 md:p-4">
            <Connect>
              {children}
            </Connect>
          </div>
        </ToastProvider>
      </div>
    </main>
  );
};

export default AppContainer;
