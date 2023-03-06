import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ToastStatus, useToast } from "../context/ToastContext";
import { ethers } from "ethers";

export default function useOpenPosition(props, onSuccessCallback) {
  const toastContext = useToast();

  const transaction = useContractWrite({
    ...props.betterContractConfig,
    functionName: "openPosition",
    mode: "recklesslyUnprepared",
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
  });

  const confirmation = useWaitForTransaction({
    confirmations: 2,
    hash: transaction.data?.hash,
    onError(error) {
      console.error(error);
      toastContext.addToast(
        ToastStatus.Failed,
        "Failed to open position",
        transaction.data?.hash
      );
    },
    onSuccess() {
      toastContext.addToast(
        ToastStatus.Success,
        "Successfuly opened position",
        transaction.data?.hash
      );
      onSuccessCallback();
    },
  });
  return { confirmation, transaction };
}
