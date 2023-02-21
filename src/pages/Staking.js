import { Button } from "../components/common/Button";
import { Contract, ethers } from "ethers";
import { useCallback, useContext, useEffect, useState } from "react";
import { Card, CardBlueBgBlackBorder } from "../components/common/Card";
import { Container } from "../components/common/container/Container";
import AppContainer from "../components/common/container/AppContainer";
import { Grid, GridCol, GridRow } from "../components/common/Grid";
import { InputNumber } from "../components/common/Input";
import Navbar from "../components/Navbar/Navbar";
import StakeDiagram from "../components/Staking/StakeDiagram";
import { contractAddresses } from "../static/contractAddresses";
import BtStakingABI from "../static/ABI/BtStakingABI.json";
import LpStakingABI from "../static/ABI/LpStakingABI.json";
import BTABI from "../static/ABI/BTABI.json";
import IERC20MetadataABI from "../static/ABI/IERC20MetadataABI.json";

// import styles from "./Staking.module.css";
import {
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useProvider,
} from "wagmi";
import { watchContractEvent } from "@wagmi/core";
import { bignumber } from "mathjs";
import Connect from "../components/common/Connect";
import { CenterText, FancyText } from "../components/common/Text";
import Dropdown from "../components/common/Dropdown";
import AlertContext from "../context/AlertContext";
import WindowContext from "../context/WindowContext";
import LpStakingCard from "../components/Staking/LpStakingCard";
import BtStakingCard from "../components/Staking/BtStakingCard";

function Staking() {
  const windowDimension = useContext(WindowContext);

  const [alertMessageList, setAlertMessageList] = useContext(AlertContext);

  // fetch account and current network
  const { address: connectedAddress, isConnected } = useAccount();
  const { chain: activeChain } = useNetwork();

  // ------vars--------------------------
  const [bridgeAmount, setBridgeAmount] = useState(0);

  /* set lp token symbol */
  const [lpTokenSymbol, setLpTokenSymbol] = useState();
  useEffect(() => {
    setLpTokenSymbol(
      `BT-${contractAddresses[activeChain?.network]?.nativeGas} LP`
    );
  }, [activeChain]);

  // const unwatch = watchContractEvent(
  //   {
  //     address: "0x2B0d36FACD61B71CC05ab8F3D2355ec3631C0dd5",
  //     abi: IERC20MetadataABI,
  //     eventName: "Transfer",
  //     onSuccess(data) {
  //       console.log("event listener success", data);
  //     },
  //     onError(data) {
  //       console.log("event listener error", data);
  //     },
  //   },
  //   (from, to, value) => {
  //     console.log("event listener", from, to, value);
  //   }
  // );

  /* APR calculations */
  // // fetch contract instance
  // const contract = new ethers.Contract(
  //   "0xd586E7F844cEa2F87f50152665BCbc2C279D8d70",
  //   IERC20MetadataABI,
  //   useProvider()
  // );

  // // fetch contract event logs
  // (async () => {
  //   const logs = await contract.filters.Transfer();
  //   const _logs = await contract.queryFilter(logs, 24952070);
  //   console.log(
  //     "event listener logs",
  //     _logs.map((log) => {
  //       return [
  //         log.args.from,
  //         log.args.to,
  //         ethers.utils.formatEther(log.args.value),
  //       ];
  //     })
  //   );
  // })();

  return (
    <>
      <div className="relative bg-db-background border-[3px] border-db-cyan-process rounded-2xl h-full">
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

        <div className="px-10 py-5 flex justify-between">
          <div className="w-[40%] z-10 h-full flex flex-col justify-between">
            <div>
              <StakeDiagram
                stakeSymbol={lpTokenSymbol}
                rewardSymbol={"BT"}
                stakeName={lpTokenSymbol}
                rewardName={"Better Token"}
              />
            </div>
            <div className="mt-5">
              <LpStakingCard />
            </div>
          </div>
          <div className="w-[40%] z-10 h-full flex flex-col justify-between">
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
