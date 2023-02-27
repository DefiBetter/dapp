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

export default function useStakeLP(poolId, lpAmount, onSuccessCallback) {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const preparation = usePrepareContractWrite({
    address: contractAddresses[chain?.network]?.lpStaking,
    abi: LpStakingABI,
    functionName: "stake",
    args: [poolId, ethers.utils.parseEther(lpAmount.toString()), address],
  });

  const transaction = useContractWrite(preparation.config);
  const confirmation = useWaitForTransaction({
    confirmations: 2,
    hash: transaction.data?.hash,
    onSuccess() {
      // TODO: Add toast
      console.log('[useStakeLP] success:')

      onSuccessCallback();
    },
    onError(error) {
      console.log('[useStakeLP] error:')
      console.error(error)
      // TODO: Add toast
    },
  });
  return { confirmation, transaction };
}
