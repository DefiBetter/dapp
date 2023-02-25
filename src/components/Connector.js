import { useNetwork, useSwitchNetwork, useAccount } from "wagmi";

import { Link, Route, Routes } from "react-router-dom";

import Better from "./../pages/Better";
import Staking from "./../pages/Staking";
import PublicSale from "../pages/PublicSale";
import Presale from "../pages/CommunityPresale";
import Landing from "../pages/Landing";
import StrategyVault from "../pages/StrategyVault";
import { AlertOverlay } from "./common/AlertMessage";
import { createContext } from "react";
import AppContainer from "./common/container/AppContainer";
import { Grid, GridCol, GridRow } from "./common/Grid";
import CommunityPresale from "../pages/CommunityPresale";
import VcPresale from "../pages/VcPresale";
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
                  <Better />
                </AppContainer>
              ) : process.env.REACT_APP_PHASE === "PUBLIC_SALE" ? (
                <AppContainer>
                  <PublicSale />
                </AppContainer>
              ) : process.env.REACT_APP_PHASE === "COMMUNITY_PRESALE" ? (
                <AppContainer>
                  <Connect isConnected={isConnected} activeChain={activeChain}>
                    <CommunityPresale />
                  </Connect>
                </AppContainer>
              ) : process.env.REACT_APP_PHASE === "VC_PRESALE" ? (
                <AppContainer>
                  <VcPresale />
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
              <Staking />
            </AppContainer>
          }
        />

        <Route
          path="/vaults"
          element={
            <AppContainer>
              <StrategyVault />
            </AppContainer>
          }
        />
        <Route
          path="/template"
          element={
            <AppContainer>
              <PublicSale />
            </AppContainer>
          }
        />
      </Routes>
    </>
  );
}

export default Connector;
