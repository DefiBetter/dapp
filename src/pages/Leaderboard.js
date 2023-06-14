import PageTitle from "../components/common/PageTitle";
import { contractAddresses } from "../static/contractAddresses";
import { useNetwork } from "wagmi";
import useSymbol from "../hooks/useSymbol";
import { row } from "mathjs";
import useDbmtPrice from "../hooks/useDbmtPrice";
import { GiPodiumSecond, GiPodiumThird, GiPodiumWinner } from "react-icons/gi";
import { BiLinkExternal } from "react-icons/bi";
import { useGetInvestors } from "../hooks/useInvestors";
import { motion } from "framer-motion";

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
              <div className="hidden md:flex justify-between items-center text-xs uppercase contrast-50">
                <div className="w-1/4"></div>

                <div className="px-6 py-3 text-right w-1/4 whitespace-nowrap">
                  Total Raised
                </div>
                <div className="px-6 py-3 text-right w-1/4 whitespace-nowrap">
                  Bought
                </div>
                <div className="px-6 py-3 text-right w-1/4 whitespace-nowrap">
                  Profits from Raised
                </div>
              </div>

              <div className="relative w-full text-left flex flex-col gap-2">
                {!investors
                  ? [...Array(3)].map((_, index) => (
                      <motion.div
                        initial={{ opacity: 0, marginTop: "50px" }}
                        animate={{ opacity: 1, marginTop: "0" }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        key={row.address}
                        className={`${
                          index % 2 === 0
                            ? "bg-db-cyan-process/10 dark:bg-db-dark-input/30 "
                            : " bg-db-light dark:bg-db-dark-input/50"
                        } w-full rounded-lg flex flex-col md:flex-row justify-between items-center`}
                      >
                        <div className="px-6 py-4 flex">
                          <div class="h-4 bg-gray-700 w-48 animate-pulse"></div>
                        </div>
                        <div className="px-6 py-4 ">
                          <div class="h-4 bg-gray-700 w-20 ml-auto animate-pulse"></div>
                        </div>
                        <div className="px-6 py-4 text-right">
                          <div class="h-4 bg-gray-700 w-20 ml-auto animate-pulse"></div>
                        </div>
                        <div className="px-6 py-4 text-right">
                          <div class="h-4 bg-gray-700 w-20 ml-auto animate-pulse"></div>
                        </div>
                      </motion.div>
                    ))
                  : investors.map((row, index) => (
                      <motion.div
                        initial={{ opacity: 0, marginTop: "50px" }}
                        animate={{ opacity: 1, marginTop: "0" }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        key={row.address}
                        className={`${
                          index % 2 === 0
                            ? "bg-db-cyan-process/10 dark:bg-db-dark-input/30 "
                            : " bg-db-light dark:bg-db-dark-input/50"
                        } w-full rounded-lg flex flex-col md:flex-row justify-between items-center`}
                      >
                        <div className="w-full md:w-1/4 px-6 py-2 md:py-4 flex gap-4">
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
                            {`${row.address.slice(0, 5)}...${row.address.slice(
                              -5
                            )}`}
                            <BiLinkExternal size={15} />
                          </a>
                        </div>

                        <div className="w-full md:w-1/4 px-6 py-2 md:py-4 text-right flex justify-between md:justify-end">
                          <div className="md:hidden">TOTAL RAISED</div>
                          {row.totalRaisedInGasToken} BNB
                        </div>
                        <div className="w-full md:w-1/4 px-6 py-2 md:py-4 text-right flex justify-between md:justify-end">
                          <div className="md:hidden">BOUGHT</div>
                          {bnbToDBMT(row.ownBuysInGasToken).toFixed(3)}{" "}
                          {tokenSymbol}
                        </div>
                        <div className="w-full md:w-1/4 px-6 py-2 md:py-4 text-right flex justify-between md:justify-end">
                          <div className="md:hidden">PROFITS FROM RAISED</div>
                          {row.totalReferralGainsInGasToken} BNB
                        </div>
                      </motion.div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
