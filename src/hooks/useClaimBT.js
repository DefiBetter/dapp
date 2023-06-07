import {
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import BtStakingABI from "../static/ABI/BtStakingABI.json";
import { contractAddresses } from "../static/contractAddresses";
import { ToastStatus, useToast } from "../context/ToastContext";

export default function useClaimBT() {
  const { chain } = useNetwork();
  const toastContext = useToast();

  const preparation = usePrepareContractWrite({
    address: contractAddresses[chain?.network]?.btStaking,
    abi: BtStakingABI,
    functionName: "claim",
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
