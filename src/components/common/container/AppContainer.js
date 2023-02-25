import Navbar from "../../Navbar/Navbar";
import { AlertOverlay } from "../AlertMessage";
import Connect from "../Connect";

const AppContainer = ({ children }) => {
  return (
    <div className='p-4 flex flex-col'>
      <AlertOverlay>
        <Navbar />
        <Connect>
          <div className="pt-4 flex-1">{children}</div>
        </Connect>
      </AlertOverlay>
    </div>
  );
};

export default AppContainer;
