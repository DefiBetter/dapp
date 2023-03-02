import { ToastProvider } from "../../../context/ToastContext";
import Navbar from "../../Navbar/Navbar";
import Connect from "../Connect";

const AppContainer = ({ children }) => {
  return (
    <ToastProvider>
      <div className="p-4 flex flex-col">
        <Navbar />
        <Connect>
          <div className="pt-4 flex-1">{children}</div>
        </Connect>
      </div>
    </ToastProvider>
  );
};

export default AppContainer;
