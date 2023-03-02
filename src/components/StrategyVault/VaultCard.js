import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import { contractAddresses } from "../../static/contractAddresses";
import { RiInformationLine } from "react-icons/ri";
import Dropdown from "../common/Dropdown";
import Loader from "../common/Loader";

import {
  CountdownFormatted,
  instrumentLabel,
  instrumentToLabel,
  trimNumber,
} from "../common/helper";
import { InputNumber } from "../common/Input";

import { useNetwork } from "wagmi";
import useInstruments from "../../hooks/useInstruments";
import useVaults from "../../hooks/useVaults";
import useNativeBalance from "../../hooks/useNativeBalance";
import useBalanceOf from "../../hooks/useBalanceOf";
import useVaultDeposit from "../../hooks/useVaultDeposit";
import useVaultWithdraw from "../../hooks/useVaultWithdraw";
import useVaultBalanceInfo from "../../hooks/useVaultBalanceInfo";
import usePreviewMintAmount from "../../hooks/usePreviewMintAmount";
import usePreviewBurnAmount from "../../hooks/usePreviewBurnAmount";
import useVaultName from "../../hooks/useVaultName";
import DBButton from "../common/DBButton";

const VaultCard = () => {
  /* global hooks */
  const { chain: activeChain } = useNetwork();
  const [nativeGas, setNativeGas] = useState();

  /* constants */
  // contract config
  // constants
  const strategyRef = [
    "BEAR 3",
    "BEAR 2",
    "BEAR 1",
    "NEUTRAL",
    "BULL 1",
    "BULL 2",
    "BULL 3",
  ];

  /* states */
  // instrument
  const [currentInstrument, setCurrentInstrument] = useState();
  const [epochEndTime, setEpochEndTime] = useState();
  // vault
  const [currentVault, setCurrentVault] = useState();
  const [queuedAmount, setQueuedAmount] = useState(0);
  // input amounts
  const [mintAmount, setMintAmount] = useState(0);
  const [burnAmount, setBurnAmount] = useState(0);

  const instrumentList = useInstruments((data) => {
    // Success callback function
    setCurrentInstrument(data[0]);
    setEpochEndTime(
      +data[0].lastEpochClosingTime +
        (+data[0].bufferDurationInSeconds + +data[0].epochDurationInSeconds) *
          1000
    );
  });
  const vaultList = useVaults(currentInstrument?.vaultManager, (data) => {
    // Success callback function
    setCurrentVault(data[3]);
  });
  const userGasBalance = useNativeBalance();
  const userVaultBalance = useBalanceOf(currentVault);

  const vaultBalanceInfo = useVaultBalanceInfo(currentVault);
  const previewMintAmount = usePreviewMintAmount(currentVault, mintAmount);
  const previewBurnAmount = usePreviewBurnAmount(currentVault, burnAmount);
  const currentVaultName = useVaultName(currentVault);

  // mint strategy vault token
  const depositWrite = useVaultDeposit(currentVault, mintAmount, () => {
    // Success callback function
    setMintAmount(0);
  });

  const withdrawWrite = useVaultWithdraw(currentVault, burnAmount, () => {
    setBurnAmount(0);
  });

  /* handle callback */
  // helper functions
  const handleMintAmount = (e) => {
    setMintAmount(e.target.value ? e.target.value : 0);
  };
  const handleBurnAmount = (e) => {
    setBurnAmount(e.target.value ? e.target.value : 0);
  };

  /* useEffect */
  useEffect(() => {
    setNativeGas(contractAddresses[activeChain?.network]?.nativeGas);
  }, [activeChain]);

  return (
    <>
      <div className="w-full border-[3px] border-db-cyan-process bg-white rounded-[3rem] p-4">
        <div className="flex items-baseline justify-center gap-5">
          <div className="font-bold flex justify-center text-2xl md:text-4xl gap-2">
            Strategy
            <span className="mt-7 font-fancy text-db-cyan-process">Vaults</span>
          </div>
          <div className="text-sm p-3 border-[1px] border-black rounded-full w-8 h-8 flex justify-center items-center">
            i
          </div>
        </div>

        <div className=" mt-10 md:mt-2 flex gap-5 justify-between flex-col">
          <div className="flex gap-5 flex-col md:flex-row">
            <div className="flex w-full md:w-1/2 gap-2 items-center">
              <div className="">
                <img
                  className="h-10 w-10"
                  alt="binance"
                  src={require("../../static/image/bnbchain-logo.png")}
                />
              </div>
              <div className="flex-1">
                <Dropdown
                  currentItemLabel={instrumentToLabel(currentInstrument)}
                  currentItem={currentInstrument}
                  setCurrentItem={setCurrentInstrument}
                  itemList={instrumentList}
                  itemLabelList={instrumentList?.map((instrument) =>
                    instrumentToLabel(instrument)
                  )}
                />
              </div>
            </div>
            <div className="flex w-full md:w-1/2 gap-2 items-center">
              <Dropdown
                currentItem={currentVault}
                currentItemLabel={strategyRef[vaultList?.indexOf(currentVault)]}
                setCurrentItem={setCurrentVault}
                itemList={vaultList}
                itemLabelList={strategyRef}
              />
              <div className="p-3 border-[1px] border-black rounded-full w-8 h-8 flex justify-center items-center">
                i
              </div>
            </div>
          </div>
          <div className="flex gap-5 flex-col md:flex-row">
            <div className="flex justify-between w-full items-center">
              <div className="flex-1 shadow-db w-36 text-center font-bold bg-db-background p-3 border-[1px] border-black rounded-lg">
                Vault Balance
              </div>
              <div className="flex-1 text-center font-bold">
                {vaultBalanceInfo
                  ? trimNumber(
                      ethers.utils.formatEther(vaultBalanceInfo.totalBalance),
                      4,
                      "dp"
                    )
                  : null}{" "}
                {nativeGas}
              </div>
            </div>

            <div className="flex justify-between w-full items-center">
              <div className="flex-1 shadow-db w-36 text-center font-bold bg-db-background p-3 border-[1px] border-black rounded-lg">
                Vault Performance
              </div>
              <div className="flex-1 text-center text-lime-500 font-bold">
                {trimNumber(69, 4, "dp")}% APR
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-5 justify-between mt-5 flex-col md:flex-row">
          {/* Left */}
          <div className="w-full md:w-[50%] flex flex-col gap-3">
            <div className="w-full">
              <DBButton
                disabled={mintAmount === 0}
                onClickCallback={() => {
                  if (depositWrite.transaction.write) {
                    depositWrite.transaction.write();
                  }
                }}
              >
                {depositWrite.confirmation.isLoading ? (
                  <Loader text="Depositing" />
                ) : (
                  "Deposit"
                )}
              </DBButton>
            </div>
            <div className="flex items-center w-full">
              <div className="pt-1 px-5 text-center font-fancy text-xl text-db-cyan-process font-bold">
                for
              </div>
              <div className="flex-1">
                <InputNumber
                  style={{ flex: 1 }}
                  onChange={handleMintAmount}
                  min={0}
                  max={userGasBalance}
                  placeholder="Mint amount..."
                  value={mintAmount > 0 ? mintAmount : ""}
                  setValue={setMintAmount}
                />
              </div>
            </div>
            <div className="font-bold flex justify-center gap-1 text-sm ">
              {nativeGas}
            </div>
            <div className="pt-1 text-center font-fancy text-xl text-db-cyan-process font-bold">
              and receive
            </div>
            <div className="w-full shadow-db text-center font-bold bg-db-french-sky p-3 border-[1px] border-black rounded-lg">
              {trimNumber(previewMintAmount, 4, "dp")}
            </div>
            <div className="w-full text-center flex justify-center gap-1 text-sm">
              {instrumentLabel(currentInstrument, false)}{" "}
              <span className="font-bold">{currentVaultName}</span>
            </div>
          </div>

          {/* Right */}
          <div className="flex h-0.5 w-full bg-db-cyan-process md:hidden justify-center"></div>
          <div className="w-full md:w-1/2 flex flex-col gap-3">
            <div className="w-full">
              <DBButton
                disabled={burnAmount === 0}
                onClick={() => {
                  if (withdrawWrite.transaction.write) {
                    withdrawWrite.transaction.write();
                  }
                }}
              >
                <div className="flex gap-2 items-center justify-center">
                  <div className="font-fancy">
                    {queuedAmount > 0 && burnAmount > 0 ? (
                      `Claim queued\xa0 & \xa0burn`
                    ) : queuedAmount > 0 ? (
                      `Claim queued`
                    ) : withdrawWrite.confirmation.isLoading ? (
                      <Loader text="Burning" />
                    ) : (
                      "Burn"
                    )}
                  </div>
                  <div className="pb-1 font-sans text-sm leading-none">
                    {trimNumber(queuedAmount, 4, "dp")} {nativeGas} (
                    {epochEndTime >= Date.now() ? "queued for " : "claim now"}
                    <CountdownFormatted ms={epochEndTime} />)
                  </div>
                </div>
              </DBButton>
            </div>
            <div className="flex items-center w-full">
              <div className="pt-1 px-5 text-center font-fancy text-xl text-db-cyan-process font-bold">
                for
              </div>
              <div className="flex-1">
                <InputNumber
                  style={{ flex: 1 }}
                  onChange={handleBurnAmount}
                  min={0}
                  max={userVaultBalance}
                  placeholder="Burn amount..."
                  value={burnAmount > 0 ? burnAmount : ""}
                  setValue={setBurnAmount}
                />
              </div>
            </div>
            <div className=" flex justify-center gap-1 text-sm ">
              {instrumentLabel(currentInstrument, false)}{" "}
              <span className="font-bold">{currentVaultName}</span>
            </div>
            <div className="pt-1 text-center font-fancy text-xl text-db-cyan-process font-bold">
              and receive
            </div>

            <div className="w-full shadow-db text-center font-bold bg-db-french-sky p-3 border-[1px] border-black rounded-lg">
              {trimNumber(previewBurnAmount, 4, "dp")}
            </div>
            <div className="w-full text-center flex justify-center gap-1 text-sm">
              {nativeGas}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VaultCard;
