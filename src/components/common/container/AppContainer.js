import { useTheme } from "../../../context/ThemeContext";
import { ToastProvider } from "../../../context/ToastContext";
import Navbar from "../../Navbar/Navbar";
import Connect from "../Connect";

const AppContainer = ({ restricted, children }) => {
  const themeProvider = useTheme();

  return (
    <main className={`${themeProvider?.theme ? themeProvider?.theme : "dark"}`}>
      <div className="dark:bg-db-dark bg-white w-full min-h-screen dark:text-white text-black transition-colors">
        <Navbar restricted={restricted} />
        <ToastProvider>
          <div className="p-2 md:p-4">
            <Connect>{children}</Connect>
          </div>
        </ToastProvider>
      </div>
    </main>
  );
};

export default AppContainer;
