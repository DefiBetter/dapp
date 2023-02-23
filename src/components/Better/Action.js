import { ethers } from "ethers";
import { usePrepareContractWrite, useContractWrite } from "wagmi";
import { useContext } from "react";
import AlertContext from "../../context/AlertContext";

const Action = (props) => {
  const [alertMessageList, setAlertMessageList] = useContext(AlertContext);

  // open position
  let { write: depositWrite } = useContractWrite({
    ...{
      ...props.betterContractConfig,
      mode: "recklesslyUnprepared",
      functionName: "openPosition",
      args: [
        props.instrument.selector,
        props.customFlatFee,
        props.customGainFee,
        props.binAmountList.map((bin) => {
          return ethers.utils.parseEther(bin.toString());
        }),
      ],
      overrides: {
        value: ethers.utils.parseEther(
          (props.binTotal >= props.pendingBetterBalance
            ? props.binTotal - props.pendingBetterBalance
            : 0
          ).toString()
        ),
      },
      onError(data) {
        setAlertMessageList([...alertMessageList, JSON.stringify(data)]);
        console.log("openPosition error", data);
        console.log("openPosition pending", props.pendingBetterBalance);
        console.log("openPosition binTotal", props.binTotal);
      },
      onSuccess(data) {
        console.log("openPosition", data);
        setAlertMessageList([
          ...alertMessageList,
          `Successfully deposited ${props.binAmountList.reduce(
            (a, b) => a + b
          )} in Epoch ${
            props.instrument.epoch
          } at ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`,
        ]);
        props.setBinAmountList([0, 0, 0, 0, 0, 0, 0]);
        props.setBinTotal(0);
      },
    },
  });

  // claim rewards
  const { config: claimBetterRewardsConfig } = usePrepareContractWrite({
    ...props.betterContractConfig,
    functionName: "claimBetterRewards",
    args: [props.customGainFee],
  });
  let { write: claimWrite } = useContractWrite(claimBetterRewardsConfig);

  /* handle onclick */
  const handleOnDeposit = () => {
    if (props.binTotal > 0) {
      depositWrite();
    } else {
      console.log("cannot place empty bets");
    }
  };

  return (
    <div className="flex justify-between gap-5 items-center">
      <div className="flex-1">
        {Date.now() / 1000 >
        +props.instrument.lastEpochClosingTime.toString() +
          +props.instrument.epochDurationInSeconds.toString() ? (
          <button
            disabled
            className="disabled:bg-gray-400 flex justify-center text-lg items-center gap-2 border-[1px] border-black shadow-db bg-db-cyan-process h-10 w-full rounded-lg text-white hover:bg-db-blue-200"
          >
            <div className="font-fancy pt-1 ">Deposit</div>
            <div className="text-sm pb-0.5 border-[1px] border-white rounded-full w-4 h-4 flex justify-center items-center">
              i
            </div>
          </button>
        ) : (
          <button
            className="flex justify-center text-lg items-center gap-2 border-[1px] border-black shadow-db bg-db-cyan-process h-10 w-full rounded-lg text-white hover:bg-db-blue-200"
            onClick={handleOnDeposit}
          >
            <div className="font-fancy pt-1 ">Deposit</div>
            <div className="text-sm pb-0.5 border-[1px] border-white rounded-full w-4 h-4 flex justify-center items-center">
              i
            </div>
          </button>
        )}
      </div>

      <div className="flex-1">
        <button
          className="border-[1px] border-black shadow-db pt-1 font-fancy bg-db-cyan-process h-10 w-full rounded-lg text-lg text-white hover:bg-db-blue-200"
          onClick={claimWrite}
        >
          <div className="flex justify-center items-center gap-2">
            <div>Claim</div>
            <div className="pb-1 font-sans text-sm leading-none">
              {Math.round(+props.pendingBetterBalance * 10_000) / 10_000}{" "}
              {props.nativeGas}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default Action;
