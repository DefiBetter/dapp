import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ToastStatus, useToast } from "../context/ToastContext";

export default function useClaimBetterRewards(props) {
  const toastContext = useToast();

  const preparation = usePrepareContractWrite({
    ...props.betterContractConfig,
    functionName: "claimBetterRewards",
    args: [props.customGainFee],
  });

  const transaction = useContractWrite(preparation.config);
  const confirmation = useWaitForTransaction({
    confirmations: 2,
    hash: transaction.data?.hash,
    onError(error) {
      console.error(error);
      toastContext.addToast(
        ToastStatus.Failed,
        "Failed to claim",
        transaction.data?.hash
      );
    },
    onSuccess() {
      toastContext.addToast(
        ToastStatus.Success,
        "Successfully claimed",
        transaction.data?.hash
      );
    },
  });
  return { confirmation, transaction };
}
