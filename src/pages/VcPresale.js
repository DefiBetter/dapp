import {
  useNetwork,
  useContractRead,
  useAccount,
  useContractWrite,
} from "wagmi";
import { useState } from "react";

import DutchAuctionABI from "../static/ABI/DutchAuctionABI.json";
import IERC20MetadataABI from "../static/ABI/IERC20MetadataABI.json";
import { contractAddresses } from "../static/contractAddresses";
import { ethers } from "ethers";

import { CountdownFormatted, trimNumber } from "../components/common/helper";
import useWethPrice from "../hooks/useWethPrice";
import { ToastStatus, useToast } from "../context/ToastContext";
import { BsCoin, BsWallet2 } from "react-icons/bs";
import { GiSandsOfTime, GiCoins } from "react-icons/gi";
import useBalanceOf from "../hooks/useBalanceOf";
import DBButton from "../components/common/DBButton";
import AddToWallet from "../components/common/AddToWallet";
import PageTitle from "../components/common/PageTitle";

function VcPresale() {
  const { address: connectedAddress } = useAccount();
  const { chain } = useNetwork();

  const vcPresaleContractConfig = {
    address: contractAddresses[chain?.network]?.vcPresale,
    abi: DutchAuctionABI,
  };

  const [paymentToken, setPaymentToken] = useState("");
  const [rewardToken, setRewardToken] = useState("");
  const [allowance, setAllowance] = useState(ethers.BigNumber.from("0"));

  const [buyAmount, setBuyAmount] = useState("0");

  const [supplyLeft, setSupplyLeft] = useState("0");

  const [estimateOutput, setEstimateOutput] = useState("0");

  // public sale duration
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [currentPrice, setCurrentPrice] = useState(0);

  const wethPrice = useWethPrice();

  const toastContext = useToast();

  // current price
  useContractRead({
    ...vcPresaleContractConfig,
    functionName: "estimateOutput",
    args: [ethers.utils.parseEther("1")], // input in WETH
    onError(data) {},
    onSuccess(data) {
      console.log("estimate", ethers.utils.formatEther(data));
      setCurrentPrice((1 / +ethers.utils.formatEther(data)).toFixed(9));
    },
  });

  useContractRead({
    ...vcPresaleContractConfig,
    functionName: "startTime",
    onSuccess(data) {
      setStartTime(+data);
    },
  });

  useContractRead({
    ...vcPresaleContractConfig,
    functionName: "duration",
    onSuccess(data) {
      setDuration(+data);
    },
  });

  // get payment token
  useContractRead({
    ...vcPresaleContractConfig,
    functionName: "paymentToken",
    onSuccess(data) {
      setPaymentToken(data);
    },
  });

  // get reward token
  useContractRead({
    ...vcPresaleContractConfig,
    functionName: "rewardToken",
    onSuccess(data) {
      setRewardToken(data);
    },
  });

  // approve
  console.log(
    "vcPresaleContractConfig.address = " + vcPresaleContractConfig.address
  );
  const { write: approvePaymentTokenWrite } = useContractWrite({
    address: paymentToken,
    abi: IERC20MetadataABI,
    mode: "recklesslyUnprepared",
    functionName: "approve",
    args: [
      vcPresaleContractConfig.address,
      ethers.constants.MaxUint256.sub("1"),
    ],
    onError(error) {
      console.error(error);
      toastContext.addToast(ToastStatus.Failed, "Failed to approve", null);
    },
    onSuccess() {
      toastContext.addToast(ToastStatus.Success, "Successfuly approved", null);
    },
  });

  // get allowance
  useContractRead({
    address: paymentToken,
    abi: IERC20MetadataABI,
    functionName: "allowance",
    args: [connectedAddress, vcPresaleContractConfig.address],
    onSuccess(data) {
      setAllowance(data);
    },
    watch: true,
  });

  // buy into public sale
  const { write: buyWrite } = useContractWrite({
    ...vcPresaleContractConfig,
    mode: "recklesslyUnprepared",
    functionName: "buy",
    args: [buyAmount],
    onError(error) {
      console.error(error);
      toastContext.addToast(ToastStatus.Failed, "Failed to buy", null);
    },
    onSuccess() {
      toastContext.addToast(ToastStatus.Success, "Successfuly bought", null);
    },
  });

  // supply left
  useContractRead({
    address: rewardToken,
    abi: IERC20MetadataABI,
    functionName: "balanceOf",
    args: [vcPresaleContractConfig.address],
    onSuccess(data) {
      setSupplyLeft(ethers.utils.formatEther(data));
    },
    watch: true,
  });

  // get estimate reward
  useContractRead({
    ...vcPresaleContractConfig,
    functionName: "estimateOutput",
    args: [buyAmount], // in WETH
    onError(data) {},
    onSuccess(data) {
      setEstimateOutput(ethers.utils.formatEther(data));
    },
  });

  const userWethBalance = useBalanceOf(contractAddresses[chain?.network]?.WETH);

  return (
    <div className="relative bg-db-light dark:bg-db-dark-nav transition-colors rounded-md p-2 md:p-4 min-h-[86vh]">
      <PageTitle title={"VC Pre"} fancyTitle={"Sale"} />

      <div className="mt-4 flex justify-center">
        <div className="z-10 w-full md:w-3/4 p-4 rounded-lg dark:shadow-inner shadow-sm shadow-db-cyan-process dark:shadow-black bg-white dark:bg-db-dark flex gap-4 flex-col justify-between">
          <div className="w-full flex flex-wrap justify-between gap-2">
            <div className="h-14 flex flex-col w-full md:w-[49%] lg:w-[24%] items-center p-2 bg-white dark:bg-db-dark-lighter justify-center shadow-sm shadow-db-cyan-process dark:shadow-black rounded-lg">
              <div className="flex items-center gap-2">
                <BsWallet2 size={20} />
                <div>Balance</div>
              </div>
              <div className="font-bold">{userWethBalance} wETH</div>
            </div>
            <div className="h-14 flex flex-col w-full md:w-[49%] lg:w-[24%] items-center p-2 bg-white dark:bg-db-dark-lighter justify-center shadow-sm shadow-db-cyan-process dark:shadow-black rounded-lg">
              <div className="flex items-center gap-2">
                <BsCoin size={20} />
                <div>Current Price</div>
              </div>
              <div className="font-bold">
                {trimNumber(currentPrice, 4, "dp")} wETH{" "}
                <span className="text-xs">
                  (≈$
                  {trimNumber(currentPrice * wethPrice, 4, "dp")})
                </span>
              </div>
            </div>
            <div className="h-14 flex flex-col w-full md:w-[49%] lg:w-[24%] items-center p-2 bg-white dark:bg-db-dark-lighter justify-center shadow-sm shadow-db-cyan-process dark:shadow-black rounded-lg">
              <div className="flex items-center gap-2">
                <GiCoins size={20} />
                <div>Supply left</div>
              </div>
              <div className="font-bold">
                {trimNumber(+supplyLeft, 4, "dp")}
              </div>
            </div>
            <div className="h-14 flex flex-col w-full md:w-[49%] lg:w-[24%] items-center p-2 bg-white dark:bg-db-dark-lighter justify-center shadow-sm shadow-db-cyan-process dark:shadow-black rounded-lg">
              <div className="flex items-center gap-2">
                <GiSandsOfTime size={20} />
                <div>Time Left</div>
              </div>
              <div className="font-bold">
                <CountdownFormatted ms={(startTime + duration) * 1000} />
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center w-full">
            <div className="w-full gap-2 flex">
              <div className="w-32 flex justify-center items-center">
                <span className="font-fancy text-xl pt-2">Spend</span>
              </div>
              <div className="h-14 w-full shadow-inner shadow-db-cyan-process dark:shadow-black bg-white dark:bg-db-dark-lighter rounded-lg flex items-center px-4">
                <div
                  onClick={() => {
                    setBuyAmount(userWethBalance.toString());
                  }}
                  className="cursor-pointer rounded-md flex gap-2 justify-center items-center h-9 pb-0.5 px-3 border-[1px] border-db-cyan-process text-db-cyan-process hover:bg-db-cyan-process hover:text-white transition-colors"
                  >
                  MAX
                </div>
                <input
                  value={Number(buyAmount) !== 0 ? buyAmount : ""}
                  onChange={(e) => {
                    const val = e.target.value || "0";
                    setBuyAmount(val);
                  }}
                  type={"number"}
                  min={0}
                  className="px-4 text-center h-10 w-full focus:ring-0 focus:outline-none rounded-lg bg-white dark:bg-db-dark-lighter"
                  placeholder="wETH amount"
                />
                <div className="">wETH</div>
              </div>
            </div>
            <div className="mt-4 flex justify-center w-full">
              <div className="w-full gap-2 flex">
                <div className="w-32 flex justify-center items-center">
                  <span className="font-fancy text-xl pt-2">to get</span>
                </div>

                <div className="h-14 w-full shadow-sm shadow-db-cyan-process dark:shadow-black bg-db-light dark:bg-db-dark-nav rounded-lg flex items-center px-4">
                  <input
                    disabled
                    className="pl-24 px-4 text-center h-10 w-full rounded-lg bg-db-light dark:bg-db-dark-nav"
                    placeholder="Enter Amount"
                    value={trimNumber(estimateOutput, 9, "dp")}
                  />
                  <div className="">BETR</div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex gap-4 items-center flex-col md:flex-row justify-center">
              <div className="w-full md:w-2/3">
                {ethers.BigNumber.from(allowance.toString()).lte(
                  ethers.BigNumber.from("0")
                ) ? (
                  <DBButton onClick={approvePaymentTokenWrite}>
                    Approve
                  </DBButton>
                ) : (
                  <DBButton onClick={buyWrite}>Buy</DBButton>
                )}
              </div>
              <div className="w-full md:w-1/3">
                <AddToWallet asset="BETR" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="z-0 absolute h-60 bottom-10 left-8">
        <img
          alt="faucet"
          className="h-full z-0"
          src={require("../static/image/open-vault-clipart.svg").default}
        ></img>
      </div>
    </div>
  );
}

export default VcPresale;
