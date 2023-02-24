import { ethers } from "ethers";
import { useContext, useEffect, useState } from "react";
import { contractAddresses } from "../../static/contractAddresses";
import { RiInformationLine } from "react-icons/ri";
import Dropdown from "../common/Dropdown";

import {
  CountdownFormatted,
  instrumentLabel,
  instrumentToLabel,
  trimNumber,
} from "../common/helper";
import { InputNumber } from "../common/Input";
import IERC20MetadataABI from "../../static/ABI/IERC20MetadataABI.json";
import StrategyVaultABI from "../../static/ABI/StrategyVaultABI.json";
import StrategyVaultManagerABI from "../../static/ABI/StrategyVaultManagerABI.json";
import DeFiBetterV1ABI from "../../static/ABI/DeFiBetterV1ABI.json";
import {
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  useNetwork,
} from "wagmi";
import AlertContext from "../../context/AlertContext";

const VaultCard = () => {
  /* global hooks */
  const { address: connectedAddress, isConnected } = useAccount();
  const { chain: activeChain } = useNetwork();
  const [nativeGas, setNativeGas] = useState();
  const [alertMessageList, setAlertMessageList] = useContext(AlertContext);

  /* constants */
  // contract config
  const betterContractConfig = {
    address: contractAddresses[activeChain?.network]?.better,
    abi: DeFiBetterV1ABI,
  };

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
  const [instrumentList, setInstrumentList] = useState();

  console.log(
    "currentInstrument",
    (+currentInstrument?.lastEpochClosingTime +
      +currentInstrument?.bufferDurationInSeconds +
      +currentInstrument?.epochDurationInSeconds) *
      1000
  );

  // vault
  const [vaultList, setVaultList] = useState();
  const [currentVault, setCurrentVault] = useState();
  const [vaultBalanceInfo, setVaultBalanceInfo] = useState();
  const [previewMintAmount, setPreviewMintAmount] = useState(0);
  const [previewBurnAmount, setPreviewBurnAmount] = useState(0);
  const [currentVaultName, setCurrentVaultName] = useState("");
  const [queuedAmount, setQueuedAmount] = useState(0);
  const [currentVaultPerformance, setCurrentVaultPerformance] = useState("0");

  // user
  const [userGasBalance, setUserGasBalance] = useState(0);
  const [userVaultBalance, setUserVaultBalance] = useState(0);

  // input amounts
  const [mintAmount, setMintAmount] = useState(0);
  const [burnAmount, setBurnAmount] = useState(0);

  /* web3 read/write */
  // get instrument list
  useContractRead({
    ...betterContractConfig,
    functionName: "getInstruments",
    onError(data) {},
    onSuccess(data) {
      console.log("getInstruments", data);
      setCurrentInstrument(data[0]);
      setInstrumentList(data);
      setEpochEndTime(
        +data[0].lastEpochClosingTime +
          (+data[0].bufferDurationInSeconds + +data[0].epochDurationInSeconds) *
            1000
      );
    },
  });

  // get list of strategy vaults from vault manager
  useContractRead({
    address: currentInstrument?.vaultManager,
    abi: StrategyVaultManagerABI,
    functionName: "getVaults",
    args: [],
    onError(data) {
      console.log("getVaults currentInstrument", currentInstrument);
      console.log("getVaults vaultManager", currentInstrument?.vaultManager);
    },
    onSuccess(data) {
      console.log("getVaults", data);
      setVaultList(data);
      setCurrentVault(data[3]);
    },
  });

  // user gas balance
  useBalance({
    address: connectedAddress,
    onSuccess(data) {
      setUserGasBalance(+data.formatted);
    },
    watch: true,
  });

  // user vault balance
  useContractRead({
    address: currentVault,
    abi: IERC20MetadataABI,
    functionName: "balanceOf",
    args: [connectedAddress],
    onSuccess(data) {
      setUserVaultBalance(+ethers.utils.formatEther(data));
    },
    watch: true,
  });

  // mint strategy vault token
  const { write: depositWrite } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: currentVault,
    abi: StrategyVaultABI,
    functionName: "deposit",
    overrides: {
      value: ethers.utils.parseEther(mintAmount?.toString()),
    },
    onSuccess(data) {
      setMintAmount(0);
    },
  });

  // burn strategy vault token
  const { write: withdrawWrite } = useContractWrite({
    mode: "recklesslyUnprepared",
    address: currentVault,
    abi: StrategyVaultABI,
    functionName: "withdraw",
    args: [ethers.utils.parseEther(burnAmount.toString())],
    onMutate(data) {
      console.log("withdraw mutate", data);
      setAlertMessageList([...alertMessageList, "Burning..."]);
    },
    onSuccess(data) {
      setBurnAmount(0);
      setAlertMessageList([
        ...alertMessageList,
        "Successfully burned vault tokens",
      ]);
    },
    onError(data) {
      console.log("withdraw error", data);
      setAlertMessageList([...alertMessageList, "Error burning vault tokens!"]);
    },
  });

  // vault balance info
  useContractRead({
    address: currentVault,
    abi: StrategyVaultABI,
    functionName: "getVaultBalanceInfo",
    args: [],
    onSuccess(data) {
      console.log("getVaultBalanceInfo", currentVault, data);
      setVaultBalanceInfo(data);
    },
    watch: true,
  });

  // preview gas deposit when mint vault token
  useContractRead({
    address: currentVault,
    abi: StrategyVaultABI,
    functionName: "previewDeposit",
    args: [ethers.utils.parseEther(mintAmount.toString())],
    onSuccess(data) {
      console.log("preview", +ethers.utils.formatEther(data));
      setPreviewMintAmount(+ethers.utils.formatEther(data));
    },
  });

  // preview gas withdraw when burn vault token
  useContractRead({
    address: currentVault,
    abi: StrategyVaultABI,
    functionName: "previewWithdraw",
    args: [ethers.utils.parseEther(burnAmount.toString())],
    onSuccess(data) {
      setPreviewBurnAmount(+ethers.utils.formatEther(data));
    },
  });

  // vault token name
  useContractRead({
    address: currentVault,
    abi: IERC20MetadataABI,
    functionName: "name",
    args: [],
    onSuccess(data) {
      setCurrentVaultName(data);
    },
  });

  // vault performance
  useContractRead({
    address: currentVault,
    abi: StrategyVaultABI,
    functionName: "getVaultPerformance",
    args: [],
    onError(data) {
      console.log("getVaultPerformance", data);
    },
    onSuccess(data) {
      console.log("getVaultPerformance", data);
      setCurrentVaultPerformance(data);
    },
    watch: true,
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
    // set nativeGas for current network
    setNativeGas(contractAddresses[activeChain?.network]?.nativeGas);

    // set bin total
  }, [activeChain]);

  return (
    <>
      <div className="w-full border-[3px] border-db-cyan-process bg-white rounded-[3rem] p-4">
        <div className="flex items-baseline justify-center gap-5">
          <div className="font-bold flex justify-center text-4xl gap-2">
            Strategy
            <span className="mt-7 font-fancy text-4xl text-db-cyan-process">
              Vaults
            </span>
          </div>
          <div className="text-sm p-3 border-[1px] border-black rounded-full w-8 h-8 flex justify-center items-center">
            i
          </div>
        </div>

        <div className="flex gap-5 justify-between mt-2">
          {/* Left */}
          <div className="w-1/2 flex flex-col gap-3">
            <div className="flex gap-2 items-center">
              <div>
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
            <div className="flex justify-between w-full items-center">
              <div className="flex-1 shadow-db w-36 text-center font-bold bg-db-background p-3 border-[1px] border-black rounded-lg">
                Vault Balance
              </div>
              <div className="flex-1 text-center font-bold">
                {vaultBalanceInfo
                  ? trimNumber(
                      ethers.utils.formatEther(vaultBalanceInfo.totalBalance),
                      6
                    )
                  : null}{" "}
                {nativeGas}
              </div>
            </div>
            <div className="w-full">
              <button
                className="border-[1px] border-black shadow-db pt-1 font-fancy bg-db-cyan-process h-10 w-full rounded-lg text-lg text-white hover:bg-db-blue-200"
                onClick={depositWrite}
              >
                Mint
              </button>
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
              {previewMintAmount}
            </div>
            <div className="w-full text-center flex justify-center gap-1 text-sm">
              {instrumentLabel(currentInstrument, false)}{" "}
              <span className="font-bold">{currentVaultName}</span>
            </div>
          </div>

          {/* Right */}
          <div className="w-1/2 flex flex-col gap-3">
            <div className="flex gap-2 items-center">
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
            <div className="flex justify-between w-full items-center">
              <div className="flex-1 shadow-db w-36 text-center font-bold bg-db-background p-3 border-[1px] border-black rounded-lg">
                Vault Performance
              </div>
              <div className="flex-1 text-center text-lime-500 font-bold">
                69% APR
              </div>
            </div>
            <div className="w-full">
              <button
                className="border-[1px] border-black shadow-db bg-db-cyan-process h-10 w-full rounded-lg text-lg text-white hover:bg-db-blue-200"
                onClick={withdrawWrite}
              >
                <div className="flex gap-2 items-center justify-center">
                  <div className="pt-1 font-fancy">
                    {queuedAmount > 0 && burnAmount > 0
                      ? `Claim queued\xa0 & \xa0burn`
                      : queuedAmount > 0
                      ? `Claim queued`
                      : `Burn`}
                  </div>
                  <div className="text-sm">
                    {queuedAmount} {nativeGas}{" "}
                    {console.log(
                      "epochEndTime >= Date.now()",
                      epochEndTime,
                      Date.now(),
                      epochEndTime >= Date.now()
                    )}{" "}
                    ({epochEndTime >= Date.now() ? "queued for " : "claim now"}
                    <CountdownFormatted ms={epochEndTime} />)
                  </div>
                </div>
              </button>
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
              {previewBurnAmount}
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
