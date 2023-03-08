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

export default function useDbmtBuy(buyAmount) {
  const toastContext = useToast();
  const { chain } = useNetwork();

  const preparation = usePrepareContractWrite({
    address: contractAddresses[chain?.network]?.dbmtSale,
    abi: DBMTSaleABI,
    functionName: "buy",
    overrides: {
      value: ethers.utils.parseEther(buyAmount).toString(),
    },
    onError(err) {
      console.error(err)
    }
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
        "Failed to enter Airdrop",
        transaction.data?.hash
      );
    },
    onSuccess(data) {
      toastContext.addToast(
        ToastStatus.Success,
        "Successfuly entered Airdrop",
        transaction.data?.hash
      );
    },
  });
  return { confirmation, transaction };
}
