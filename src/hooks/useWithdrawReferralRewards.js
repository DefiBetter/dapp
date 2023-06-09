import {
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ToastStatus, useToast } from "../context/ToastContext";
import { contractAddresses } from "../static/contractAddresses";
import ReferralSaleABI from "../static/ABI/ReferralSaleABI.json";
import useFirework from "./useFireworks";

export default function useWithdrawReferralRewards() {
  const toastContext = useToast();
  const { chain } = useNetwork();
  const { firework } = useFirework();

  const preparation = usePrepareContractWrite({
    address: contractAddresses[chain?.network]?.dbmtSale,
    abi: ReferralSaleABI,
    functionName: "withdrawReferralRewards",
    onError(err) {
      console.error(err);
    },
  });

  const transaction = useContractWrite({
    ...preparation.config,
    onError(err) {
      console.log("tx error");
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
        "Failed to claim rewards",
        transaction.data?.hash
      );
    },
    onSuccess(data) {
      firework()
      toastContext.addToast(
        ToastStatus.Success,
        "Successfuly claimed rewards",
        transaction.data?.hash
      );
    },
  });
  return { confirmation, transaction };
}
