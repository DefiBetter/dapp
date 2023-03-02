import { InputNumber } from "../common/Input";
import { useState } from "react";
import { useNetwork } from "wagmi";
import { contractAddresses } from "../../static/contractAddresses";

import { trimNumber } from "../common/helper";
import useAllowance from "../../hooks/useAllowance";
import useApprove from "../../hooks/useApprove";
import useStakeBT from "../../hooks/useStakeBT";
import useUnstakeBT from "../../hooks/useUnstakeBT";
import useClaimBT from "../../hooks/useClaimBT";
import useBalanceOf from "../../hooks/useBalanceOf";
import useBTPendingRewards from "../../hooks/useBTPendingRewards";
import Loader from "../common/Loader";
import useUserBTStake from "../../hooks/useUserBTStake";
import DBButton from "../../components/common/DBButton";

const BtStakingCard = (props) => {
  /* global hooks */
  const { chain: activeChain } = useNetwork();

  /* states */
  const [btAmount, setBtAmount] = useState(0);

  /* web3 read/write */
  const btAllowance = useAllowance(
    contractAddresses[activeChain?.network]?.btToken,
    contractAddresses[activeChain?.network]?.btStaking
  );

  const approveBtWrite = useApprove(
    contractAddresses[activeChain?.network]?.btToken,
    contractAddresses[activeChain?.network]?.btStaking
  );

  const stakeBtWrite = useStakeBT(btAmount, () => {
    setBtAmount(0);
  });

  const unstakeBtWrite = useUnstakeBT(btAmount, () => {
    setBtAmount(0);
  });

  const claimBtWrite = useClaimBT();

  const userStaked = useUserBTStake();

  const vaultBalance = useBalanceOf(
    contractAddresses[activeChain?.network]?.btToken,
    contractAddresses[activeChain?.network]?.btStaking
  );

  const pendingRewards = useBTPendingRewards(userStaked);

  const userBTBalance = useBalanceOf(
    contractAddresses[activeChain?.network]?.btToken
  );

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
                {trimNumber(vaultBalance, 4, "dp")} BT
              </div>
            </div>
            <div className="flex justify-between items-center gap-2">
              <div className="shadow-db w-36 text-center font-bold bg-db-french-sky p-3 border-[1px] border-black rounded-lg">
                Your Stake
              </div>
              <div className="flex-1 text-sm text-center  font-bold">
                {userStaked} BT
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
                {trimNumber(userBTBalance, 4, "dp")} BT
              </div>
            </div>
          </div>
        </div>

        <div className="w-full">
          <InputNumber
            onChange={handleBtAmount}
            min={0}
            max={userBTBalance}
            placeholder={0}
            value={btAmount > 0 ? btAmount : ""}
            setValue={setBtAmount}
          />
        </div>

        <div className="flex gap-3">
          {!btAllowance ? (
            <DBButton
              onClick={() => {
                if (approveBtWrite.transaction.write) {
                  approveBtWrite.transaction.write();
                }
              }}
            >
              {approveBtWrite.confirmation.isLoading ? (
                <Loader text="Approving" />
              ) : (
                "Approve"
              )}
            </DBButton>
          ) : (
            <DBButton
              disabled={btAmount === 0}
              onClick={() => {
                if (stakeBtWrite.transaction.write) {
                  stakeBtWrite.transaction.write();
                }
              }}
            >
              {stakeBtWrite.confirmation.isLoading ? (
                <Loader text="Staking" />
              ) : (
                "Stake"
              )}
            </DBButton>
          )}

          <DBButton
            disabled={btAmount === 0 || btAmount > userStaked}
            onClick={() => {
              if (unstakeBtWrite.transaction.write) {
                unstakeBtWrite.transaction.write();
              }
            }}
          >
            {unstakeBtWrite.confirmation.isLoading ? (
              <Loader text="Unstaking" />
            ) : (
              "Unstake"
            )}
          </DBButton>
        </div>

        <div>
          <DBButton
            disabled={pendingRewards === 0}
            onClick={() => {
              if (claimBtWrite.transaction.write) {
                claimBtWrite.transaction.write();
              }
            }}
          >
            <div className="flex justify-center items-center gap-2">
              <div>
                {claimBtWrite.confirmation.isLoading ? (
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

export default BtStakingCard;
