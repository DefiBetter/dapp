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

  console.log('address = ' + address)
  const preparation = usePrepareContractWrite({
    address: contractAddresses[chain?.network]?.dbmtAirdrop,
    abi: LimitedCapacityAirdropABI,
    args: [address],
    functionName: "whitelistAddress",
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
        "Failed to enter Airdrop",
        transaction.data?.hash
      );
    },
    onSuccess() {
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
