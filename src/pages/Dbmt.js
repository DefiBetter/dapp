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
import { MdDoubleArrow } from "react-icons/md";
import { CgArrowLongRight } from "react-icons/cg";

export default function Dbmt() {
  const toasts = useToast();

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

  const toastContext = useToast();

  return (
    <>
      <div className="z-50 fixed left-0 bottom-0 w-full bg-gradient-to-r from-red-400 to-orange-500 flex justify-center items-center">
        <div className="absolute left-2 lg:left-44">
          <MdDoubleArrow size={30} className="text-white animate-slide-right" />
        </div>
        <div className="absolute right-2 lg:right-44 rotate-180">
          <MdDoubleArrow size={30} className="text-white animate-slide-right" />
        </div>
        <div className="p-2 w-full text-white text-2xl flex justify-center gap-2 md:gap-10 flex-col sm:flex-row items-center">
          <div>
            <span className="font-bold">$DBMT</span> Price increases in
          </div>
          <div className="font-bold text-3xl ">
            <CountdownFormatted ms={Date.now() + 999999999} />
          </div>
        </div>
      </div>

      <div className="relative bg-db-background border-[3px] border-db-cyan-process mb-24 md:mb-14 lg:mb-14">
        <div className="pb-5 px-4">
          <div className="relative shadow-db m-auto w-full md:w-1/2 mt-5 bg-white border-2 border-db-cyan-process rounded-2xl p-4">
            <div className="flex justify-center text-5xl">
              $DBMT
              <span className="font-bold mt-7 font-fancy text-5xl text-db-cyan-process">
                Sale 💦
              </span>
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-5 md:flex-row m-auto w-full mt-5 p-4 bg-white border-2 border-db-cyan-process shadow-db rounded-2xl">
            <div className="p-2 bg-white w-full md:w-1/2">
              <h2 className="font-bold text-xl">
                DeFiBetter Milestone Reward Program
              </h2>
              <div className="flex-col mt-3 ml-3">
                <div className="flex items-start gap-4">
                  <span>💦</span>
                  $DBMT is the first and possibly the most lucrative way to
                  profit from DeFiBetter's growth.
                </div>
                <div className="flex items-start gap-4">
                  <span>💦</span> The higher our cumulative volume gets over
                  time, the more valuable your $DBMT becomes.
                </div>
                <div className="flex items-start gap-4">
                  <span>💦</span> Burn your DBMT for a sizeable early reward or
                  hold it, keep drawing attention to the protocol and watch your
                  wealth grow exponentially!
                </div>
                <div className="flex items-start gap-4">
                  <span>💦</span> The more people decide to burn, the higher the
                  rewards for HODLers.
                </div>
                <div className="flex items-start gap-4">
                  <span>💦</span> Secure an exclusive role in our Discord server
                  for $DMBT holders, discuss ideas and strategies & get access
                  to alpha earlier than everyone else.
                </div>
              </div>
              <div className='mt-3'>
                Read more about how $DBMT works on our Medium page:{" "}
                <a
                  href="https://medium.com/@defibetter"
                  target="_blank"
                  rel="noreferrer"
                  className="text-db-cyan-process"
                >
                  https://medium.com/@defibetter
                </a>
              </div>
            </div>
            <div className="w-full md:w-2/3 bg-white border-2 border-db-cyan-process rounded-2xl shadow-db ">
              <div className="rounded-t-xl w-full bg-db-cyan-process pb-2">
                <div className="flex justify-center items-center gap-5 ">
                  <div className="text-2xl font-bold text-white relative pt-2">
                    1 WETH
                    <div className="absolute bottom-[30%] -left-[5%] w-[110%] h-1 bg-gradient-to-r from-red-400 to-orange-500"></div>
                  </div>
                  <div className="pt-2">
                    <CgArrowLongRight size={40} className="text-white" />
                  </div>
                  <div className="font-bold text-transparent text-4xl bg-clip-text bg-gradient-to-b from-yellow-100 to-yellow-300">
                    0.5 WETH
                  </div>
                </div>
                <div className="text-center text-xs italic text-white">
                  Limited time offer only
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-2">
                  <div className="flex justify-between w-full items-center">
                    <div className="flex-1 shadow-db text-center font-bold bg-db-french-sky p-3 border-[1px] border-black rounded-lg">
                      Time Left
                    </div>
                    <div className="flex-1 text-center">
                      <CountdownFormatted ms={(startTime + duration) * 1000} />
                    </div>
                  </div>

                  <div className="flex justify-between w-full items-center">
                    <div className="flex-1 shadow-db text-center font-bold bg-db-french-sky p-3 border-[1px] border-black rounded-lg">
                      Supply Left
                    </div>
                    <div className="flex-1 text-center">
                      {trimNumber(+supplyLeft, 4, "dp")}
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center w-full">
                  <div className="font-fancy text-db-cyan-process w-24 text-center text-xl pt-1">
                    buy
                  </div>
                  <div className="w-full flex items-center p-2 justify-center bg-db-background rounded-lg shadow-db">
                    <div className="text-black text-sm flex-1 text-center">
                      {trimNumber(estimateOutput, 9, "dp")}
                    </div>

                    <div className="text-black font-bold w-12 text-center">
                      BT
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center w-full">
                  <div className="font-fancy text-db-cyan-process w-24 text-center text-xl pt-1">
                    for
                  </div>
                  <div className="w-full flex items-center p-2 justify-center bg-db-background rounded-lg shadow-db">
                    <input
                      onChange={(e) => {
                        const val = e.target.value || 0;
                        setBuyAmount(ethers.utils.parseEther(val.toString()));
                        console.log(
                          "val",
                          ethers.utils.parseEther(val.toString())
                        );
                      }}
                      type={"number"}
                      min={0}
                      placeholder="Amount"
                      className="text-black text-sm flex-1"
                    />
                    <div className="text-black font-bold w-12 text-center">
                      WETH
                    </div>
                  </div>
                </div>
                {ethers.BigNumber.from(allowance.toString()).lte(
                  ethers.BigNumber.from("0")
                ) ? (
                  <button
                    onClick={approvePaymentTokenWrite}
                    className="mt-4 border-[1px] border-black shadow-db pt-1 font-fancy bg-db-cyan-process h-10 w-full rounded-lg text-lg text-white hover:bg-db-blue-200"
                  >
                    Approve
                  </button>
                ) : (
                  <button
                    onClick={buyWrite}
                    className="mt-4 border-[1px] border-black shadow-db pt-1 font-fancy bg-db-cyan-process h-10 w-full rounded-lg text-lg text-white hover:bg-db-blue-200"
                  >
                    Buy
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="z-0 absolute h-60 top-10 left-[2%] hidden md:block">
          <img
            alt="faucet"
            className="h-full z-0"
            src={require("../static/image/open-vault-clipart.svg").default}
          ></img>
        </div>
      </div>
    </>
  );
}
