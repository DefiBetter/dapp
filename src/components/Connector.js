import { useNetwork, useSwitchNetwork, useAccount } from "wagmi";

import { Route, Routes } from "react-router-dom";

import Better from "./../pages/Better";
import Staking from "./../pages/Staking";
import PublicSale from "../pages/PublicSale";
import Presale from "../pages/Presale";
import Landing from "../pages/Landing";

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
              {console.log(
                "env",
                process.env.REACT_APP_LANDING_PHASE,
                process.env.REACT_APP_PRESALE_PHASE,
                process.env.REACT_APP_PUBLIC_SALE_PHASE,
                process.env.REACT_APP_LAUNCH_PHASE
              )}
              {process.env.REACT_APP_LANDING_PHASE == "true" ? (
                <Landing />
              ) : process.env.REACT_APP_PRESALE_PHASE == "true" ? (
                <Presale />
              ) : process.env.REACT_APP_PUBLIC_SALE_PHASE == "true" ? (
                <PublicSale />
              ) : process.env.REACT_APP_LAUNCH_PHASE == "true" ? (
                <Better />
              ) : null}
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

        <Route path="/vaults" element={<></>} />
      </Routes>
    </>
  );
}

export default Connector;
