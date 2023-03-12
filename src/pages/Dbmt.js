import { useEffect, useMemo, useState } from "react";
import { CountdownFormatted, trimNumber } from "../components/common/helper";
import { MdDoubleArrow } from "react-icons/md";
import { CgArrowLongRight } from "react-icons/cg";
import useDbmtPerEth from "../hooks/useDbmtPerEth";
import useDbmtPrice from "../hooks/useDbmtPrice";
import useDbmtSupplyLeft from "../hooks/useDbmtSupplyLeft";
import useDbmtStartTime from "../hooks/useDbmtStartTime";
import useDbmtDuration from "../hooks/useDbmtDuration";
import useDbmtBuy from "../hooks/useDbmtBuy";
import DBButton from "../components/common/DBButton";
import Loader from "../components/common/Loader";
import useNativeBalance from "../hooks/useNativeBalance";
import { BsCoin, BsWallet2 } from "react-icons/bs";
import { GiCoins } from "react-icons/gi";
import AddToWallet from "../components/common/AddToWallet";
import PageTitle from "../components/common/PageTitle";

export default function Dbmt() {
  const [buyAmount, setBuyAmount] = useState("0");
  const [bnbPrice, setBnbPrice] = useState(0);
  // current price
  const dbmtPerEth = useDbmtPerEth(buyAmount);
  const { basePrice, currentPrice } = useDbmtPrice();

  // supply left
  const supplyLeft = useDbmtSupplyLeft();
  const startTime = useDbmtStartTime();
  const duration = useDbmtDuration();

  const buyWrite = useDbmtBuy(buyAmount);
  const userGasBalance = useNativeBalance();

  async function fetchBnbPrice() {
    try {
      const bnbPriceData = await (
        await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd"
        )
      ).json();
      setBnbPrice(bnbPriceData["binancecoin"].usd);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    fetchBnbPrice();
  }, []);

  const isSale = useMemo(
    () => basePrice - currentPrice !== 0,
    [basePrice, currentPrice]
  );

  return (
    <>
      {isSale && (
        <div className="z-50 fixed left-0 bottom-0 w-full bg-gradient-to-r from-red-400 to-orange-500 flex justify-center items-center">
          <div className="absolute left-2 lg:left-44">
            <MdDoubleArrow
              size={30}
              className="text-white animate-slide-right"
            />
          </div>
          <div className="absolute right-2 lg:right-44 rotate-180">
            <MdDoubleArrow
              size={30}
              className="text-white animate-slide-right"
            />
          </div>
          <div className="p-2 w-full text-white text-2xl flex justify-center gap-2 md:gap-10 flex-col sm:flex-row items-center">
            <div>
              <span className="font-bold">$DBMT</span> Price increases in
            </div>
            <div className="font-bold text-3xl ">
              <CountdownFormatted ms={startTime + duration} />
            </div>
          </div>
        </div>
      )}

      <div
        className={`bg-db-light dark:bg-db-dark-nav transition-colors rounded-md p-2 md:p-4 ${
          isSale ? "mb-16 md:mb-12 lg:mb-12" : "mb-0"
        } `}
      >
        <PageTitle title={'$DBMT'} fancyTitle={'Sale'} />
        <div className="mt-4 flex justify-center">
          <div className="z-10 w-full p-4 rounded-lg dark:shadow-inner shadow-sm shadow-db-cyan-process dark:shadow-black bg-white dark:bg-db-dark flex gap-4 flex-col lg:flex-row">
            <div className="p-2 w-full lg:w-1/2">
              <h2 className="font-bold text-xl">
                DeFiBetter Milestone Reward Program
              </h2>
              <div className="flex flex-col mt-3 ml-3 gap-2">
                <div className="flex items-start gap-4">
                  <span>💦</span>
                  $DBMT is the first and possibly the most lucrative way to
                  profit from DeFiBetter's growth.
                </div>
                <div className="flex items-start gap-4">
                  <span>💦</span> The higher our cumulative volume gets over
                  time, the more valuable your $DBMT becomes.
                </div>
                <div className="flex items-start gap-4">
                  <span>💦</span> Burn your DBMT for a sizeable early reward or
                  hold it, keep drawing attention to the protocol and watch your
                  wealth grow exponentially!
                </div>
                <div className="flex items-start gap-4">
                  <span>💦</span> The more people decide to burn, the higher the
                  rewards for HODLers.
                </div>
                <div className="flex items-start gap-4">
                  <span>💦</span> Secure an exclusive role in our Discord server
                  for $DMBT holders, discuss ideas and strategies & get access
                  to alpha earlier than everyone else.
                </div>
              </div>
              <div className="mt-4">
                Read more about how $DBMT works on our Medium page:{" "}
                <a
                  href="https://medium.com/@defibetter"
                  target="_blank"
                  rel="noreferrer"
                  className="text-db-cyan-process"
                >
                  https://medium.com/@defibetter
                </a>
              </div>
            </div>
            <div className="w-full lg:w-2/3 bg-db-light dark:bg-db-dark-nav rounded-lg overflow-hidden">
              <div className="w-full bg-db-cyan-process pb-2">
                <div className="flex justify-center items-center gap-5 ">
                  {isSale && (
                    <div className="text-2xl font-bold text-white relative pt-2">
                      ${basePrice}
                      <div className="absolute bottom-[30%] -left-[5%] w-[110%] h-1 bg-gradient-to-r from-red-400 to-orange-500"></div>
                    </div>
                  )}
                  {isSale && (
                    <div className="pt-2">
                      <CgArrowLongRight size={40} className="text-white" />
                    </div>
                  )}
                  <div className="font-bold text-transparent text-4xl bg-clip-text bg-gradient-to-b from-yellow-100 to-yellow-300">
                    ${currentPrice}
                  </div>
                </div>
                {isSale && (
                  <div className="text-center text-xs italic text-white">
                    Limited time offer only
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between gap-4 flex-wrap">
                  <div className="h-14 flex w-full flex-1 items-center gap-2 p-2 bg-white dark:bg-db-dark-lighter justify-center shadow-sm shadow-db-cyan-process dark:shadow-black rounded-lg">
                    <BsWallet2 size={20} />
                    <div>Balance</div>
                    <div className="font-bold">{userGasBalance} BNB</div>
                  </div>
                  <div className="h-14 flex w-full flex-1 items-center gap-2 p-2 bg-white dark:bg-db-dark-lighter justify-center shadow-sm shadow-db-cyan-process dark:shadow-black rounded-lg">
                    <GiCoins size={20} />
                    <div>Supply left</div>
                    <div className="font-bold">
                      {trimNumber(+supplyLeft, 4, "dp")}
                    </div>
                  </div>
                  <div className="h-14 flex w-full flex-1 items-center gap-2 p-2 bg-white dark:bg-db-dark-lighter justify-center shadow-sm shadow-db-cyan-process dark:shadow-black rounded-lg">
                    <GiCoins size={20} />
                    <div>Mininum</div>
                    <div className="font-bold">
                      $100{" "}
                      <span className="text-xs">
                        ({(100 / bnbPrice).toFixed(3)} BNB)
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-center w-full">
                  <div className="w-full gap-2 flex">
                    <div className="w-32 flex justify-center items-center">
                      <span className="font-fancy text-xl pt-2">Spend</span>
                    </div>
                    <div className="h-14 w-full shadow-inner shadow-db-cyan-process dark:shadow-black bg-white dark:bg-db-dark-lighter rounded-lg flex items-center px-4">
                      <div
                        onClick={() => {
                          setBuyAmount(userGasBalance.toString());
                        }}
                        className="cursor-pointer rounded-md flex gap-2 justify-center items-center h-9 pb-0.5 px-3 border-[1px] border-db-cyan-process text-db-cyan-process hover:bg-db-cyan-process hover:text-white transition-colors"
                      >
                        MAX
                      </div>
                      <input
                        value={Number(buyAmount) !== 0 ? buyAmount : ""}
                        onChange={(e) => {
                          const val = e.target.value || "0";
                          setBuyAmount(val);
                        }}
                        type={"number"}
                        min={0}
                        className="px-4 text-center h-10 w-full focus:ring-0 focus:outline-none rounded-lg bg-white dark:bg-db-dark-lighter"
                        placeholder="BNB amount"
                      />
                      <div className="">BNB</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-center w-full">
                  <div className="w-full gap-2 flex">
                    <div className="w-32 flex justify-center items-center">
                      <span className="font-fancy text-xl pt-2">to get</span>
                    </div>

                    <div className="h-14 w-full shadow-sm shadow-db-cyan-process dark:shadow-black bg-db-light dark:bg-db-dark-nav rounded-lg flex items-center px-4">
                      <input
                        disabled
                        className="pl-24 px-4 text-center h-10 w-full rounded-lg bg-db-light dark:bg-db-dark-nav"
                        placeholder="Enter Amount"
                        value={
                          dbmtPerEth !== 0 ? trimNumber(dbmtPerEth, 9, "dp") : 0
                        }
                      />
                      <div className="">DBMT</div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-4 items-center flex-col md:flex-row justify-center">
                  <div className="w-full md:w-2/3">
                    <DBButton
                      onClick={() => {
                        if (buyWrite.transaction.write) {
                          buyWrite.transaction.write();
                        }
                      }}
                    >
                      {buyWrite.confirmation.isLoading ? (
                        <Loader text="Buying" />
                      ) : (
                        "Buy"
                      )}
                    </DBButton>
                  </div>
                  <div className="w-full md:w-1/3">
                    <AddToWallet asset="DBMT" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
