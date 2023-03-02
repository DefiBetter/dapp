import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import LpStakingABI from "../static/ABI/LpStakingABI.json";
import { contractAddresses } from "../static/contractAddresses";
import { ToastStatus, useToast } from "../context/ToastContext";

export default function useClaimLP(poolId) {
  const { chain } = useNetwork();
  const toastContext = useToast();

  const preparation = usePrepareContractWrite({
    address: contractAddresses[chain?.network]?.lpStaking,
    abi: LpStakingABI,
    functionName: "claim",
    args: [poolId],
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
        "Successfuly claimed",
        transaction.data?.hash
      );
    },
  });
  return { confirmation, transaction };
}
