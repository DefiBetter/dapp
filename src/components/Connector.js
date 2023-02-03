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
              {process.env.REACT_APP_PHASE == "LANDING" ? (
                <Landing />
              ) : process.env.REACT_APP_PHASE == "PRESALE" ? (
                <Presale />
              ) : process.env.REACT_APP_PHASE == "PUBLIC_SALE" ? (
                <PublicSale />
              ) : process.env.REACT_APP_PHASE == "PRODUCTION" ? (
                <Better />
              ) : (
                <Landing />
              )}
            </>
          }
        />

        <Route path="/staking" element={<Staking />} />

        <Route path="/vaults" element={<StrategyVault />} />
        <Route
          path="/template"
          element={
            <AppContainer>
              {/* <Grid>
                <GridRow>
                  <GridCol xs={8} sm={6}>
                    <Link to="/" style={{ height: "inherit" }}>
                      <img
                        style={{ height: "100%" }}
                        src={require("../static/image/better-logo.png")}
                      />
                    </Link>
                  </GridCol>
                  <GridCol xs={6}>col 2</GridCol>
                </GridRow>
              </Grid> */}
            </AppContainer>
          }
        />
      </Routes>
    </>
  );
}

export default Connector;
