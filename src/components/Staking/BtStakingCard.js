import { Button, ButtonWithInfo } from "../common/Button";
import { Card, CardBlueBgBlackBorder } from "../common/Card";
import { Grid, GridRow } from "../common/Grid";
import { InputNumber } from "../common/Input";
import Col from "./Col";
import { ethers } from "ethers";
import { useContext, useState } from "react";
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useNetwork,
} from "wagmi";
import { contractAddresses } from "../../static/contractAddresses";
import BtStakingABI from "../../static/ABI/BtStakingABI.json";
import BTABI from "../../static/ABI/BTABI.json";
import AlertContext from "../../context/AlertContext";
import { bignumber } from "mathjs";
import { CenterText, MedText, SmallText, NormalText } from "../common/Text";

const BtStakingCard = (props) => {
  /* global hooks */
  const { address: connectedAddress, isConnected } = useAccount();
  const { chain: activeChain } = useNetwork();
  const [alertMessageList, setAlertMessageList] = useContext(AlertContext);

  /* constants */
  const btStakingPoolContractConfig = {
    address: contractAddresses[activeChain?.network]?.btStaking,
    abi: BtStakingABI,
  };

  const btTokenContractConfig = {
    address: contractAddresses[activeChain?.network]?.btToken,
    abi: BTABI,
  };

  /* states */
  const [btAmount, setBtAmount] = useState(0);
  const [btAllowance, setBtAllowance] = useState(bignumber("0"));
  const [btBalance, setBtBalance] = useState(0);
  const [totalBtStaked, setTotalBtStaked] = useState(0);
  const [pendingRewards, setPedingRewards] = useState(0);

  /* web3 read/write */
  // btAllowance bt
  useContractRead({
    ...btTokenContractConfig,
    functionName: "allowance",
    args: [
      connectedAddress,
      contractAddresses[activeChain?.network]?.btStaking,
    ],
    onError(data) {},
    onSuccess(data) {
      setBtAllowance(data);
    },
    watch: true,
  });

  // infinite approve bt
  const { write: approveBtWrite } = useContractWrite({
    ...btTokenContractConfig,
    mode: "recklesslyUnprepared",
    functionName: "approve",
    args: [
      btStakingPoolContractConfig.address,
      ethers.constants.MaxUint256.sub("1").toString(),
    ],
    onSettled(data) {
      setAlertMessageList([...alertMessageList, `Approving BT token...`]);
    },
    onSuccess(data) {
      setAlertMessageList([
        ...alertMessageList,
        `Successfully approved BT tokens`,
      ]);
    },
  });

  // stake bt
  const { write: stakeBtWrite } = useContractWrite({
    ...btStakingPoolContractConfig,
    mode: "recklesslyUnprepared",
    functionName: "stake",
    args: [ethers.utils.parseEther(btAmount.toString())],
    onMutate(data) {
      setAlertMessageList((alertMessageList) => [
        ...alertMessageList,
        `Staking BT tokens...`,
      ]);
    },
    onError(data) {
      setAlertMessageList((alertMessageList) => [
        ...alertMessageList,
        `Failed to stake BT tokens`,
      ]);
    },
    onSuccess(data) {
      setBtAmount(0);
      setAlertMessageList((alertMessageList) => [
        ...alertMessageList,
        `Successfully staked BT tokens`,
      ]);
    },
  });

  // unstake bt
  const { write: unstakeBtWrite } = useContractWrite({
    ...btStakingPoolContractConfig,
    functionName: "unstake",
    args: [ethers.utils.parseEther(btAmount.toString())],
    onMutate(data) {
      setAlertMessageList((alertMessageList) => [
        ...alertMessageList,
        `Unstaking BT tokens...`,
      ]);
    },
    onError(data) {
      setAlertMessageList([...alertMessageList, `Failed to unstake BT tokens`]);
    },
    onSuccess(data) {
      setAlertMessageList([
        ...alertMessageList,
        `Successfully unstaked BT tokens`,
      ]);
    },
  });

  // claim bt rewards
  const { write: claimBtWrite } = useContractWrite({
    mode: "recklesslyUnprepared",
    ...btStakingPoolContractConfig,
    functionName: "claim",
    args: [],
    onSuccess(data) {},
    onError(data) {},
  });

  // balance of bt
  useContractRead({
    ...btTokenContractConfig,
    functionName: "balanceOf",
    args: [connectedAddress],
    onError(data) {},
    onSuccess(data) {
      setBtBalance(ethers.utils.formatEther(data));
    },
    watch: true,
  });

  // total bt staked
  useContractRead({
    ...btTokenContractConfig,
    functionName: "balanceOf",
    args: [btStakingPoolContractConfig.address],
    onError(data) {},
    onSuccess(data) {
      setTotalBtStaked(ethers.utils.formatEther(data));
    },
    watch: true,
  });

  // pending staking rewards
  useContractRead({
    ...btStakingPoolContractConfig,
    functionName: "getPendingRewards",
    args: [connectedAddress],
    onError(data) {},
    onSuccess(data) {
      setPedingRewards(ethers.utils.formatEther(data));
    },
    watch: true,
  });

  /* handle callback */
  // bt staking
  const handleBtAmount = (e) => {
    setBtAmount(e.target.value ? e.target.value : 0);
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
                {totalBtStaked}{" "}BT
              </div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <div className="shadow-db w-36 text-center font-bold bg-db-french-sky p-3 border-[1px] border-black rounded-lg">
                Your Stake
              </div>
              <div className="flex-1 text-sm text-center  font-bold">
                42{' '}BT
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="w-full md:w-1/2 flex flex-col gap-2">
            <div className="flex justify-between items-center gap-2">
              <div className="shadow-db w-36 text-center font-bold bg-db-french-sky p-3 border-[1px] border-black rounded-lg">
                Current APR
              </div>
              <div className="flex-1 text-sm text-center text-lime-500 font-bold">69%</div>
            </div>
            <div className="flex items-center gap-2">
              <div className="shadow-db w-36 text-center font-bold bg-db-french-sky p-3 border-[1px] border-black rounded-lg">
                Your Balance
              </div>
              <div className="flex-1 text-sm text-center font-bold">
                42 BT
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <InputNumber
            onChange={handleBtAmount}
            min={0}
            max={btBalance}
            placeholder={0}
            value={btAmount > 0 ? btAmount : ""}
            setValue={setBtAmount}
          />
        </div>

        <div className="flex gap-3">
          {ethers.BigNumber.from(btAllowance.toString()).lte(
            ethers.BigNumber.from("0")
          ) ? (
            <button
              className="border-[1px] border-black shadow-db pt-1 font-fancy bg-db-cyan-process h-10 w-full rounded-lg text-lg text-white hover:bg-db-blue-200"
              onClick={approveBtWrite}
            >
              Approve
            </button>
          ) : (
            <button
              className="border-[1px] border-black shadow-db pt-1 font-fancy bg-db-cyan-process h-10 w-full rounded-lg text-lg text-white hover:bg-db-blue-200"
              onClick={stakeBtWrite}
            >
              Stake
            </button>
          )}
          <button
            className="border-[1px] border-black shadow-db pt-1 font-fancy bg-db-cyan-process h-10 w-full rounded-lg text-lg text-white hover:bg-db-blue-200"
            onClick={unstakeBtWrite}
          >
            Unstake
          </button>
        </div>

        <div>
          <button
            className="border-[1px] border-black shadow-db pt-1 font-fancy bg-db-cyan-process h-10 w-full rounded-lg text-lg text-white hover:bg-db-blue-200"
            onClick={claimBtWrite}
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

export default BtStakingCard;
