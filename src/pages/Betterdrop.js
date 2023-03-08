import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
  useWaitForTransaction,
} from "wagmi";
import DBButton from "../components/common/DBButton";
import { contractAddresses } from "../static/contractAddresses";
import { ToastStatus, useToast } from "../context/ToastContext";
import Loader from "../components/common/Loader";
import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import LimitedCapacityAirdropABI from "../static/ABI/LimitedCapacityAirdropABI.json";
import useEnterBetterDrop from "../hooks/useEnterBetterDrop";
import useClaimBetterDrop from "../hooks/useClaimBetterDrop";
import useAddToWallet from "../hooks/useAddToWallet";

export default function Betterdrop() {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [walletAddress, setWalletAddress] = useState("");
  const [claimDisabled, setClaimDisabled] = useState(false);

  const addToWallet = useAddToWallet();

  useEffect(() => {
    if (address && walletAddress.length === 0) {
      setWalletAddress(address);
    }
  }, [address]);

  const config = {
    address: contractAddresses[chain?.network]?.dbmtAirdrop,
    abi: LimitedCapacityAirdropABI,
  };

  const { data: spotsLeft } = useContractRead({
    ...config,
    functionName: "spotsLeft",
    select: (data) => Number(data),
    watch: true,
  });

  const { data: endTime } = useContractRead({
    ...config,
    functionName: "endTime",
    select: (data) => Number(data),
    watch: true,
  });

  const enterAidrop = useEnterBetterDrop(walletAddress, () => {
    setWalletAddress("");
  });
  const claimAirdrop = useClaimBetterDrop(spotsLeft, () => {
    firework();
    setClaimDisabled(true);
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

      <div className="relative z-10 flex flex-col gap-3 shadow-db m-auto w-full lg:w-1/2 mt-5 bg-white border-2 border-db-cyan-process rounded-2xl p-4">
        <div className="flex justify-between w-full items-center">
          <div className="flex-1 shadow-db text-center font-bold bg-db-french-sky p-3 border-[1px] border-black rounded-lg">
            Spots left
          </div>
          <div className="flex-1 text-center">{spotsLeft}</div>
        </div>
        <input
          type="text"
          className="w-full h-12 rounded-lg text-base"
          placeholder="Enter your Wallet address"
          value={walletAddress}
          onChange={(e) => {
            setWalletAddress(e.target.value);
          }}
        />
        <DBButton
          disabled={walletAddress.length === 0}
          onClick={() => {
            if (enterAidrop.transaction.write) {
              enterAidrop.transaction.write();
            }
          }}
        >
          {enterAidrop.confirmation.isLoading ? (
            <Loader text="Entering Airdrop" />
          ) : (
            "Enter Airdrop"
          )}
        </DBButton>
        <div className="mt-5 w-full m-auto text-center">
          <div className="text-xs">
            You will be able to claim once all spots are filled. A wallet can
            enter only once.
          </div>
          <div className="flex gap-2 items-center flex-col md:flex-row justify-center">
            <div className="w-full md:w-2/3">
              <DBButton
                disabled={spotsLeft !== 0 || claimDisabled}
                onClick={() => {
                  claimAirdrop.transaction.write();
                }}
              >
                {claimAirdrop.confirmation.isLoading ? (
                  <Loader text="Claiming" />
                ) : (
                  "Claim"
                )}
              </DBButton>
            </div>
            <div className="w-full md:w-1/3">
              <button
                className="w-full bg-db-background border-[1px] h-10 border-black shadow-db rounded-lg text-sm flex items-center justify-center gap-2 "
                onClick={() => addToWallet("DBMT")}
              >
                <img
                  src={require("../../src/static/image/dbmt.png")}
                  width={30}
                  height={30}
                  alt="dbmt logo"
                />
                Add $DBMT to wallet
              </button>
            </div>
          </div>
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
