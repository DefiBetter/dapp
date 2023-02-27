import { useEffect, useState } from "react";
import StakeDiagram from "../components/Staking/StakeDiagram";
import { contractAddresses } from "../static/contractAddresses";

import { useNetwork } from "wagmi";
import LpStakingCard from "../components/Staking/LpStakingCard";
import BtStakingCard from "../components/Staking/BtStakingCard";

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
      <div className="relative bg-db-background border-[3px] border-db-cyan-process h-full">
        {/* FUTURE BRIDGE FEATURE */}
        <div className="m-auto w-[200px] mt-5 bg-white border-2 border-db-cyan-process rounded-2xl">
          <div className="p-4 flex flex-col items-center">
            <div className="underline font-fancy text-3xl text-db-cyan-process">
              Staking
            </div>
            {/* <div className="flex gap-2 mt-5">
              <div>
                <InputNumber
                  max={0}
                  min={0}
                  onChange={() => {}}
                  placeholder={"hi"}
                  value={0}
                />
              </div>
              <div>
                <Dropdown
                  currentItem={"AVAX"}
                  currentItemLabel={"AVAX"}
                  setCurrentItem={() => {}}
                  itemList={[]}
                  itemLabelList={["BSC", "AVAX", "MATIC", "FTM", "HARDHAT"]}
                />
              </div>
              <div>
                <Button>Bridge</Button>
              </div>
            </div> */}
          </div>
        </div>
        <div className="z-0 absolute h-60 bottom-5 flex justify-center left-0 right-0">
          <img
            alt="faucet"
            className="h-full"
            src={require("../static/image/faucet.png")}
          ></img>
        </div>

        <div className="px-2 md:px-4 lg:px-10 py-5 flex flex-col lg:flex-row justify-between gap-10 lg:gap-0">
          <div className="w-full lg:w-[45%] xl:w-[40%] z-10 h-full flex flex-col justify-between">
            <div>
              <StakeDiagram
                stakeSymbol={lpTokenSymbol}
                rewardSymbol={"BT"}
                stakeName={lpTokenSymbol}
                rewardName={"Better Token"}
              />
            </div>
            <div className="mt-5">
              <LpStakingCard
                nativeGas={contractAddresses[activeChain?.network]?.nativeGas}
              />
            </div>
          </div>
          <div className="w-full lg:w-[45%] xl:w-[40%] z-10 h-full flex flex-col justify-between">
            <StakeDiagram
              stakeSymbol={"BT"}
              rewardSymbol={contractAddresses[activeChain?.network]?.nativeGas}
              stakeName={"Better Token"}
              rewardName={contractAddresses[activeChain?.network]?.nativeGas}
            />
            <div className="mt-5">
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
