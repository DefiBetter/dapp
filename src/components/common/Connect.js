const Connect = ({ isConnected, activeChain, children }) => {
  if (!isConnected) {
    return <div>Please connect your wallet</div>;
  }

  if (activeChain?.unsupported) {

    return <div>Unsupported chain - </div>;
  }

  return children;
};

export default Connect;
