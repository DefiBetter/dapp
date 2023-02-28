import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ethers } from "ethers";
import StrategyVaultABI from "../static/ABI/StrategyVaultABI.json";

export default function useVaultWithdraw(vault, amount, onSuccessCallback) {
  const preparation = usePrepareContractWrite({
    address: vault,
    abi: StrategyVaultABI,
    functionName: "withdraw",
    enabled: amount > 0,
    args: [ethers.utils.parseEther(amount.toString())],
  });

  const transaction = useContractWrite(preparation.config);
  const confirmation = useWaitForTransaction({
    confirmations: 2,
    hash: transaction.data?.hash,
    onSuccess() {
      // TODO: Add toast
      onSuccessCallback();
    },
    onError(error) {
      // TODO: Add toast
    },
  });
  return { confirmation, transaction };
}
