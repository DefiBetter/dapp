import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";
import truncateEthAddress from "truncate-eth-address";
import { useRef, useState } from "react";
import { BsWallet2 } from "react-icons/bs";
import { MdClose } from "react-icons/md";

export function WalletConnect() {
  const { connect, connectors } = useConnect();
  const { address } = useAccount();
  const { disconnect, reset } = useDisconnect({ address });
  const { chain } = useNetwork();
  const { switchNetwork } = useSwitchNetwork();

  const [showNetworks, setShowNetworks] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);

  const connectorsRef = useRef(null);

  const hideConnectors = (e) => {
    if (
      connectorsRef &&
      connectorsRef.current &&
      !connectorsRef.current.contains(e.target)
    )
      setShowNetworks(false);
  };

  document.addEventListener("mousedown", hideConnectors);

  const buttonClasses =
    "active:scale-[0.99] transition-all backdrop-blur-sm z-10 rounded-md relative flex gap-2 justify-center items-center h-9 pb-0.5 w-36 border-[1px] border-db-cyan-process text-db-cyan-process hover:bg-db-cyan-process hover:text-white shadow-sm shadow-db-cyan-process hover:shadow-white";

  if (address) {
    return (
      <div>
        {chain && chain.id !== Number(process.env.REACT_APP_DEFAULT_CHAIN) ? (
          <button
            className={`${buttonClasses} bg-blue-100`}
            onClick={() =>
              switchNetwork(Number(process.env.REACT_APP_DEFAULT_CHAIN))
            }
          >
            Switch Network
          </button>
        ) : (
          <button
            className={buttonClasses}
            onClick={() => setShowDisconnect(!showDisconnect)}
          >
            {truncateEthAddress(address)}
          </button>
        )}

        {showDisconnect ? (
          <div className="z-50 absolute top-12 right-0">
            <button
              className={buttonClasses}
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
      <button className={buttonClasses} onClick={() => setShowNetworks(true)}>
        <div>
          <BsWallet2 />
        </div>
        Connect
      </button>

      {showNetworks ? (
        <div className="z-50 fixed w-screen h-screen top-0 right-0 backdrop-blur-sm flex items-center justify-center px-2">
          <div
            ref={connectorsRef}
            className="dark:bg-db-dark-nav bg-white dark:text-white text-black py-10 px-5 rounded-lg shadow-sm shadow-[#2aaee6] relative w-full md:w-96"
          >
            <div className="absolute right-2 top-2">
              <MdClose
                onClick={() => {
                  setShowNetworks(false);
                }}
                size={25}
                className="cursor-pointer  dark:fill-white fill-black mt-1 hover:scale-110 transition-transform"
              />
            </div>
            <h2 className="text-center text-2xl flex gap-4 items-center justify-between">
              Select connector
            </h2>
            <div className="relative mt-4 flex flex-col gap-2 items-center w-full">
              {connectors.map((connector) => (
                <button
                  key={connector.name}
                  className={`${buttonClasses} w-full`}
                  onClick={() => {
                    setShowNetworks(!showNetworks);
                    connect({ connector });
                  }}
                >
                  {connector.name}
                </button>
              ))}
              <div className='text-xs'>On mobile devices, we recommend using Metamask Browser for the best user experience.</div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
