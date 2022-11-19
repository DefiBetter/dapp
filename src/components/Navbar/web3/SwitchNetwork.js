import { useState } from "react";
import { useNetwork, useSwitchNetwork } from "wagmi";
import styles from "./SwitchNetwork.module.css";

export function SwitchNetwork() {
  const { chain: activeChain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  const [network, setNetwork] = useState("");

  // console.log("activeChain switch", activeChain);

  return (
    <div className={styles.container}>
      {/* {chain &&
        (!chain.unsupported ? (
          <div>Connected to {chain.name}</div>
        ) : (
          <div>Connected to unsupported chain with ID {chain.name}</div>
        ))} */}

      {chains.map((x) => (
        <div
          className={`${styles.network} ${
            activeChain?.id == x.id ? styles.currentChain : null
          }`}
          // disabled={!switchNetwork || x.id === chain?.id}
          // key={x.id}
          onClick={() => switchNetwork?.(x.id)}
        >
          {x.logo ? (
            <img src={require(`../../../static/image/${x.logo}`)} />
          ) : null}
          {/* {x.name} */}
          {/* {isLoading && pendingChainId === x.id && " (switching)"} */}
        </div>
      ))}

      {chains.map((x) => {
        // console.log(x);
      })}

      {/* <div>{error && error.message}</div> */}
    </div>
  );
}
