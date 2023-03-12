import {
  useContractRead,
  useContractWrite,
  useAccount,
  useNetwork,
} from "wagmi";
import { useState } from "react";

import IERC20MetadataABI from "../static/ABI/IERC20MetadataABI.json";
import { contractAddresses } from "../static/contractAddresses";
import { ethers } from "ethers";

import BtPresaleABI from "../static/ABI/BtPresaleABI.json";
import { CountdownFormatted, trimNumber } from "../components/common/helper";
import useWethPrice from "../hooks/useWethPrice";
import { ToastStatus, useToast } from "../context/ToastContext";
import AddToWallet from "../components/common/AddToWallet";
import DBButton from "../components/common/DBButton";
import useBalanceOf from "../hooks/useBalanceOf";
import { BsCoin, BsWallet2 } from "react-icons/bs";
import { GiSandsOfTime, GiCoins } from "react-icons/gi";

export default function CommunityPresale() {
  const { address: connectedAddress } = useAccount();
  const { chain } = useNetwork();

  const communityPresaleContractConfig = {
    address: contractAddresses[chain?.network]?.communityPresale,
    abi: BtPresaleABI,
  };

  const [paymentToken, setPaymentToken] = useState("");
  const [rewardToken, setRewardToken] = useState("");
  const [allowance, setAllowance] = useState(ethers.BigNumber.from("0"));

  const [amountOut, setAmountOut] = useState("0"); // in WETH
  const [buyAmount, setBuyAmount] = useState("0"); // in BT

  const [supplyLeft, setSupplyLeft] = useState("0");

  // public sale duration
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [currentPrice, setCurrentPrice] = useState(0);

  const wethPrice = useWethPrice();

  const toastContext = useToast();

  // current price
  useContractRead({
    ...communityPresaleContractConfig,
    functionName: "getOutputAmount",
    args: [ethers.utils.parseEther("1")], // input in WETH
    onError(data) {},
    onSuccess(data) {
      setCurrentPrice((+ethers.utils.formatEther(data)).toFixed(9));
    },
  });

  useContractRead({
    ...communityPresaleContractConfig,
    functionName: "START_TIME",
    onSuccess(data) {
      setStartTime(+data);
    },
  });

  useContractRead({
    ...communityPresaleContractConfig,
    functionName: "DURATION",
    onSuccess(data) {
      setDuration(+data);
    },
  });

  // get payment token
  useContractRead({
    ...communityPresaleContractConfig,
    functionName: "PAYMENT_TOKEN",
    onSuccess(data) {
      setPaymentToken(data);
    },
  });

  // get reward token
  useContractRead({
    ...communityPresaleContractConfig,
    functionName: "BUYABLE_TOKEN",
    onSuccess(data) {
      setRewardToken(data);
    },
  });

  // approve
  const { write: approvePaymentTokenWrite } = useContractWrite({
    address: paymentToken,
    abi: IERC20MetadataABI,
    mode: "recklesslyUnprepared",
    functionName: "approve",
    args: [
      communityPresaleContractConfig.address,
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
    args: [connectedAddress, communityPresaleContractConfig.address],
    onSuccess(data) {
      setAllowance(data);
    },
    watch: true,
  });

  // buy into public sale
  const { write: buyWrite } = useContractWrite({
    ...communityPresaleContractConfig,
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
    args: [communityPresaleContractConfig.address],
    onSuccess(data) {
      setSupplyLeft(ethers.utils.formatEther(data));
    },
    watch: true,
  });

  useContractRead({
    ...communityPresaleContractConfig,
    functionName: "getOutputAmount",
    args: [buyAmount], // in WETH
    onError(data) {},
    onSuccess(data) {
      setAmountOut(+ethers.utils.formatEther(data));
    },
  });

  const userWethBalance = useBalanceOf(contractAddresses[chain?.network]?.WETH);

  return (
    <div className="relative bg-db-light dark:bg-db-dark-nav transition-colors rounded-md p-2 md:p-4 h-[81vh]">
      <div className="z-10 text-4xl flex justify-center">
        <div className="w-full md:w-3/4 bg-white dark:bg-db-dark p-4 rounded-lg flex justify-center gap-1 shadow-sm shadow-db-cyan-process">
          <div className="flex justify-center text-5xl">
            Community
            <span className="font-bold mt-7 font-fancy text-5xl text-db-cyan-process">
              Sale 💦
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex justify-center">
        <div className="z-10 w-full md:w-3/4 p-4 rounded-lg shadow-sm shadow-db-cyan-process bg-white dark:bg-db-dark flex gap-4 flex-col justify-between">
          <div className="w-full flex flex-wrap justify-between gap-4">
            <div className="h-14 flex flex-col w-full flex-1 items-center p-2 bg-white dark:bg-db-dark justify-center shadow-sm shadow-db-cyan-process rounded-lg">
              <div className="flex items-center gap-2">
                <BsWallet2 size={20} />
                <div>Balance</div>
              </div>
              <div className="font-bold">{userWethBalance} wETH</div>
            </div>
            <div className="h-14 flex flex-col w-full flex-1 items-center p-2 bg-white dark:bg-db-dark justify-center shadow-sm shadow-db-cyan-process rounded-lg">
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
            <div className="h-14 flex flex-col w-full flex-1 items-center p-2 bg-white dark:bg-db-dark justify-center shadow-sm shadow-db-cyan-process rounded-lg">
              <div className="flex items-center gap-2">
                <GiCoins size={20} />
                <div>Supply left</div>
              </div>
              <div className="font-bold">
                {trimNumber(+supplyLeft, 4, "dp")}
              </div>
            </div>
            <div className="h-14 flex flex-col w-full flex-1 items-center p-2 bg-white dark:bg-db-dark justify-center shadow-sm shadow-db-cyan-process rounded-lg">
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
              <div className="h-14 w-full shadow-inner shadow-db-cyan-process bg-white dark:bg-db-dark rounded-lg flex items-center px-4">
                <div
                  onClick={() => {
                    setBuyAmount(userWethBalance.toString());
                  }}
                  className="cursor-pointer rounded-md flex gap-2 justify-center items-center h-9 pb-0.5 px-3 border-[1px] border-db-cyan-process text-db-cyan-process hover:bg-db-cyan-process hover:text-white transition-colors shadow-sm shadow-db-cyan-process hover:shadow-white"
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
                  className="px-4 text-center h-10 w-full focus:ring-0 focus:outline-none rounded-lg bg-white dark:bg-db-dark"
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

                <div className="h-14 w-full shadow-sm shadow-db-cyan-process bg-db-light dark:bg-db-dark-nav rounded-lg flex items-center px-4">
                  <input
                    disabled
                    className="pl-24 px-4 text-center h-10 w-full rounded-lg bg-db-light dark:bg-db-dark-nav"
                    placeholder="Enter Amount"
                    value={trimNumber(amountOut, 9, "dp")}
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
