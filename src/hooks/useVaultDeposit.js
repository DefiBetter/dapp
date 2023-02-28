import {
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ethers } from "ethers";
import StrategyVaultABI from "../static/ABI/StrategyVaultABI.json";

export default function useVaultDeposit(vault, amount, onSuccessCallback) {
  console.log("amount = " + amount);
  console.log("vault = " + vault);
  const preparation = usePrepareContractWrite({
    address: vault,
    abi: StrategyVaultABI,
    functionName: "deposit",
    enabled: amount > 0,
    overrides: {
      value: amount ? ethers.utils.parseEther(amount.toString()) : "0",
    },
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
