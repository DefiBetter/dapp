import {
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ToastStatus, useToast } from "../context/ToastContext";
import { ethers } from "ethers";
import { contractAddresses } from "../static/contractAddresses";
import DBMTSaleABI from "../static/ABI/DBMTSaleABI.json";
import useFirework from "./useFireworks";

export default function useDbmtBuy(buyAmount) {
  const toastContext = useToast();
  const { chain } = useNetwork();
  const { firework } = useFirework();

  const preparation = usePrepareContractWrite({
    address: contractAddresses[chain?.network]?.dbmtSale,
    abi: DBMTSaleABI,
    enabled: Number(buyAmount) > 0,
    functionName: "buy",
    overrides: {
      value: ethers.utils.parseEther(buyAmount),
    },
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
        "Failed to buy $DBMT",
        transaction.data?.hash
      );
    },
    onSuccess(data) {
      firework()
      toastContext.addToast(
        ToastStatus.Success,
        "Successfuly bought $DBMT",
        transaction.data?.hash
      );
    },
  });
  return { confirmation, transaction };
}
