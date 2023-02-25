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
import { CountdownFormatted } from "../components/common/helper";

function CommunityPresale() {
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

  // current price
  useContractRead({
    ...communityPresaleContractConfig,
    functionName: "getRequiredPayment",
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
    onError(data) {
      console.log("buy error", data);
    },
    onSuccess(data) {
      console.log("bought", data);
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
  });

  // get WETH needed from
  useContractRead({
    ...communityPresaleContractConfig,
    functionName: "getRequiredPayment",
    args: [buyAmount], // in WETH
    onError(data) {},
    onSuccess(data) {
      console.log("amountOut", data);
      setAmountOut(+ethers.utils.formatEther(data));
    },
  });

  return (
    <div className="relative bg-db-background border-[3px] border-db-cyan-process p-4 h-[80vh]">
      <div className="shadow-db m-auto w-full md:w-1/2 mt-5 bg-white border-2 border-db-cyan-process rounded-2xl p-4">
        <div className="flex justify-center text-5xl">
          Pre
          <span className="font-bold mt-7 font-fancy text-5xl text-db-cyan-process">
            Sale
          </span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col shadow-db m-auto w-full md:w-1/2 mt-5 bg-white border-2 border-db-cyan-process rounded-2xl p-4">
        <div className="flex justify-center gap-10 items-center">
          <div className="shadow-db px-10 text-center bg-db-french-sky p-3 border-[1px] border-black rounded-lg">
            <span className="font-bold">Current Price</span>
          </div>
          <div>
            {currentPrice} WETH (≈${(currentPrice * 1500).toFixed(2)})
          </div>
        </div>

        <div className="mt-4 flex flex-col lg:flex-row justify-between items-center gap-2">
          <div className="flex justify-between w-full items-center">
            <div className="flex-1 shadow-db text-center font-bold bg-db-french-sky p-3 border-[1px] border-black rounded-lg">
              Time Left
            </div>
            <div className="flex-1 text-center">
              <CountdownFormatted ms={Date.now() * 2} />
            </div>
          </div>

          <div className="flex justify-between w-full items-center">
            <div className="flex-1 shadow-db text-center font-bold bg-db-french-sky p-3 border-[1px] border-black rounded-lg">
              Supply Left
            </div>
            <div className="flex-1 text-center">{supplyLeft}</div>
          </div>
        </div>
        <div className="mt-3 flex items-center w-full">
          <div className="font-fancy text-db-cyan-process w-24 text-center text-xl pt-1">
            buy
          </div>
          <div className="w-full flex items-center p-2 justify-center bg-db-background rounded-lg shadow-db">
            <input
              onChange={(e) => {
                const val = e.target.value || 0;
                setBuyAmount(ethers.utils.parseEther(val.toString()));
              }}
              type={"number"}
              min={0}
              placeholder="Amount"
              //value={props.value}
              //max={props.max}
              className="text-black text-sm flex-1"
            />

            <div className="text-black font-bold w-12 text-center">BT</div>
          </div>
        </div>
        <div className="mt-3 flex items-center w-full">
          <div className="font-fancy text-db-cyan-process w-24 text-center text-xl pt-1">
            for
          </div>
          <div className="w-full flex items-center p-2 justify-center bg-db-background rounded-lg shadow-db">
            <div className="text-black text-sm flex-1 text-center">
              {amountOut}
            </div>

            <div className="text-black font-bold w-12 text-center">WETH</div>
          </div>
        </div>
        {ethers.BigNumber.from(allowance.toString()).lte(
          ethers.BigNumber.from("0")
        ) ? (
          <button
            onClick={approvePaymentTokenWrite}
            className="mt-3 border-[1px] border-black shadow-db pt-1 font-fancy bg-db-cyan-process h-10 w-full rounded-lg text-lg text-white hover:bg-db-blue-200"
          >
            Approve
          </button>
        ) : (
          <button
            onClick={buyWrite}
            className="mt-3 border-[1px] border-black shadow-db pt-1 font-fancy bg-db-cyan-process h-10 w-full rounded-lg text-lg text-white hover:bg-db-blue-200"
          >
            Buy
          </button>
        )}
      </div>
      <div className="z-0 absolute h-60 bottom-10 left-[13%]">
        <img
          alt="faucet"
          className="h-full z-0"
          src={require("../static/image/open-vault-clipart.svg").default}
        ></img>
      </div>
    </div>
  );
}

export default CommunityPresale;
