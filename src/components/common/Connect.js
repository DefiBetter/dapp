import { useAccount, useNetwork } from "wagmi";
import { WalletConnect } from "../Navbar/web3/WalletConnect";
import customChains from "../../static/chains";

const Connect = ({ children }) => {
  const { chain } = useNetwork();
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <div className="relative mt-32 text-3xl flex items-center flex-col gap-3 h-full">
        <div className="rounded-lg p-2">Connect your wallet</div>
        <div className="relative">
          <WalletConnect />
        </div>
      </div>
    );
  }

  if (chain && chain.id !== customChains.binanceSmartChain.id) {
    return (
      <div className="mt-32 text-3xl flex items-center flex-col gap-3 h-full">
        <div className="rounded-lg p-2">Switch to a </div>
        <div>
          <span className="pl-4 pr-2 text-db-cyan-process font-fancy font-bold text-4xl">
            Better
          </span>
        </div>
        <div>chain</div>
        <div className="relative">
          <WalletConnect />
        </div>
      </div>
    );
  }

  return children;
};

export default Connect;
