import { useContractRead, useNetwork } from "wagmi";
import { contractAddresses } from "../static/contractAddresses";
import ReferralSaleABI from "../static/ABI/ReferralSaleABI.json";
import { useAccount } from "wagmi";

export default function useUserReferralRewardPercentage() {
  const { chain } = useNetwork();
  const { address } = useAccount();

  const { data } = useContractRead({
    address: contractAddresses[chain?.network]?.dbmtSale,
    abi: ReferralSaleABI,
    functionName: "getUserReferralRewardPercentage",
    args: [address],
    watch: true,
  });

  return data ? Number(data) / 100 : 0;
}
