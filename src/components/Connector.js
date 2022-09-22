import { useNetwork, useSwitchNetwork, useAccount } from "wagmi";

import { NavLink, Route, Routes } from "react-router-dom";

import Better from "./../pages/Better";
import Staking from "./../pages/Staking";
import PublicSale from "../pages/PublicSale";
import Presale from "../pages/Presale";

import Navbar from "./Navbar/Navbar";
import WalletConnect from "./WalletConnect";
import SwitchNetwork from "./SwitchNetwork";

function Connector() {
  const network = useNetwork();
  const networkSwitcher = useSwitchNetwork();
  const account = useAccount();

  const liStyle = {
    display: "inline",
    margin: "1rem",
    padding: "1rem",
  };

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Better
                connectedAddress={account.address}
                activeChain={network.chain}
                isConnected={account.isConnected}
              />
            </>
          }
        />

        <Route
          path="/public-sale"
          element={
            <>
              <PublicSale
                connectedAddress={account.address}
                activeChain={network.chain}
                isConnected={account.isConnected}
              />
            </>
          }
        />

        <Route
          path="/staking"
          element={
            <>
              <Staking />
            </>
          }
        />

        <Route
          path="/presale"
          element={
            <>
              <Presale
                activeChain={network.chain}
                connectedAddress={account.address}
              />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default Connector;
