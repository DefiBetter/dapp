import { Button } from "../../common/Button";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import styles from "./WalletConnect.module.css";
import truncateEthAddress from "truncate-eth-address";
import { useState } from "react";
import { NormalText } from "../../common/Text";

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
        {
          <Button
            className={styles.address}
            onClick={() => {
              setShowDisconnect(!showDisconnect);
            }}
          >
            <NormalText>{truncateEthAddress(address)}</NormalText>
          </Button>
        }
        {showDisconnect ? (
          <Button
            className={styles.option}
            onClick={() => {
              setShowDisconnect(!showDisconnect);
              disconnect(address);
              reset();
            }}
          >
            <NormalText>Disconnect</NormalText>
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Button
        className={styles.address}
        onClick={() => setShowNetworks(!showNetworks)}
      >
        <NormalText>Connect</NormalText>
      </Button>
      {showNetworks
        ? connectors.map((connector) => (
            <Button
              className={styles.option}
              onClick={() => {
                setShowNetworks(!showNetworks);
                connect({ connector });
              }}
            >
              <NormalText>{connector.name}</NormalText>
            </Button>
          ))
        : null}

      {/* {error && <div>{error.message}</div>} */}
    </div>
  );
}
