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
import { ToastStatus, useToast } from "../../context/ToastContext";

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
    console.log("stake success callback");
    setLpAmount(0);
  });

  const unstakeLpWrite = useUnstakeLP(0, lpAmount, () => {
    console.log("unstakke success callback");
    setLpAmount(0);
  });

  const claimLpWrite = useClaimLP(0, () => {
    console.log("claim success callback");
  });

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

  const toastContext = useToast();

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
                {trimNumber(vaultBalance, 4, "dp")}{" "}
                {`BT-${contractAddresses[activeChain?.network]?.nativeGas} LP`}
              </div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <div className="shadow-db w-36 text-center font-bold bg-db-french-sky p-3 border-[1px] border-black rounded-lg">
                Your Stake
              </div>
              <div className="flex-1 text-sm text-center  font-bold">
                {userStaked}{" "}
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
                {trimNumber(69, 4, "dp")}%
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="shadow-db w-36 text-center font-bold bg-db-french-sky p-3 border-[1px] border-black rounded-lg">
                Your Balance
              </div>
              <div className="flex-1 text-sm text-center font-bold">
                {trimNumber(userLPBalance, 4, "dp")}{" "}
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

        <div className="flex gap-2">
          <div className="w-2/3 flex gap-2">
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
              Zap In
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
              <div className="pb-1 font-sans text-sm leading-none">
                {trimNumber(pendingRewards, 4, "dp")} {props.nativeGas}
              </div>
            </div>
          </DBButton>
        </div>
      </div>
    </div>
  );
};

export default LpStakingCard;
