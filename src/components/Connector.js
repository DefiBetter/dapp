import { Route, Routes, Redirect, Navigate } from "react-router-dom";
import Better from "./../pages/Better";
import Staking from "./../pages/Staking";
import PublicSale from "../pages/PublicSale";
import Landing from "../pages/Landing";
import StrategyVault from "../pages/StrategyVault";
import AppContainer from "./common/container/AppContainer";
import CommunityPresale from "../pages/CommunityPresale";
import VcPresale from "../pages/VcPresale";
import Dbmt from "../pages/Dbmt";

function Connector() {
  return (
    <>
      <Routes>
        {process.env.REACT_APP_PHASE === "DBMT_SALE" && (
          <>
            <Route path="/" element={<Navigate to="/dbmt" replace={true} />} />
            <Route
              path="/dbmt"
              element={
                <AppContainer>
                  <Dbmt />
                </AppContainer>
              }
            />
          </>
        )}

        {process.env.REACT_APP_PHASE === "VC_PRESALE" && (
          <>
            <Route
              path="/"
              element={<Navigate to="/presale" replace={true} />}
            />

            <Route
              path="/presale"
              element={
                <AppContainer>
                  <VcPresale />
                </AppContainer>
              }
            />
          </>
        )}
        {process.env.REACT_APP_PHASE === "COMMUNITY_PRESALE" && (
          <>
            <Route
              path="/"
              element={<Navigate to="/presale" replace={true} />}
            />
            <Route
              path="/presale"
              element={
                <AppContainer>
                  <CommunityPresale />
                </AppContainer>
              }
            />
          </>
        )}
        {process.env.REACT_APP_PHASE === "PUBLIC_SALE" && (
          <>
            <Route
              path="/"
              element={<Navigate to="/presale" replace={true} />}
            />
            <Route
              path="/presale"
              element={
                <AppContainer>
                  <PublicSale />
                </AppContainer>
              }
            />
          </>
        )}

        {process.env.REACT_APP_PHASE === "PRODUCTION" && (
          <>
            <Route
              path="/"
              element={
                <AppContainer>
                  <Landing />
                </AppContainer>
              }
            />
             <Route
              path="/better"
              element={
                <AppContainer>
                  <Better />
                </AppContainer>
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
          </>
        )}
      </Routes>
    </>
  );
}

export default Connector;
