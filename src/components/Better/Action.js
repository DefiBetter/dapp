import DBButton from "../common/DBButton";
import useOpenPosition from "../../hooks/useOpenPosition";
import Loader from "../common/Loader";
import useClaimBetterRewards from "../../hooks/useClaimBetterRewards";
import { contractAddresses } from "../../static/contractAddresses";
import { useNetwork } from "wagmi";

const Action = (props) => {
  const depositWrite = useOpenPosition(props, () => {
    props.setBinAmountList([0, 0, 0, 0, 0, 0, 0]);
    props.setBinTotal(0);
  });
  const { chain: activeChain } = useNetwork();

  const claimWrite = useClaimBetterRewards(props);
  const nativeGas = contractAddresses[activeChain?.network]?.nativeGas;

  return (
    <div className="flex justify-between gap-5 items-center">
      <div className="flex-1">
        {
          <DBButton
            heigthTwClass="h-12"
            onClick={() => {
              depositWrite.transaction.write();
            }}
            disabled={
              !depositWrite.transaction.write ||
              props.binTotal === 0 ||
              Date.now() / 1000 >
                +props.instrument.lastEpochClosingTime.toString() +
                  +props.instrument.epochDurationInSeconds.toString()
            }
          >
            <div className="flex justify-center items-center gap-2">
              <div className="">
                {depositWrite.confirmation.isLoading ? (
                  <Loader text={`Depositing ${nativeGas}`} />
                ) : (
                  `Deposit ${nativeGas}`
                )}
              </div>
              <div className="font-sans text-sm pb-0.5 border-[1px] border-white rounded-full w-4 h-4 flex justify-center items-center group relative">
                i
                <div className="absolute top-4 w-60 bg-db-background dark:bg-db-dark-input z-50 right-0 scale-0 group-hover:scale-100 transition-transform p-2 rounded-lg">
                  After distributing your capital across the bins, use this
                  button to open a position and deposit your capital until the
                  end of the epoch. Monitor your position value on the right
                  side under 'My statistics'.
                </div>
              </div>
            </div>
          </DBButton>
        }
      </div>

      <div className="flex-1">
        <DBButton
          heigthTwClass="h-12"
          disabled={Number(props.pendingBetterBalance) === 0}
          onClick={() => {
            if (claimWrite.transaction.write) {
              claimWrite.transaction.write();
            }
          }}
        >
          <div className="flex justify-center items-center gap-2">
            <div>
              {claimWrite.confirmation.isLoading ? (
                <Loader text="Claiming" />
              ) : (
                "Claim"
              )}
            </div>
            <div className="font-sans text-sm leading-none">
              {Math.round(+props.pendingBetterBalance * 10_000) / 10_000}{" "}
              {props.nativeGas}
            </div>
          </div>
        </DBButton>
      </div>
    </div>
  );
};

export default Action;
