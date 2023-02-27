import {
  useAccount,
  useContractWrite,
  useNetwork,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi";
import { ethers } from "ethers";
import LpStakingABI from "../static/ABI/LpStakingABI.json";
import { contractAddresses } from "../static/contractAddresses";

export default function useStake(lpAmount, onSuccessCallback) {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const preparation = usePrepareContractWrite({
    address: contractAddresses[chain?.network]?.lpStaking,
    abi: LpStakingABI,
    functionName: "stake",
    args: [0, ethers.utils.parseEther(lpAmount.toString()), address],
  });

  const transaction = useContractWrite(preparation.config);
  const confirmation = useWaitForTransaction({
    confirmations: 2,
    hash: transaction.data?.hash,
    onSuccess() {
      // TODO: Add toast
      onSuccessCallback();
    },
    onError(error) {
      // TODO: Add toast
    },
  });
  return { confirmation, transaction };
}
