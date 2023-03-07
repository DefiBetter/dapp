import { Route, Routes } from "react-router-dom";
import Better from "./../pages/Better";
import Staking from "./../pages/Staking";
import PublicSale from "../pages/PublicSale";
import Landing from "../pages/Landing";
import StrategyVault from "../pages/StrategyVault";
import AppContainer from "./common/container/AppContainer";
import CommunityPresale from "../pages/CommunityPresale";
import VcPresale from "../pages/VcPresale";
import Dbmt from "../pages/Dbmt";
import Betterdrop from "../pages/Betterdrop";
import { useContractRead, useNetwork } from "wagmi";
import { contractAddresses } from "../static/contractAddresses";
import Loader from "./common/Loader";
import LimitedCapacityAirdropABI from "../static/ABI/LimitedCapacityAirdropABI.json";

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
              ) : process.env.REACT_APP_PHASE === "DBMT_SALE" ? (
                <AppContainer>
                  <Betterdrop />
                </AppContainer>
              ) : process.env.REACT_APP_PHASE === "PUBLIC_SALE" ? (
                <AppContainer>
                  <PublicSale />
                </AppContainer>
              ) : process.env.REACT_APP_PHASE === "COMMUNITY_PRESALE" ? (
                <AppContainer>
                  <CommunityPresale />
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
          path="/dbmt"
          element={
            <AppContainer>
              <Dbmt />
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
