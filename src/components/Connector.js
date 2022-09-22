import { useNetwork, useSwitchNetwork, useAccount } from "wagmi";

import { Route, Routes } from "react-router-dom";

import Better from "./../pages/Better";
import Staking from "./../pages/Staking";
import PublicSale from "../pages/PublicSale";
import Presale from "../pages/Presale";

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
              <Better />
            </>
          }
        />

        <Route
          path="/public-sale"
          element={
            <>
              <PublicSale />
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

        <Route
          path="/presale"
          element={
            <>
              <Presale />
            </>
          }
        />
      </Routes>
    </>
  );
}

export default Connector;
