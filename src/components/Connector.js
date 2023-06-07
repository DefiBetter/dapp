import { Route, Routes, Navigate } from "react-router-dom";
import Better from "./../pages/Better";
import Staking from "./../pages/Staking";
import PublicSale from "../pages/PublicSale";
import StrategyVault from "../pages/StrategyVault";
import AppContainer from "./common/container/AppContainer";
import CommunityPresale from "../pages/CommunityPresale";
import VcPresale from "../pages/VcPresale";
import Dbmt from "../pages/Dbmt";
import { useEffect, useState } from "react";
import RestrictedArea from "../pages/RestrictedArea";
import LoadingPage from "../pages/LoadingPage";

function Connector() {
  const [userCountry, setUserCountry] = useState();
  useEffect(() => {
    async function getUserCountry() {
      try {
        const geolocResult = await (
          await fetch(`https://geolocation-db.com/json/`)
        ).json();
        setUserCountry(geolocResult?.country_name);
      } catch (e) {
        // Call again after 1sec if fails
        setTimeout(getUserCountry, 50);
      }
      // {"country_code":"US","country_name":"United States","city":"","postal":"","latitude":,"longitude":,"IPv4":"","state":""}
    }

    if (
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1"
    ) {
      getUserCountry();
    } else {
      setUserCountry("OK");
    }
  }, []);

  if (!userCountry) {
    // Loading while fetching country
    return (
      <AppContainer restricted>
        <LoadingPage />
      </AppContainer>
    );
  } else if (userCountry && userCountry !== "United States") {
    return (
      <>
        <Routes>
          {process.env.REACT_APP_PHASE === "DBMT_SALE" && (
            <>
              <Route path="/" element={<Navigate to="/mrp" replace={true} />} />
              <Route
                path="/mrp"
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
                    <Better />
                  </AppContainer>
                }
              />
              <Route
                path="/mrp"
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
            </>
          )}
        </Routes>
      </>
    );
  } else {
    return (
      <AppContainer restricted>
        <RestrictedArea country={userCountry} />
      </AppContainer>
    );
  }
}

export default Connector;
