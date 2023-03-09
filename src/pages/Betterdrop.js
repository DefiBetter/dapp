import { useAccount, useContractRead, useNetwork } from "wagmi";
import DBButton from "../components/common/DBButton";
import { contractAddresses } from "../static/contractAddresses";
import Loader from "../components/common/Loader";
import { useEffect, useState } from "react";
import LimitedCapacityAirdropABI from "../static/ABI/LimitedCapacityAirdropABI.json";
import useEnterBetterDrop from "../hooks/useEnterBetterDrop";
import useClaimBetterDrop from "../hooks/useClaimBetterDrop";
import useAddToWallet from "../hooks/useAddToWallet";
import useFirework from "../hooks/useFireworks";
export default function Betterdrop() {
  const { chain } = useNetwork();
  const { address } = useAccount();
  const [walletAddress, setWalletAddress] = useState("");
  const [claimDisabled, setClaimDisabled] = useState(false);

  const addToWallet = useAddToWallet();
  const { firework } = useFirework();
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
    firework();
    setWalletAddress("");
  });
  const claimAirdrop = useClaimBetterDrop(spotsLeft, () => {
    firework();
    setClaimDisabled(true);
  });

  return (
    <div className="relative bg-db-background border-[3px] border-db-cyan-process p-4 h-[90vh] md:h-[83vh]">
      <div className="shadow-db m-auto w-full md:w-1/2 mt-5 bg-white border-2 border-db-cyan-process rounded-2xl p-4">
        <div className="flex justify-center text-5xl gap-4">
          DBMT
          <span className="font-bold mt-7 font-fancy text-5xl text-db-cyan-process">
            Airdrop 💦
          </span>
        </div>
      </div>

      <div className="absolute bottom-2 right-2 flex gap-2 items-center">
        <a
          target="_blank"
          rel="noreferrer"
          href="https://discord.gg/DSDXSXf6Ub"
        >
          <img
            className="w-10 h-10"
            src={require("../static/image/discord-logo.png")}
          />
        </a>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://t.me/+2z4mDnFAnjxiMWJl"
        >
          <img
            className="w-10 h-10"
            src={require("../static/image/telegram-logo.png")}
          />
        </a>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://twitter.com/defi_better"
        >
          <img
            className="w-10 h-10"
            src={require("../static/image/twitter-logo.png")}
          />
        </a>
        <a
          target="_blank"
          rel="noreferrer"
          href="https://medium.com/@defibetter"
        >
          <img
            className="w-10 h-10"
            src={require("../static/image/medium-logo.png")}
          />
        </a>
      </div>

      <div className="relative z-10 flex flex-col gap-3 shadow-db m-auto w-full lg:w-1/2 mt-5 bg-white border-2 border-db-cyan-process rounded-2xl p-4">
        <div className="flex justify-between w-full items-center">
          <div className="flex-1 shadow-db text-center font-bold bg-db-french-sky p-3 border-[1px] border-black rounded-lg">
            Spots left
          </div>
          <div className="flex-1 text-center">0</div>
        </div>
        <div className="flex-1 content-center text-2xl">
          <div className="place-content-center text-center mt-8 bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-500 text-transparent">
            Airdrop enrollment is over. <br />
            If you are whitelisted, you can now claim.{" "}
          </div>

          <div className="mt-2 flex gap-2 items-center place-content-center">
            <a
              target="_blank"
              rel="noreferrer"
              href="https://discord.gg/DSDXSXf6Ub"
            >
              <img
                className="w-10 h-10"
                src={require("../static/image/discord-logo.png")}
              />
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://t.me/+2z4mDnFAnjxiMWJl"
            >
              <img
                className="w-10 h-10"
                src={require("../static/image/telegram-logo.png")}
              />
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://twitter.com/defi_better"
            >
              <img
                className="w-10 h-10"
                src={require("../static/image/twitter-logo.png")}
              />
            </a>
            <a
              target="_blank"
              rel="noreferrer"
              href="https://medium.com/@defibetter"
            >
              <img
                className="w-10 h-10"
                src={require("../static/image/medium-logo.png")}
              />
            </a>
          </div>
        </div>
        <div className="mt-5 w-full m-auto text-center">
          <div className="text-xs">
            You will be able to claim once all spots are filled. A wallet can
            enter only once.
          </div>
          <div className="flex gap-2 items-center flex-col md:flex-row justify-center">
            <div className="w-full md:w-2/3">
              <DBButton
                disabled={
                  spotsLeft !== 0 ||
                  claimDisabled ||
                  claimAirdrop.preparation.isError
                }
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
      <div className="hidden md:block z-0 absolute h-60 bottom-10 left-[13%]">
        <img
          alt="faucet"
          className="h-full z-0"
          src={require("../static/image/open-vault-clipart.svg").default}
        ></img>
      </div>
    </div>
  );
}
