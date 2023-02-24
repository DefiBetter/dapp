import { useContext, useState } from "react";

import { InputNumber } from "../common/Input";
import { ethers } from "ethers";
import { contractAddresses } from "../../static/contractAddresses";
import LpStakingABI from "../../static/ABI/LpStakingABI.json";
import IERC20MetadataABI from "../../static/ABI/IERC20MetadataABI.json";
import {
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
} from "wagmi";
import { bignumber } from "mathjs";
import Col from "./Col.js";
import AlertContext from "../../context/AlertContext";

const LpStakingCard = (props) => {
  /* global hooks */
  const { chain: activeChain } = useNetwork();
  const { address: connectedAddress, isConnected } = useAccount();
  const [alertMessageList, setAlertMessageList] = useContext(AlertContext);

  /* constants */
  const lpStakingPoolContractConfig = {
    address: contractAddresses[activeChain?.network]?.lpStaking,
    abi: LpStakingABI,
  };

  const lpTokenContractConfig = {
    address: contractAddresses[activeChain?.network]?.lpToken,
    abi: IERC20MetadataABI,
  };

  /* states */
  const [lpAmount, setLpAmount] = useState(0);
  const [lpAllowance, setLpAllowance] = useState(bignumber("0"));
  const [lpBalance, setLpBalance] = useState(0);
  const [totalLpStaked, setTotalLpStaked] = useState(0);
  const [pendingRewards, setPendingRewards] = useState(0);

  const [zapAmount, setZapAmount] = useState(0);
  const [zapBalance, setZapBalance] = useState(0);

  /* web3 read/write */
  /* LP */
  // lpAllowance
  useContractRead({
    ...lpTokenContractConfig,
    functionName: "allowance",
    args: [connectedAddress, lpStakingPoolContractConfig.address],
    // watch: true,
    onError(data) {},
    onSuccess(data) {
      setLpAllowance(data);
    },
    watch: true,
  });

  // infinite approve lp
  const { write: approveLpWrite } = useContractWrite({
    ...lpTokenContractConfig,
    mode: "recklesslyUnprepared",
    functionName: "approve",
    args: [
      lpStakingPoolContractConfig.address,
      ethers.constants.MaxUint256.sub("1").toString(),
    ],
    onError(data) {
      setAlertMessageList((prevState) =>
        [...prevState].push("Error approving LP token")
      );
    },
    onSuccess(data) {},
  });

  // stake lp
  const { write: stakeLpWrite } = useContractWrite({
    ...lpStakingPoolContractConfig,
    mode: "recklesslyUnprepared",
    functionName: "stake",
    args: [0, ethers.utils.parseEther(lpAmount.toString()), connectedAddress],
    onMutate(data) {
      console.log("stake", lpStakingPoolContractConfig, [
        0,
        ethers.utils.parseEther(lpAmount.toString()),
        connectedAddress,
      ]);
      setAlertMessageList((prevState) => [...prevState, "Staking LP token..."]);
    },
    onError(data) {
      setAlertMessageList((prevState) => [
        ...prevState,
        "Error staking LP token",
      ]);
    },
    onSuccess(data) {
      setLpAmount(0);
      setAlertMessageList((prevState) => [
        ...prevState,
        "Successfully staked LP token",
      ]);
    },
  });

  // unstake lp
  const { write: unstakeLpWrite } = useContractWrite({
    ...lpStakingPoolContractConfig,
    mode: "recklesslyUnprepared",
    functionName: "unstake",
    args: [0, ethers.utils.parseEther(lpAmount.toString())],
    onSuccess(data) {},
  });

  // claim lp rewards
  const { write: claimLpWrite } = useContractWrite({
    ...lpStakingPoolContractConfig,
    mode: "recklesslyUnprepared",
    functionName: "claim",
    args: [0],
    onSuccess(data) {},
    onError(data) {},
  });

  // balance of lp
  useContractRead({
    ...lpTokenContractConfig,
    functionName: "balanceOf",
    args: [connectedAddress],
    onError(data) {},
    onSuccess(data) {
      setLpBalance(ethers.utils.formatEther(data));
    },
    watch: true,
  });

  // total lp staked
  useContractRead({
    ...lpTokenContractConfig,
    functionName: "balanceOf",
    args: [lpStakingPoolContractConfig.address],
    onError(data) {},
    onSuccess(data) {
      setTotalLpStaked(ethers.utils.formatEther(data));
    },
    watch: true,
  });

  // pending staking rewards
  useContractRead({
    ...lpStakingPoolContractConfig,
    functionName: "getPendingRewards",
    args: [connectedAddress, 0],
    onError(data) {},
    onSuccess(data) {
      setPendingRewards(ethers.utils.formatEther(data));
    },
    watch: true,
  });

  /* ZAP */
  useBalance({
    address: connectedAddress,
    onError(data) {},
    onSuccess(data) {
      setZapBalance(+data.formatted);
    },
  });

  /* handle callback */
  // lp staking
  const handleLpAmount = (e) => {
    console.log("handle lpAmount", e.target.value);
    setLpAmount(e.target.value ? e.target.value : 0);
  };

  // zap in - amount in gas token
  const handleZapAmount = (e) => {
    setZapAmount(e.target.value ? e.target.value : 0);
  };

  return (
    <div className="w-full border-[3px] border-db-cyan-process bg-white rounded-2xl">
      <div className="p-4 flex flex-col gap-2">
        <div className="flex gap-2 md:gap-4 flex-col md:flex-row">
          {/* Left */}
          <div className="w-full md:w-1/2 flex flex-col gap-2">
            <div className="flex justify-between items-center gap-2">
              <div className="shadow-db w-36 text-center font-bold bg-db-french-sky p-3 border-[1px] border-black rounded-lg">
                Total Staked
              </div>
              <div className="flex-1 text-sm text-center font-bold">
                {totalLpStaked}{" "}
                {`BT-${contractAddresses[activeChain?.network]?.nativeGas} LP`}
              </div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <div className="shadow-db w-36 text-center font-bold bg-db-french-sky p-3 border-[1px] border-black rounded-lg">
                Your Stake
              </div>
              <div className="flex-1 text-sm text-center  font-bold">
                {totalLpStaked}{" "}
                {`BT-${contractAddresses[activeChain?.network]?.nativeGas} LP`}
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="w-full md:w-1/2 flex flex-col gap-2">
            <div className="flex justify-between items-center gap-2">
              <div className="shadow-db w-36 text-center font-bold bg-db-french-sky p-3 border-[1px] border-black rounded-lg">
                Current APR
              </div>
              <div className="flex-1 text-sm text-center text-lime-500 font-bold">
                69%
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="shadow-db w-36 text-center font-bold bg-db-french-sky p-3 border-[1px] border-black rounded-lg">
                Your Balance
              </div>
              <div className="flex-1 text-sm text-center font-bold">
                {lpBalance}{" "}
                {`BT-${contractAddresses[activeChain?.network]?.nativeGas} LP`}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="w-2/3">
            <InputNumber
              onChange={handleLpAmount}
              min={0}
              max={() => {
                console.log("lpBalance", lpBalance);
                return lpBalance;
              }}
              placeholder={0}
              value={lpAmount > 0 ? lpAmount : ""}
              setValue={setLpAmount}
            />
          </div>
          <div className="w-1/3">
            <InputNumber
              onChange={handleZapAmount}
              min={0}
              max={zapBalance}
              placeholder={0}
              value={zapAmount > 0 ? zapAmount : ""}
              setValue={setZapAmount}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <div className="w-2/3 flex gap-2">
            {ethers.BigNumber.from(lpAllowance.toString()).lte(
              ethers.BigNumber.from("0")
            ) ? (
              <button
                className="border-[1px] border-black shadow-db pt-1 font-fancy bg-db-cyan-process h-10 w-full rounded-lg text-lg text-white hover:bg-db-blue-200"
                onClick={approveLpWrite}
              >
                Approve
              </button>
            ) : (
              <button
                className="border-[1px] border-black shadow-db pt-1 font-fancy bg-db-cyan-process h-10 w-full rounded-lg text-lg text-white hover:bg-db-blue-200"
                onClick={stakeLpWrite}
              >
                Stake
              </button>
            )}
            <button
              className="border-[1px] border-black shadow-db pt-1 font-fancy bg-db-cyan-process h-10 w-full rounded-lg text-lg text-white hover:bg-db-blue-200"
              onClick={unstakeLpWrite}
            >
              Unstake
            </button>
          </div>
          <div className="w-1/3">
            <button
              className="border-[1px] border-black shadow-db pt-1 font-fancy bg-db-cyan-process h-10 w-full rounded-lg text-lg text-white hover:bg-db-blue-200"
              disabled
              onClick={() => {}}
            >
              Zap In
            </button>
          </div>
        </div>

        <div>
          <button
            className="border-[1px] border-black shadow-db pt-1 font-fancy bg-db-cyan-process h-10 w-full rounded-lg text-lg text-white hover:bg-db-blue-200"
            onClick={claimLpWrite}
          >
            <div className="flex justify-center items-center gap-2">
              <div>Claim</div>
              <div className="pb-1 font-sans text-sm leading-none">
                {Math.round(+pendingRewards * 10_000) / 10_000}{" "}
                {props.nativeGas}
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default LpStakingCard;
