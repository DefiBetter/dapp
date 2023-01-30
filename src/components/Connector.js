import { useNetwork, useSwitchNetwork, useAccount } from "wagmi";

import { Route, Routes } from "react-router-dom";

import Better from "./../pages/Better";
import Staking from "./../pages/Staking";
import PublicSale from "../pages/PublicSale";
import Presale from "../pages/Presale";
import Landing from "../pages/Landing";
import StrategyVault from "../pages/StrategyVault";
import { AlertOverlay } from "./common/AlertMessage";
import { createContext } from "react";

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
              <AlertOverlay>
                {process.env.REACT_APP_LANDING_PHASE == "true" ? (
                  <Landing />
                ) : process.env.REACT_APP_PRESALE_PHASE == "true" ? (
                  <Presale />
                ) : process.env.REACT_APP_PUBLIC_SALE_PHASE == "true" ? (
                  <PublicSale />
                ) : process.env.REACT_APP_LAUNCH_PHASE == "true" ? (
                  <Better />
                ) : null}
              </AlertOverlay>
            </>
          }
        />

        <Route
          path="/staking"
          element={
            <AlertOverlay>
              <Staking />
            </AlertOverlay>
          }
        />

        <Route
          path="/vaults"
          element={
            <AlertOverlay>
              <StrategyVault />
            </AlertOverlay>
          }
        />
      </Routes>
    </>
  );
}

export default Connector;
