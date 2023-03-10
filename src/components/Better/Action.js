import DBButton from "../common/DBButton";
import useOpenPosition from "../../hooks/useOpenPosition";
import Loader from "../common/Loader";
import useClaimBetterRewards from "../../hooks/useClaimBetterRewards";

const Action = (props) => {
  const depositWrite = useOpenPosition(props, () => {
    props.setBinAmountList([0, 0, 0, 0, 0, 0, 0]);
    props.setBinTotal(0);
  });

  const claimWrite = useClaimBetterRewards(props);

  return (
    <div className="flex justify-between gap-5 items-center">
      <div className="flex-1">
        {
          <DBButton
            onClick={() => {
              depositWrite.transaction.write();
            }}
            disabled={
              props.binTotal === 0 ||
              Date.now() / 1000 >
                +props.instrument.lastEpochClosingTime.toString() +
                  +props.instrument.epochDurationInSeconds.toString()
            }
          >
            <div className="flex justify-center items-center gap-2">
              <div className="">
                {depositWrite.confirmation.isLoading ? (
                  <Loader text="Depositing" />
                ) : (
                  "Deposit"
                )}
              </div>
              <div className="font-sans text-sm pb-0.5 border-[1px] border-white rounded-full w-4 h-4 flex justify-center items-center">
                i
              </div>
            </div>
          </DBButton>
        }
      </div>

      <div className="flex-1">
        <DBButton
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
