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
  const { address: connectedAddress, isConnected } = useAccount();

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              {process.env.REACT_APP_PHASE === "PRODUCTION" ? (
                <AppContainer>
                  <Connect isConnected={isConnected} activeChain={activeChain}>
                    <Better />
                  </Connect>
                </AppContainer>
              ) : process.env.REACT_APP_PHASE === "PUBLIC_SALE" ? (
                <AppContainer>
                  <Connect isConnected={isConnected} activeChain={activeChain}>
                    <PublicSale />
                  </Connect>
                </AppContainer>
              ) : process.env.REACT_APP_PHASE === "PRESALE" ? (
                <AppContainer>
                  <Connect isConnected={isConnected} activeChain={activeChain}>
                    <Presale />
                  </Connect>
                </AppContainer>
              ) : process.env.REACT_APP_PHASE === "LANDING" ? (
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

        <Route
          path="/staking"
          element={
            <AppContainer>
              <Connect isConnected={isConnected} activeChain={activeChain}>
                <Staking />
              </Connect>
            </AppContainer>
          }
        />

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
                <PublicSale />
              </Connect>
            </AppContainer>
          }
        />
      </Routes>
    </>
  );
}

export default Connector;
