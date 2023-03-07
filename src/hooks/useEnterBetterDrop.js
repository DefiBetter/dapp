import {
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { contractAddresses } from "../static/contractAddresses";
import LimitedCapacityAirdropABI from "../static/ABI/LimitedCapacityAirdropABI.json";
import { ToastStatus, useToast } from "../context/ToastContext";

export default function useEnterBetterDrop(address, onSuccessCallback) {
  const { chain } = useNetwork();
  const toastContext = useToast();

  const preparation = usePrepareContractWrite({
    address: contractAddresses[chain?.network]?.dbmtAirdrop,
    abi: LimitedCapacityAirdropABI,
    args: [address],
    functionName: "whitelistAddress",
    onError(err) {
      console.log('error in prep')
      console.error(err);
    },
  });

  const transaction = useContractWrite({
    ...preparation.config,
    onError(err) {
      console.log('tx error')
      console.error(err);
    },
  });
  const confirmation = useWaitForTransaction({
    confirmations: 2,
    hash: transaction.data?.hash,
    onError(error) {
      console.error(error);
      toastContext.addToast(
        ToastStatus.Failed,
        "Failed to enter Airdrop",
        transaction.data?.hash
      );
    },
    onSuccess(data) {
      onSuccessCallback();
      toastContext.addToast(
        ToastStatus.Success,
        "Successfuly entered Airdrop",
        transaction.data?.hash
      );
    },
  });
  return { confirmation, transaction };
}
