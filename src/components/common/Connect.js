import Navbar from "../Navbar/Navbar";

const Connect = ({ isConnected, activeChain, children }) => {
  if (!isConnected) {
    return (
      <>
        <Navbar />
        <div>Please connect your wallet</div>
      </>
    );
  }

  if (activeChain?.unsupported) {
    return (
      <>
        <Navbar />
        <div>Unsupported chain</div>
      </>
    );
  }

  return children;
};

export default Connect;
