import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ToastStatus, useToast } from "../context/ToastContext";
import { ethers } from "ethers";

export default function useOpenPosition(props, onSuccessCallback) {
  const toastContext = useToast();

  const weiBins = ethers.utils.parseEther(props.binTotal.toString());
  const pendingRewards = ethers.utils.parseEther(props.pendingBetterBalance);

  const transaction = useContractWrite({
    ...props.betterContractConfig,
    mode: "recklesslyUnprepared",
    functionName: "openPosition",
    args: [
      props.instrument.selector,
      props.customFlatFee,
      props.customGainFee,
      props.binAmountList.map((bin) => ethers.utils.parseEther(bin.toString())),
    ],
    overrides: {
      value: weiBins.gt(pendingRewards)
        ? weiBins.sub(pendingRewards).toString()
        : "0",
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
        "Successfully opened position",
        transaction.data?.hash
      );
      onSuccessCallback();
    },
  });
  return { confirmation, transaction };
}
