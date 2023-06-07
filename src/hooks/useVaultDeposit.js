import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ethers } from "ethers";
import StrategyVaultABI from "../static/ABI/StrategyVaultABI.json";
import { useToast } from "../context/ToastContext";
import { ToastStatus } from "../context/ToastContext";

export default function useVaultDeposit(vault, amount, onSuccessCallback) {
  const toastContext = useToast();
  const preparation = usePrepareContractWrite({
    address: vault,
    abi: StrategyVaultABI,
    functionName: "deposit",
    enabled: amount > 0,
    overrides: {
      value: amount ? ethers.utils.parseEther(amount.toString()) : "0",
    },
    onError(err) {
      console.error(err)
    }
  });

  const transaction = useContractWrite(preparation.config);
  const confirmation = useWaitForTransaction({
    confirmations: 2,
    hash: transaction.data?.hash,
    onError(error) {
      console.error(error);
      toastContext.addToast(
        ToastStatus.Failed,
        "Failed to deposit",
        transaction.data?.hash
      );
    },
    onSuccess() {
      toastContext.addToast(
        ToastStatus.Success,
        "Successfully deposited",
        transaction.data?.hash
      );
      onSuccessCallback();
    },
  });
  return { confirmation, transaction };
}
