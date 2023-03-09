import { useAccount, useNetwork } from "wagmi";
import { WalletConnect } from "../Navbar/web3/WalletConnect";

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
        <div className="mt-4 flex gap-3 items-center">
          <a
            target="_blank"
            rel="noreferrer"
            href="https://discord.gg/DSDXSXf6Ub"
          >
            <img
              className="w-10 h-10"
              src={require("../../static/image/discord-logo.png")}
            />
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://t.me/+2z4mDnFAnjxiMWJl"
          >
            <img
              className="w-10 h-10"
              src={require("../../static/image/telegram-logo.png")}
            />
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://twitter.com/defi_better"
          >
            <img
              className="w-10 h-10"
              src={require("../../static/image/twitter-logo.png")}
            />
          </a>
          <a
            target="_blank"
            rel="noreferrer"
            href="https://medium.com/@defibetter"
          >
            <img
              className="w-10 h-10"
              src={require("../../static/image/medium-logo.png")}
            />
          </a>
        </div>
      </div>
    );
  }
  if (chain && chain.id !== Number(process.env.REACT_APP_DEFAULT_CHAIN)) {
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
