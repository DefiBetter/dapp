import Navbar from "../Navbar/Navbar";
import { AppContainer } from "./Container";

const Connect = ({ isConnected, activeChain, children }) => {
  if (!isConnected) {
    return (
      <AppContainer>
        <Navbar />
        <div>Please connect your wallet</div>
      </AppContainer>
    );
  }

  if (activeChain?.unsupported) {
    return (
      <AppContainer>
        <Navbar />
        <div>Unsupported chain</div>
      </AppContainer>
    );
  }

  return children;
};

export default Connect;
