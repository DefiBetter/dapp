import {
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { contractAddresses } from "../static/contractAddresses";
import LimitedCapacityAirdropABI from "../static/ABI/LimitedCapacityAirdropABI.json";
import { ToastStatus, useToast } from "../context/ToastContext";

export default function useClaimBetterDrop(spotsLeft, onSuccessCallback) {
  const { chain } = useNetwork();
  const toastContext = useToast();

  const preparation = usePrepareContractWrite({
    address: contractAddresses[chain?.network]?.dbmtAirdrop,
    abi: LimitedCapacityAirdropABI,
    functionName: "claim",
    enabled: spotsLeft === 0,
    onError(err) {
      console.error(err);
    },
  });

  const transaction = useContractWrite(preparation.config);
  const confirmation = useWaitForTransaction({
    confirmations: 2,
    hash: transaction.data?.hash,
    onError(error) {
      console.error(error);
      toastContext.addToast(
        ToastStatus.Failed,
        "Failed to claim Airdrop",
        transaction.data?.hash
      );
    },
    onSuccess() {
      onSuccessCallback();
      toastContext.addToast(
        ToastStatus.Success,
        "Successfuly claimed Airdrop",
        transaction.data?.hash
      );
    },
  });
  return { preparation, confirmation, transaction };
}
