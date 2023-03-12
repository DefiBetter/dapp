import { useEffect, useState } from "react";
import StakeDiagram from "../components/Staking/StakeDiagram";
import { contractAddresses } from "../static/contractAddresses";

import { useNetwork } from "wagmi";
import LpStakingCard from "../components/Staking/LpStakingCard";
import BtStakingCard from "../components/Staking/BtStakingCard";
import PageTitle from "../components/common/PageTitle";

function Staking() {
  // fetch account and current network
  const { chain: activeChain } = useNetwork();

  /* set lp token symbol */
  const [lpTokenSymbol, setLpTokenSymbol] = useState();
  useEffect(() => {
    setLpTokenSymbol(
      `BT-${contractAddresses[activeChain?.network]?.nativeGas} LP`
    );
  }, [activeChain]);

  return (
    <>
      <div className="relative bg-db-light dark:bg-db-dark-nav transition-colors rounded-md p-2 md:p-4">
        <div className="flex gap-4 flex-col lg:flex-row">
          <div className="z-10 w-full p-4 rounded-lg dark:shadow-inner shadow-sm shadow-db-cyan-process dark:shadow-black bg-white dark:bg-db-dark flex gap-4 flex-col lg:flex-row justify-between">
            <div className="w-full z-10 h-full flex flex-col justify-between">
              <div>
                <StakeDiagram
                  stakeSymbol={lpTokenSymbol}
                  rewardSymbol={"BT"}
                  stakeName={lpTokenSymbol}
                  rewardName={"Better Token"}
                />
              </div>
              <LpStakingCard
                nativeGas={contractAddresses[activeChain?.network]?.nativeGas}
              />
            </div>
          </div>
          <div className="z-10 w-full p-4 rounded-lg dark:shadow-inner shadow-sm shadow-db-cyan-process dark:shadow-black bg-white dark:bg-db-dark flex gap-4 flex-col lg:flex-row justify-between">
            <div className="w-full z-10 h-full flex flex-col justify-between">
              <StakeDiagram
                stakeSymbol={"BT"}
                rewardSymbol={
                  contractAddresses[activeChain?.network]?.nativeGas
                }
                stakeName={"Better Token"}
                rewardName={contractAddresses[activeChain?.network]?.nativeGas}
              />
              <BtStakingCard
                  nativeGas={contractAddresses[activeChain?.network]?.nativeGas}
                />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Staking;
