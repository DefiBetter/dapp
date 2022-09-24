import { useAccount, useConnect, useDisconnect } from "wagmi";
import styles from "./WalletConnect.module.css";
import truncateEthAddress from "truncate-eth-address";
import { useState } from "react";

export function WalletConnect() {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { address } = useAccount();
  const { disconnect, reset } = useDisconnect({ address });

  const [showNetworks, setShowNetworks] = useState(false);
  const [showDisconnect, setShowDisconnect] = useState(false);

  if (address) {
    return (
      <div className={styles.container}>
        {address && (
          <button
            className={styles.address}
            onClick={() => {
              setShowDisconnect(!showDisconnect);
            }}
          >
            {truncateEthAddress(address)}
          </button>
        )}
        {showDisconnect ? (
          <button
            className={styles.option}
            onClick={() => {
              setShowDisconnect(!showDisconnect);
              disconnect(address);
              reset();
            }}
          >
            Disconnect
          </button>
        ) : null}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div
        className={styles.connector}
        onClick={() => setShowNetworks(!showNetworks)}
      >
        Connect
      </div>
      {showNetworks
        ? connectors.map((connector) => (
            <div
              className={styles.option}
              onClick={() => {
                setShowNetworks(!showNetworks);
                connect({ connector });
              }}
            >
              {connector.name}
            </div>
          ))
        : null}

      {/* {error && <div>{error.message}</div>} */}
    </div>
  );
}
