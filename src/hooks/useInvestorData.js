import { useContractRead, useNetwork } from "wagmi";
import { contractAddresses } from "../static/contractAddresses";
import ReferralSaleABI from "../static/ABI/ReferralSaleABI.json";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { readContract } from "@wagmi/core";

export async function investorData(address, chain) {
  const data = await readContract({
    address: contractAddresses[chain.network]?.dbmtSale,
    abi: ReferralSaleABI,
    functionName: "getInvestorData",
    args: [address],
  });
  return dataToRef(data);
}

function dataToRef(data) {
  return {
    ownBuysInGasToken: data
      ? ethers.utils.formatEther(data.ownBuysInGasToken)
      : 0,
    totalRaisedInGasToken: data
      ? ethers.utils.formatEther(data.totalRaisedInGasToken)
      : 0,
    totalReferralGainsInGasToken: data
      ? ethers.utils.formatEther(data.totalReferralGainsInGasToken)
      : 0,
    referralDebt: data ? ethers.utils.formatEther(data.referralDebt) : 0,
    whitelistedForReferralLevel: data
      ? Number(data.whitelistedForReferralLevel)
      : 0,
  };
}

export default function useInvestorData() {
  const { chain } = useNetwork();
  const { address } = useAccount();

  const { data } = useContractRead({
    address: contractAddresses[chain?.network]?.dbmtSale,
    abi: ReferralSaleABI,
    functionName: "getInvestorData",
    args: [address],
    watch: true,
  });

  return dataToRef(data);
}
