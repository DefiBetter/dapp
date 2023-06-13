import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ToastStatus, useToast } from "../context/ToastContext";
import { ethers } from "ethers";
import { contractAddresses } from "../static/contractAddresses";
import ReferralSaleABI from "../static/ABI/ReferralSaleABI.json";
import useFirework from "./useFireworks";
import { investorData } from "./useInvestorData";
import { updateInvestor } from "./useInvestors";

export default function useDbmtBuy(buyAmount, referral) {
  const toastContext = useToast();
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { firework } = useFirework();

  const preparation = usePrepareContractWrite({
    address: contractAddresses[chain?.network]?.dbmtSale,
    abi: ReferralSaleABI,
    enabled: Number(buyAmount) > 0,
    functionName: "buy",
    args: [referral],
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
      firework();
      if (address !== referral) {
        investorData(referral, chain).then((data) => {
          updateInvestor(referral, data);
        });
      }
      investorData(address, chain).then((data) => {
        updateInvestor(address, data);
      });
      toastContext.addToast(
        ToastStatus.Success,
        "Successfuly bought $DBMT",
        transaction.data?.hash
      );
    },
  });

  return { confirmation, transaction };
}
