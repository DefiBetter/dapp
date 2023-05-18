import { useContractRead, useNetwork } from "wagmi";
import { contractAddresses } from "../static/contractAddresses";
import { ethers } from "ethers";
import DBMTSaleABI from "../static/ABI/DBMTSaleABI.json";
import { useAccount } from "wagmi"

export default function useUserReferralRewardPercentage() {
  const { chain } = useNetwork();
  const {address} = useAccount

  const { data } = useContractRead({
    address: contractAddresses[chain?.network]?.dbmtToken,
    abi: DBMTSaleABI,
    functionName: "getUserReferralRewardPercentage",
    args: [address],
    watch: true,
  });

  return data ? Number(data) : 0;
}
