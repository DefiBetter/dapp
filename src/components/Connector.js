import { Route, Routes } from "react-router-dom";
import Better from "./../pages/Better";
import Staking from "./../pages/Staking";
import PublicSale from "../pages/PublicSale";
import Presale from "../pages/Presale";
import Landing from "../pages/Landing";
import StrategyVault from "../pages/StrategyVault";
import AppContainer from "./common/container/AppContainer";

function Connector() {
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
              ) : process.env.REACT_APP_PHASE === "PRESALE" ? (
                <AppContainer>
                  <Presale />
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
