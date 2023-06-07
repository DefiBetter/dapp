import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ethers } from "ethers";
import StrategyVaultABI from "../static/ABI/StrategyVaultABI.json";
import { ToastStatus, useToast } from "../context/ToastContext";

export default function useVaultWithdraw(vault, amount, isClaim, onSuccessCallback) {
  const toastContext = useToast();

  const preparation = usePrepareContractWrite({
    address: vault,
    abi: StrategyVaultABI,
    functionName: "withdraw",
    args: [ethers.utils.parseEther(amount.toString())],
  });

  const transaction = useContractWrite(preparation.config);
  const confirmation = useWaitForTransaction({
    confirmations: 2,
    hash: transaction.data?.hash,
    onError(error) {
      console.error(error);
      toastContext.addToast(
        ToastStatus.Failed,
        "Failed to withdraw",
        transaction.data?.hash
      );
    },
    onSuccess() {
      toastContext.addToast(
        ToastStatus.Success,
        "Successfully withdrawn",
        transaction.data?.hash
      );
      onSuccessCallback();
    },
  });
  return { confirmation, transaction };
}
