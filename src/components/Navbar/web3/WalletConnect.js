import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";
import truncateEthAddress from "truncate-eth-address";
import { useState } from "react";
import { DEFAULT_CHAIN_ID } from "../../../static/constant";

export function WalletConnect() {
  const { connect, connectors } = useConnect();
  const { address } = useAccount();
  const { disconnect, reset } = useDisconnect({ address });
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const [showNetworks, setShowNetworks] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);

  if (address) {
    return (
      <div>
        {chain && chain.id !== DEFAULT_CHAIN_ID ? (
          <button
            className="border-[1px] border-black shadow-db bg-db-cyan-process h-10 w-36 rounded-lg text-lg text-white hover:bg-db-blue-200"
            onClick={() => switchNetwork(DEFAULT_CHAIN_ID)}
          >
            Switch Network
          </button>
        ) : (
          <button
            className="border-[1px] border-black shadow-db bg-db-cyan-process h-10 w-36 rounded-lg text-lg text-white hover:bg-db-blue-200"
            onClick={() => setShowDisconnect(!showDisconnect)}
          >
            {truncateEthAddress(address)}
          </button>
        )}

        {showDisconnect ? (
          <div className="absolute top-16 right-0 z-50">
            <button
              className="border-[1px] border-black shadow-db flex justify-center items-center bg-db-cyan-process h-10 w-36 rounded-lg text-lg px-10 text-white hover:bg-db-blue-200"
              onClick={() => {
                setShowDisconnect(!showDisconnect);
                disconnect(address);
                reset();
              }}
            >
              Disconnect
            </button>
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <button
        className="border-[1px] border-black bg-db-cyan-process h-10 rounded-lg w-36 text-lg text-white hover:bg-db-blue-200"
        onClick={() => setShowNetworks(!showNetworks)}
      >
        Connect
      </button>

      {showNetworks ? (
        <div className="z-50 absolute top-16 right-0">
          {connectors.map((connector) => (
            <button
              className="z-50 border-[1px] border-black flex justify-center items-center bg-db-cyan-process h-10 rounded-lg text-lg w-36 text-white hover:bg-db-blue-200"
              onClick={() => {
                setShowNetworks(!showNetworks);
                connect({ connector });
              }}
            >
              {connector.name}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
