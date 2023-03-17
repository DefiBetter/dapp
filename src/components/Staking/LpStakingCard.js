import { useState } from "react";
import { InputNumber } from "../common/Input";
import { contractAddresses } from "../../static/contractAddresses";
import { useNetwork } from "wagmi";
import { trimNumber } from "../common/helper";
import useAllowance from "../../hooks/useAllowance";
import useApprove from "../../hooks/useApprove";
import useStakeLP from "../../hooks/useStakeLP";
import useUnstakeLP from "../../hooks/useUnstakeLP";
import useClaimLP from "../../hooks/useClaimLP";
import useBalanceOf from "../../hooks/useBalanceOf";
import useLPPendingRewards from "../../hooks/useLPPendingRewards";
import useNativeBalance from "../../hooks/useNativeBalance";
import Loader from "../common/Loader";
import useUserLPStake from "../../hooks/useUserLPStake";
import DBButton from "../../components/common/DBButton";
import { BsWallet2, BsPiggyBank, BsBank } from "react-icons/bs";
import {  GiCoins } from "react-icons/gi";

const LpStakingCard = (props) => {
  const { chain: activeChain } = useNetwork();
  /* constants */

  /* states */
  const [lpAmount, setLpAmount] = useState(0);
  const [zapAmount, setZapAmount] = useState(0);

  const lpAllowance = useAllowance(
    contractAddresses[activeChain?.network]?.lpToken,
    contractAddresses[activeChain?.network]?.lpStaking
  );
  const approveLpWrite = useApprove(
    contractAddresses[activeChain?.network]?.lpToken,
    contractAddresses[activeChain?.network]?.lpStaking
  );

  const stakeLpWrite = useStakeLP(0, lpAmount, () => {
    setLpAmount(0);
  });

  const unstakeLpWrite = useUnstakeLP(0, lpAmount, () => {
    setLpAmount(0);
  });

  const claimLpWrite = useClaimLP(0);

  const userStaked = useUserLPStake(0);

  const vaultBalance = useBalanceOf(
    contractAddresses[activeChain?.network]?.lpToken,
    contractAddresses[activeChain?.network]?.lpStaking
  );

  const pendingRewards = useLPPendingRewards(0, userStaked);
  const zapBalance = useNativeBalance();

  const userLPBalance = useBalanceOf(
    contractAddresses[activeChain?.network]?.lpToken
  );

  /* handle callback */
  // lp staking
  const handleLpAmount = (e) => {
    setLpAmount(e.target.value ? e.target.value : 0);
  };

  // zap in - amount in gas token
  const handleZapAmount = (e) => {
    setZapAmount(e.target.value ? e.target.value : 0);
  };

  return (
    <div className="w-full">
      <div className="mt-4 flex flex-col gap-4">
        <div className="w-full flex flex-col flex-wrap md:flex-row justify-between gap-4 md:gap-0">
          <div className="md:h-14 flex flex-row md:flex-col w-full md:w-1/2 items-center justify-between md:justify-center">
            <div className="flex items-center gap-2 text-db-blue-gray">
              <BsBank size={20} />
              <div>Total Staked</div>
            </div>
            <div className="font-bold">
              {trimNumber(vaultBalance, 4, "dp")}{" "}
              {`BT-${contractAddresses[activeChain?.network]?.nativeGas} LP`}
            </div>
          </div>
          <div className="md:h-14 flex flex-row md:flex-col w-full md:w-1/2 items-center justify-between md:justify-center">
            <div className="flex items-center gap-2 text-db-blue-gray">
              <BsPiggyBank size={20} />
              <div>Your Stake</div>
            </div>
            <div className="font-bold">
              {userStaked}{" "}
              {`BT-${contractAddresses[activeChain?.network]?.nativeGas} LP`}
            </div>
          </div>
          <div className="md:h-14 flex flex-row md:flex-col w-full md:w-1/2 items-center justify-between md:justify-center">
            <div className="flex items-center gap-2 text-db-blue-gray">
              <GiCoins size={20} />
              <div>Current APR</div>
            </div>
            <div className="font-bold">{trimNumber(69, 4, "dp")}%</div>
          </div>
          <div className="md:h-14 flex flex-row md:flex-col w-full md:w-1/2 items-center justify-between md:justify-center">
            <div className="flex items-center gap-2 text-db-blue-gray">
              <BsWallet2 size={20} />
              <div>Your Wallet Balance</div>
            </div>
            <div className="font-bold">
              {trimNumber(userLPBalance, 4, "dp")}{" "}
              {`BT-${contractAddresses[activeChain?.network]?.nativeGas} LP`}
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="w-2/3">
            <InputNumber
              onChange={handleLpAmount}
              min={0}
              max={userLPBalance}
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

        <div className="flex gap-4">
          <div className="w-2/3 flex gap-4">
            {!lpAllowance ? (
              <DBButton
                onClick={() => {
                  if (approveLpWrite.transaction.write) {
                    approveLpWrite.transaction.write();
                  }
                }}
              >
                {approveLpWrite.confirmation.isLoading ? (
                  <Loader text="Approving" />
                ) : (
                  "Approve"
                )}
              </DBButton>
            ) : (
              <DBButton
                disabled={lpAmount === 0}
                onClick={() => {
                  if (stakeLpWrite.transaction.write) {
                    stakeLpWrite.transaction.write();
                  }
                }}
              >
                {stakeLpWrite.confirmation.isLoading ? (
                  <Loader text="Staking" />
                ) : (
                  "Stake"
                )}
              </DBButton>
            )}
            <DBButton
              disabled={lpAmount === 0 || lpAmount > userStaked}
              onClick={() => {
                if (unstakeLpWrite.transaction.write) {
                  unstakeLpWrite.transaction.write();
                }
              }}
            >
              {unstakeLpWrite.confirmation.isLoading ? (
                <Loader text="Unstaking" />
              ) : (
                "Unstake"
              )}
            </DBButton>
          </div>
          <div className="w-1/3">
            <DBButton disabled onClick={() => {}}>
              Zap In {contractAddresses[activeChain?.network]?.nativeGas}
            </DBButton>
          </div>
        </div>

        <div>
          <DBButton
            disabled={pendingRewards === 0}
            onClick={() => {
              if (claimLpWrite.transaction.write) {
                claimLpWrite.transaction.write();
              }
            }}
          >
            <div className="flex justify-center items-center gap-2">
              <div>
                {claimLpWrite.confirmation.isLoading ? (
                  <Loader text="Claiming" />
                ) : (
                  "Claim"
                )}
              </div>
              <div className="font-sans text-sm leading-none">
                {trimNumber(pendingRewards, 4, "dp")} BT
              </div>
            </div>
          </DBButton>
        </div>
      </div>
    </div>
  );
};

export default LpStakingCard;
