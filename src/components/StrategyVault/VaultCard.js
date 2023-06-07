import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { contractAddresses } from "../../static/contractAddresses";
import Dropdown from "../common/Dropdown";
import Loader from "../common/Loader";
import { BsBank, BsWallet2, BsPiggyBank, BsClock } from "react-icons/bs";
import { GiCoins } from "react-icons/gi";
import { instrumentToLabel, trimNumber } from "../common/helper";
import AddToWallet from "../../components/common/AddToWallet";

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
import useSharePrice from "../../hooks/useSharePrice";
import useVaultName from "../../hooks/useVaultName";
import DBButton from "../common/DBButton";
import Countdown from "react-countdown";
import { InputNumber } from "../common/Input";

const VaultCard = () => {
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
  // vault
  const [currentVault, setCurrentVault] = useState();
  // input amounts
  const [mintAmount, setMintAmount] = useState(0);
  const [burnAmount, setBurnAmount] = useState(0);
  const [mintOrBurn, setMintOrBurn] = useState("mint");
  const [currentBinWeights, setCurrentBinWeights] = useState([]);

  function binDataToBinObj(binData) {
    const maxWeight = Math.max.apply(Math, binData);
    const tmpBins = [];
    binData.map((weight) =>
      tmpBins.push({
        weight: weight / 100,
        height: (weight * 100) / maxWeight,
        brightness: 0.2 + weight / maxWeight,
      })
    );
    return tmpBins;
  }

  const binWeights = currentInstrument
    ? [
        binDataToBinObj(currentInstrument.relativeBinWeights.slice(0, 7)),
        binDataToBinObj(currentInstrument.relativeBinWeights.slice(7, 14)),
        binDataToBinObj(currentInstrument.relativeBinWeights.slice(14, 21)),
        binDataToBinObj(currentInstrument.relativeBinWeights.slice(21, 28)),
      ]
    : [];

  const { chain: activeChain } = useNetwork();

  useEffect(() => {
    if (binWeights) {
      const vaultIndex = vaultList?.indexOf(currentVault);
      let tmpArray;
      if (vaultIndex === 0 || vaultIndex === 6) {
        tmpArray = binWeights[0];
      } else if (vaultIndex === 1 || vaultIndex === 5) {
        tmpArray = binWeights[1];
      } else if (vaultIndex === 2 || vaultIndex === 4) {
        tmpArray = binWeights[2];
      } else if (vaultIndex === 3) {
        tmpArray = binWeights[3];
      }
      setCurrentBinWeights(vaultIndex <= 3 ? tmpArray : tmpArray.reverse());
    }
  }, [currentVault]);

  const instrumentList = useInstruments((data) => {
    // Success callback function
    setCurrentInstrument(data[0]);
  });

  const vaultList = useVaults(currentInstrument?.vaultManager, (data) => {
    // Success callback function
    setCurrentVault(data[3]);
  });

  const userGasBalance = useNativeBalance();
  const userVaultBalance = useBalanceOf(currentVault);

  const vaultBalanceInfo = useVaultBalanceInfo(currentVault);
  const previewMintAmount = usePreviewMintAmount(currentVault, mintAmount);
  const previewBurnAmount = usePreviewBurnAmount(
    currentVault,
    burnAmount,
    false
  );
  const previewClaim = usePreviewBurnAmount(currentVault, 0);
  const currentVaultName = useVaultName(currentVault);
  const sharePrice = useSharePrice(currentVault);

  // mint strategy vault token
  const depositWrite = useVaultDeposit(currentVault, mintAmount, () => {
    // Success callback function
    setMintAmount(0);
  });

  const withdrawWrite = useVaultWithdraw(
    currentVault,
    burnAmount,
    false,
    () => {
      setBurnAmount(0);
    }
  );

  const claimWrite = useVaultWithdraw(currentVault, 0, true, () => {
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
        <div className="mt-10 md:mt-2 flex gap-5 flex-col">
          <div className="flex gap-5 flex-col justify-center items-center md:flex-row">
            <div className="">
              <img
                className="h-10 w-10"
                alt="binance"
                src={require("../../static/image/bnbchain-logo.png")}
              />
            </div>
            <Dropdown
              currentItemLabel={instrumentToLabel(currentInstrument)}
              currentItem={currentInstrument}
              setCurrentItem={setCurrentInstrument}
              itemList={instrumentList}
              itemLabelList={instrumentList?.map((instrument) =>
                instrumentToLabel(instrument)
              )}
            />
            <Dropdown
              currentItem={currentVault}
              currentItemLabel={strategyRef[vaultList?.indexOf(currentVault)]}
              setCurrentItem={setCurrentVault}
              itemList={vaultList}
              itemLabelList={strategyRef}
            />
            <div className="p-3 border-[1px] border-db-cyan-process rounded-full w-8 h-8 flex justify-center items-center group relative">
              i
              <div className="absolute top-8 w-60 bg-db-background dark:bg-db-dark-input z-50 left-0 scale-0 group-hover:scale-100 transition-transform p-2 rounded-lg">
                Automatically distribute your funds around the bin you select,
                with most being in the selected bin and less per bin the further
                it's away.
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 w-full">
            <div className="w-full flex-1 h-48 flex flex-col">
              <div className="relative m-auto flex items-center justify-center w-full h-14 rounded-xl bg-db-light dark:bg-db-dark-input p-2">
                <div
                  className={`w-[48%] top-2 absolute ${
                    mintOrBurn === "mint" ? "left-2" : "left-1/2"
                  } transition-all z-0 bg-db-cyan-process dark:bg-db-blue-gray rounded-lg h-10 flex-1 flex justify-center items-center`}
                />
                <div
                  onClick={() => {
                    setMintAmount(0);
                    setBurnAmount(0);
                    setMintOrBurn("mint");
                  }}
                  className="z-10 h-full w-full leading-10 cursor-pointer text-center"
                >
                  Mint
                </div>
                <div
                  onClick={() => {
                    setMintAmount(0);
                    setBurnAmount(0);
                    setMintOrBurn("burn");
                  }}
                  className="z-10 h-full w-full leading-10 cursor-pointer text-center"
                >
                  Burn
                </div>
              </div>

              <div className="mt-4 flex items-stretch justify-between h-full flex-col">
                <div className="flex flex-row w-full items-center justify-between">
                  <div className="flex items-center gap-2 text-db-blue-gray">
                    <BsBank size={20} />
                    <div>Vault Balance</div>
                  </div>
                  <div className="font-bold">
                    {vaultBalanceInfo
                      ? trimNumber(
                          ethers.utils.formatEther(
                            vaultBalanceInfo.totalBalance
                          ),
                          4,
                          "dp"
                        )
                      : null}{" "}
                    {nativeGas}
                  </div>
                </div>
                <div className="flex flex-row w-full items-center justify-between">
                  <div className="flex items-center gap-2 text-db-blue-gray">
                    <BsClock size={20} />
                    <div>Next Epoch in</div>
                  </div>
                  <div className="font-bold">
                    {currentInstrument && (
                      <Countdown
                        key={
                          (currentInstrument.lastEpochClosingTime +
                            +currentInstrument.epochDurationInSeconds +
                            +currentInstrument.bufferDurationInSeconds) *
                          1000
                        }
                        date={
                          (+currentInstrument.lastEpochClosingTime +
                            +currentInstrument.epochDurationInSeconds +
                            +currentInstrument.bufferDurationInSeconds) *
                          1000
                        }
                      />
                    )}
                  </div>
                </div>

                <div className="flex flex-row w-full items-center justify-between">
                  <div className="flex items-center gap-2 text-db-blue-gray">
                    {mintOrBurn === "mint" ? (
                      <BsWallet2 size={20} />
                    ) : (
                      <BsPiggyBank size={20} />
                    )}

                    <div>
                      {mintOrBurn === "mint"
                        ? "Your Wallet Balance"
                        : "Your Vault Balance"}
                    </div>
                  </div>
                  <div className="font-bold text-right">
                    {mintOrBurn === "mint"
                      ? `${Number(userGasBalance).toFixed(3)} ${nativeGas}`
                      : `${Number(userVaultBalance).toFixed(
                          3
                        )} ${currentVaultName}`}
                  </div>
                </div>

                <div className="flex flex-row w-full items-center justify-between">
                  <div className="flex items-center gap-2 text-db-blue-gray">
                    <GiCoins size={20} />
                    <div>Share Value</div>
                  </div>
                  <div className="font-bold">
                    {trimNumber(sharePrice, 4, "dp")} {nativeGas}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full flex-1">
              <div className="h-48 w-full flex flex-col gap-1 bg-db-light dark:bg-db-dark-nav rounded-lg p-2">
                <div className="w-full text-xs text-right">
                  {strategyRef[vaultList?.indexOf(currentVault)]} vault relative
                  capital allocation
                </div>
                <div className="w-full h-full flex gap-2 justify-evenly items-end">
                  {currentBinWeights &&
                    currentBinWeights.map((item, index) => (
                      <div
                        key={index}
                        title={`${item.weight}%`}
                        className="h-full w-full flex items-end justify-center"
                      >
                        <div
                          style={{
                            height: `${item.height}%`,
                            filter: `brightness(${item.brightness})`,
                          }}
                          className={`w-4 bg-db-cyan-process`}
                        ></div>
                      </div>
                    ))}
                </div>
                <div className="w-full flex gap-2 justify-evenly items-end">
                  <div className="w-full text-center text-xs">Bear3</div>
                  <div className="w-full text-center text-xs">Bear2</div>
                  <div className="w-full text-center text-xs">Bear1</div>
                  <div className="w-full text-center text-xs">Neutral</div>
                  <div className="w-full text-center text-xs">Bull1</div>
                  <div className="w-full text-center text-xs">Bull2</div>
                  <div className="w-full text-center text-xs">Bull3</div>
                </div>
              </div>
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
                <InputNumber
                  min={0}
                  max={
                    mintOrBurn === "mint" ? Number(userGasBalance) - 0.0001 : 0
                  }
                  placeholder={`${
                    mintOrBurn === "mint" ? nativeGas : currentVaultName
                  } amount`}
                  value={
                    mintOrBurn === "mint"
                      ? mintAmount > 0
                        ? mintAmount
                        : ""
                      : burnAmount > 0
                      ? burnAmount
                      : ""
                  }
                  symbol={mintOrBurn === "mint" ? nativeGas : currentVaultName}
                  onMax={() => {
                    if (mintOrBurn === "mint") {
                      setMintAmount(
                        (Number(userGasBalance) - 0.0001).toString()
                      );
                    } else {
                      setBurnAmount(userVaultBalance.toString());
                    }
                  }}
                  onChange={
                    mintOrBurn === "mint" ? handleMintAmount : handleBurnAmount
                  }
                />
              </div>
            </div>

            <div className="w-full gap-2 flex">
              <div className="w-16 md:w-20 flex justify-center items-center">
                <span className="">
                  {mintOrBurn === "mint" ? "Mint" : "Get"}
                </span>
              </div>
              <div className="flex items-center w-full">
                <div className="h-14 w-full bg-white dark:bg-db-dark-nav rounded-lg flex gap-4 items-center px-4">
                  <div
                    className={`${
                      mintOrBurn === "mint"
                        ? "md:text-center md:pl-26"
                        : "md:text-center md:pl-12"
                    } text-left px-0 md:px-4 w-full text-xl`}
                  >
                    {mintOrBurn === "mint"
                      ? trimNumber(previewMintAmount, 4, "dp")
                      : burnAmount > 0
                      ? trimNumber(previewBurnAmount, 4, "dp")
                      : 0}
                  </div>
                  <div className="w-32 text-right flex-shrink-0">
                    {mintOrBurn === "mint" ? currentVaultName : nativeGas}
                  </div>
                </div>
              </div>
            </div>

            <div className="">
              {mintOrBurn === "mint" ? (
                <div className="w-full flex gap-4">
                  <div className="w-full">
                    <DBButton
                      disabled={!depositWrite.transaction.write}
                      onClick={() => {
                        if (depositWrite.transaction.write) {
                          depositWrite.transaction.write();
                        }
                      }}
                    >
                      {depositWrite.confirmation.isLoading ? (
                        <Loader text="Minting" />
                      ) : (
                        "Mint"
                      )}
                    </DBButton>
                  </div>
                  <div className="">
                    <AddToWallet
                      symbol={currentVaultName}
                      address={currentVault}
                      decimals={18}
                    />
                  </div>
                </div>
              ) : (
                <div className="w-full flex-col lg:flex-row flex gap-4">
                  <div className="grow">
                    <DBButton
                      disabled={
                        !withdrawWrite.transaction.write ||
                        Number(burnAmount) === 0
                      }
                      onClick={() => {
                        if (withdrawWrite.transaction.write) {
                          withdrawWrite.transaction.write();
                        }
                      }}
                    >
                      <div className="flex gap-2 items-center justify-center">
                        <div className="">
                          {withdrawWrite.confirmation.isLoading ? (
                            <Loader text="Burning" />
                          ) : (
                            <span>Burn and queue</span>
                          )}
                        </div>
                      </div>
                    </DBButton>
                  </div>
                  <div className="grow">
                    <DBButton
                      disabled={
                        !claimWrite.transaction.write ||
                        Number(previewClaim) === 0
                      }
                      onClick={() => {
                        if (claimWrite.transaction.write) {
                          claimWrite.transaction.write();
                        }
                      }}
                    >
                      <div className="flex gap-2 items-center justify-center">
                        <div className="">
                          {claimWrite.confirmation.isLoading ? (
                            <Loader text="Claiming" />
                          ) : (
                            "Claim"
                          )}
                        </div>
                        {previewClaim > 0 && (
                          <div className="font-sans text-sm leading-none">
                            {trimNumber(previewClaim, 4, "dp")} {nativeGas}
                          </div>
                        )}
                      </div>
                    </DBButton>
                  </div>
                  <div className="shrink-0">
                    <AddToWallet
                      symbol={currentVaultName}
                      address={currentVault}
                      decimals={18}
                      imageURL={""}
                    />
                  </div>
                </div>
              )}
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
