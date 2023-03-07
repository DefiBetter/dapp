import {
  useContractRead,
  useContractWrite,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import DBButton from "../components/common/DBButton";
import { contractAddresses } from "../static/contractAddresses";
import { ToastStatus, useToast } from "../context/ToastContext";
import Loader from "../components/common/Loader";
import { useState } from "react";
import confetti from "canvas-confetti";

export default function Betterdrop() {
  const { chain } = useNetwork();
  const toastContext = useToast();
  const [walletAddress, setWalletAddress] = useState("");

  const config = {
    address: contractAddresses[chain?.network]?.dbmtSale,
    abi: {},
  };
  const { data: alreadyEnlisted } = useContractRead({
    ...config,
    functionName: "alreadyEnlisted",
    select: (data) => Number(data),
    watch: true,
  });

  const { data: whitelistCapacity } = useContractRead({
    ...config,
    functionName: "WHITELIST_CAPACITY",
    select: (data) => Number(data),
    watch: false,
  });

  const claimAirdropTX = useContractWrite({
    ...config,
    functionName: "claim",
    mode: "recklesslyUnprepared",
  });

  useWaitForTransaction({
    confirmations: 2,
    hash: claimAirdropTX.data?.hash,
    onError(error) {
      console.error(error);
      toastContext.addToast(
        ToastStatus.Failed,
        "Failed to claim Airdrop",
        enterAirdropTX.data?.hash
      );
    },
    onSuccess() {
      firework();
      toastContext.addToast(
        ToastStatus.Success,
        "Successfuly claimed Airdrop",
        enterAirdropTX.data?.hash
      );
    },
  });

  const enterAirdropTX = useContractWrite({
    ...config,
    args: [walletAddress],
    functionName: "whitelistAddress",
  });

  const enterAirdropConf = useWaitForTransaction({
    confirmations: 2,
    hash: enterAirdropTX.data?.hash,
    onError(error) {
      console.error(error);
      toastContext.addToast(
        ToastStatus.Failed,
        "Failed to enter Airdrop",
        enterAirdropTX.data?.hash
      );
    },
    onSuccess() {
      toastContext.addToast(
        ToastStatus.Success,
        "Successfuly entered Airdrop",
        enterAirdropTX.data?.hash
      );
    },
  });

  function firework() {
    var duration = 10 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0,
    };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function () {
      var timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      var particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: {
            x: randomInRange(0.1, 0.3),
            y: Math.random() - 0.2,
          },
        })
      );
      confetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: {
            x: randomInRange(0.7, 0.9),
            y: Math.random() - 0.2,
          },
        })
      );
    }, 250);
  }

  return (
    <div className="relative bg-db-background border-[3px] border-db-cyan-process p-4 h-[83vh]">
      <div className="shadow-db m-auto w-full md:w-1/2 mt-5 bg-white border-2 border-db-cyan-process rounded-2xl p-4">
        <div className="flex justify-center text-5xl gap-4">
          DBMT
          <span className="font-bold mt-7 font-fancy text-5xl text-db-cyan-process">
            Airdrop 💦
          </span>
        </div>
      </div>

      <div className="relative z-10 flex flex-col gap-3 shadow-db m-auto w-full md:w-1/2 mt-5 bg-white border-2 border-db-cyan-process rounded-2xl p-4">
        <div className="flex justify-between w-full items-center">
          <div className="flex-1 shadow-db text-center font-bold bg-db-french-sky p-3 border-[1px] border-black rounded-lg">
            Spots left
          </div>
          <div className="flex-1 text-center">
            {whitelistCapacity - alreadyEnlisted}
          </div>
        </div>
        <input
          type="text"
          className="w-full h-12 rounded-lg"
          placeholder="Enter your Wallet address"
          onChange={(e) => {
            setWalletAddress(e.target.value);
          }}
        />
        <DBButton
          disabled={!enterAirdropTX.write}
          onClick={() => {
            if (enterAirdropTX.write) {
              enterAirdropTX.transaction.write();
            }
          }}
        >
          {enterAirdropConf.isLoading ? (
            <Loader text="Entering Airdrop" />
          ) : (
            "Enter Airdrop"
          )}
        </DBButton>
        <div className="mt-5 w-full md:w-1/2 m-auto ">
          <div>You will be able to claim once all spots are filled</div>
          <DBButton
            disabled={whitelistCapacity - alreadyEnlisted > 0}
            onClick={() => {
              firework();
              claimAirdropTX.transaction.write();
            }}
          >
            {enterAirdropConf.isLoading ? <Loader text="Claiming" /> : "Claim"}
          </DBButton>
        </div>
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
