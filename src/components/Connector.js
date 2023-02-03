import { useNetwork, useSwitchNetwork, useAccount } from "wagmi";

import { Link, Route, Routes } from "react-router-dom";

import Better from "./../pages/Better";
import Staking from "./../pages/Staking";
import PublicSale from "../pages/PublicSale";
import Presale from "../pages/Presale";
import Landing from "../pages/Landing";
import StrategyVault from "../pages/StrategyVault";
import { AlertOverlay } from "./common/AlertMessage";
import { createContext } from "react";
import AppContainer from "./common/container/AppContainer";
import { Grid, GridCol, GridRow } from "./common/Grid";
import Connect from "./common/Connect";

function Connector() {
  const { chain: activeChain } = useNetwork();
  const networkSwitcher = useSwitchNetwork();
  const { address: connectedAddress, isConnected } = useAccount();

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
              {process.env.REACT_APP_PHASE == "PRODUCTION" ? (
                <Better />
              ) : process.env.REACT_APP_PHASE == "PUBLIC_SALE" ? (
                <PublicSale />
              ) : process.env.REACT_APP_PHASE == "PRESALE" ? (
                <Presale />
              ) : process.env.REACT_APP_PHASE == "LANDING" ? (
                <AppContainer>
                  <Landing />
                </AppContainer>
              ) : (
                <AppContainer>
                  <Landing />
                </AppContainer>
              )}
            </>
          }
        />

        <Route path="/staking" element={<Staking />} />

        <Route
          path="/vaults"
          element={
            <AppContainer>
              <Connect isConnected={isConnected} activeChain={activeChain}>
                <StrategyVault />
              </Connect>
            </AppContainer>
          }
        />
        <Route
          path="/template"
          element={
            <AppContainer>
              <Connect isConnected={isConnected} activeChain={activeChain}>
                hi
              </Connect>
            </AppContainer>
          }
        />
      </Routes>
    </>
  );
}

export default Connector;
