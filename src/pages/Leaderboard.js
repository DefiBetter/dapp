import PageTitle from "../components/common/PageTitle";
import { contractAddresses } from "../static/contractAddresses";
import { useNetwork } from "wagmi";
import useSymbol from "../hooks/useSymbol";
import { useAccount } from "wagmi";
import { row } from "mathjs";
import { BigNumber, ethers } from "ethers";
import useDbmtPrice from "../hooks/useDbmtPrice";
import { GiPodiumSecond, GiPodiumThird, GiPodiumWinner } from "react-icons/gi";
import { BiLinkExternal } from "react-icons/bi";
import { useGetInvestors } from "../hooks/useInvestors";

export default function Leaderboard() {
  const { chain } = useNetwork();
  const tokenSymbol = useSymbol(contractAddresses[chain?.network]?.dbmtToken);
  const { basePrice } = useDbmtPrice();
  const investors = useGetInvestors();

  function bnbToDBMT(bnb) {
    if (basePrice && Number(bnb) > 0) {
      return Number(bnb) / basePrice;
    }
    return 0;
  }

  return (
    <>
      <div
        className={`bg-db-light dark:bg-db-dark-nav transition-colors rounded-lg p-2 md:p-4 min-h-[86vh] border-b-2 border-db-cyan-process mb-0`}
      >
        <PageTitle title={tokenSymbol} fancyTitle={"Leaderboard"} />

        <div className="mt-2 md:mt-4 flex flex-col justify-center items-center gap-4">
          <div className="w-full lg:w-2/3">
            <div
              className={`w-full bg-white dark:bg-db-dark rounded-lg overflow-hidden p-4`}
            >
              <table className="w-full text-left table-auto">
                <thead className="text-xs uppercase">
                  <tr>
                    <th className="w-[40%]"></th>
                    <th scope="col" className="px-6 py-3 text-right w-[20%]">
                      Bought
                    </th>
                    <th scope="col" className="px-6 py-3 text-right w-[20%]">
                      Total Raised
                    </th>
                    <th scope="col" className="px-6 py-3 text-right w-[20%]">
                      Profits from Raised
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {!investors
                    ? [...Array(3)].map((_, index) => (
                        <tr
                          key={row.address}
                          className={`${
                            index % 2 === 0
                              ? "bg-db-cyan-process/10 dark:bg-db-dark-input/30 "
                              : " bg-db-light dark:bg-db-dark-input/50"
                          }`}
                        >
                          <th scope="row" className="px-6 py-4 flex">
                            <div class="h-4 bg-gray-700 w-48 animate-pulse"></div>
                          </th>
                          <td className="px-6 py-4 ">
                            <div class="h-4 bg-gray-700 w-20 ml-auto animate-pulse"></div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div class="h-4 bg-gray-700 w-20 ml-auto animate-pulse"></div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div class="h-4 bg-gray-700 w-20 ml-auto animate-pulse"></div>
                          </td>
                        </tr>
                      ))
                    : investors.map((row, index) => (
                        <tr
                          key={row.address}
                          className={`${
                            index % 2 === 0
                              ? "bg-db-cyan-process/10 dark:bg-db-dark-input/30 "
                              : " bg-db-light dark:bg-db-dark-input/50"
                          }`}
                        >
                          <th scope="row" className="px-6 py-4 flex gap-4">
                            {index === 0 && (
                              <GiPodiumWinner
                                size={25}
                                className="text-orange-400"
                              />
                            )}
                            {index === 1 && (
                              <GiPodiumSecond
                                size={25}
                                className="text-neutral-300"
                              />
                            )}
                            {index === 2 && (
                              <GiPodiumThird
                                size={25}
                                className="text-orange-800"
                              />
                            )}
                            <a
                              className="flex gap-2 items-center"
                              href={`https://debank.com/profile/${row.address}`}
                              target="_blank"
                              rel="noreferrer"
                            >
                              {`${row.address.slice(
                                0,
                                5
                              )}...${row.address.slice(-5)}`}
                              <BiLinkExternal size={15} />
                            </a>
                          </th>
                          <td className="px-6 py-4 text-right">
                            {bnbToDBMT(row.ownBuysInGasToken).toFixed(3)}{" "}
                            {tokenSymbol}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {row.totalRaisedInGasToken} BNB
                          </td>
                          <td className="px-6 py-4 text-right">
                            {row.totalReferralGainsInGasToken} BNB
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
