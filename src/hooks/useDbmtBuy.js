import { useContractWrite, useNetwork, useWaitForTransaction } from "wagmi";
import { ToastStatus, useToast } from "../context/ToastContext";
import { ethers } from "ethers";
import { contractAddresses } from "../static/contractAddresses";

export default function useDbmtBuy(buyAmount) {
  const toastContext = useToast();
  const { chain } = useNetwork();

  const transaction = useContractWrite({
    address: contractAddresses[chain?.network]?.dbmtSale,
    abi: {},
    functionName: "buy",
    overrides: {
      value: ethers.utils.parseEther(buyAmount).toString(),
    },
  });

  const confirmation = useWaitForTransaction({
    confirmations: 2,
    hash: transaction.data?.hash,
    onError(error) {
      console.error(error);
      toastContext.addToast(
        ToastStatus.Failed,
        "Failed to buy DBMT",
        transaction.data?.hash
      );
    },
    onSuccess() {
      toastContext.addToast(
        ToastStatus.Success,
        "Successfuly bought DBMT",
        transaction.data?.hash
      );
    },
  });
  return { confirmation, transaction };
}
