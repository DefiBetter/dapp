import { useAccount, useNetwork } from "wagmi";

import Navbar from "../components/Navbar/Navbar";
import styles from "./Landing.module.css";

function Landing() {
  // fetch account and current network
  const { address: connectedAddress, isConnected } = useAccount();
  const { chain: activeChain } = useNetwork();

  // if wallet not connected
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

  return (
    <>
      <Navbar></Navbar>
      <div className={styles.container}>
        <div className={styles.fancyText}>Coming soon...</div>
        <svg>
          <text x={20} y={50} className={styles.normalText}>
            DeFi
          </text>
          <text x={100} y={80} className={styles.fancyText}>
            Better
          </text>
        </svg>
      </div>
    </>
  );
}

export default Landing;
