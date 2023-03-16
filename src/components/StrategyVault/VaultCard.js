import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { contractAddresses } from "../../static/contractAddresses";
import Dropdown from "../common/Dropdown";
import Loader from "../common/Loader";
import { BsBank, BsWallet2 } from "react-icons/bs";

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

  const nativeGas = contractAddresses[activeChain?.network]?.nativeGas;

  return (
    <>
      <div className="w-full rounded-lg dark:shadow-inner shadow-sm shadow-db-cyan-process dark:shadow-black bg-white dark:bg-db-dark p-2 md:p-4">
        <div className="mt-10 md:mt-2 flex gap-5 justify-between flex-col">
          <div className="flex gap-5 flex-col md:flex-row">
            <div className="flex w-full md:w-1/2 gap-2 items-center justify-between">
              <div className="">
                <img
                  className="h-10 w-10"
                  alt="binance"
                  src={require("../../static/image/bnbchain-logo.png")}
                />
              </div>
              <div className="">
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
            <div className="flex w-full md:w-1/2 gap-2 items-center justify-between ">
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
          <div className="m-auto flex items-center justify-center w-2/3 h-14 rounded-xl dark:shadow-inner shadow-sm shadow-db-cyan-process dark:shadow-black bg-white dark:bg-db-dark p-2">
            <div className="cursor-pointer flex-1 flex justify-center items-center bg-db-blue-gray h-10 rounded-lg">
              Mint
            </div>
            <div className="flex-1 flex justify-center">Burn</div>
          </div>
          <div className="flex gap-5 flex-col md:flex-row">
            <div className="md:h-14 flex flex-row md:flex-col w-full md:w-1/2 items-center justify-between md:justify-center">
              <div className="flex items-center gap-2 text-db-blue-gray">
                <BsBank size={20} />
                <div>Vault Balance</div>
              </div>
              <div className="font-bold">
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
            <div className="md:h-14 flex flex-row md:flex-col w-full md:w-1/2 items-center justify-between md:justify-center">
              <div className="flex items-center gap-2 text-db-blue-gray">
                <BsWallet2 size={20} />
                <div>Your Wallet Balance</div>
              </div>
              <div className="font-bold">
                {userGasBalance} {nativeGas}
              </div>
            </div>

            <div className="md:h-14 flex flex-row md:flex-col w-full md:w-1/2 items-center justify-between md:justify-center">
              <div className="flex items-center gap-2 text-db-blue-gray">
                <BsWallet2 size={20} />
                <div>Vault Performance</div>
              </div>
              <div className="font-bold">{trimNumber(69, 4, "dp")}% APR</div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-between mt-4 flex-col md:flex-row">
          {/* Left */}
          <div className="w-full flex flex-col gap-4">
            <div className="w-full gap-2 flex">
              <div className="w-16 md:w-20 flex justify-center items-center">
                <span className="">For</span>
              </div>
              <div className="flex items-center w-full">
                <div className="h-14 w-full bg-white dark:bg-db-dark-input rounded-lg flex gap-4 items-center px-4 shadow-inner shadow-db-cyan-process dark:shadow-black">
                  <input
                    value={mintAmount > 0 ? mintAmount : ""}
                    onChange={handleMintAmount}
                    type={"number"}
                    min={0}
                    className="text-left md:text-center md:pl-20 px-0 md:px-4 h-10 w-full focus:ring-0 focus:outline-none rounded-lg bg-white dark:bg-db-dark-input"
                    placeholder={`${nativeGas} amount`}
                  />
                  <div
                    onClick={() => {
                      setMintAmount(
                        (Number(userGasBalance) - 0.0001).toString()
                      );
                    }}
                    className="cursor-pointer rounded-lg flex justify-center items-center h-9 pb-0.5 px-2  border-[1px] border-db-cyan-process text-db-cyan-process hover:bg-db-cyan-process hover:text-white transition-colors"
                  >
                    MAX
                  </div>
                  <div className="">{nativeGas}</div>
                </div>
              </div>
            </div>

            <div className="w-full gap-2 flex">
              <div className="w-16 md:w-20 flex justify-center items-center">
                <span className="">Get</span>
              </div>
              <div className="flex items-center w-full">
                <div className="h-14 w-full bg-white dark:bg-db-dark-nav rounded-lg flex gap-4 items-center px-4">
                  <div className="text-left md:text-center md:pl-20 px-0 md:px-4 w-full text-xl">
                    {trimNumber(previewMintAmount, 4, "dp")}
                  </div>
                  <div className="w-32 text-right">{currentVaultName}</div>
                </div>
              </div>
            </div>

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
          </div>

          {/* Right */}
          {/* <div className="w-full md:w-1/2 flex flex-col gap-3">
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
                  <div className="">
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
                  <div className="font-sans text-sm leading-none">
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
          </div> */}
        </div>
      </div>
    </>
  );
};

export default VaultCard;
