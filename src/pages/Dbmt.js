import { useEffect, useState } from "react";
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
import useAddToWallet from "../hooks/useAddToWallet";

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

  const addToWallet = useAddToWallet();

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
  return (
    <>
      <div className="z-50 fixed left-0 bottom-0 w-full bg-gradient-to-r from-red-400 to-orange-500 flex justify-center items-center">
        <div className="absolute left-2 lg:left-44">
          <MdDoubleArrow size={30} className="text-white animate-slide-right" />
        </div>
        <div className="absolute right-2 lg:right-44 rotate-180">
          <MdDoubleArrow size={30} className="text-white animate-slide-right" />
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

      <div className="relative bg-db-background border-[3px] border-db-cyan-process mb-24 md:mb-14 lg:mb-14">
        <div className="pb-5 px-4">
          <div className="relative shadow-db m-auto w-full md:w-1/2 mt-5 bg-white border-2 border-db-cyan-process rounded-2xl p-4">
            <div className="flex justify-center text-5xl">
              $DBMT
              <span className="font-bold mt-7 font-fancy text-5xl text-db-cyan-process">
                Sale 💦
              </span>
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-5 md:flex-row m-auto w-full mt-5 p-4 bg-white border-2 border-db-cyan-process shadow-db rounded-2xl">
            <div className="p-2 bg-white w-full md:w-1/2">
              <h2 className="font-bold text-xl">
                DeFiBetter Milestone Reward Program
              </h2>
              <div className="flex-col mt-3 ml-3">
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
              <div className="mt-3">
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
            <div className="w-full md:w-2/3 bg-white border-2 border-db-cyan-process rounded-2xl shadow-db ">
              <div className="rounded-t-xl w-full bg-db-cyan-process pb-2">
                <div className="flex justify-center items-center gap-5 ">
                  <div className="text-2xl font-bold text-white relative pt-2">
                    {(basePrice / bnbPrice).toFixed(2)} BNB
                    <div className="absolute bottom-[30%] -left-[5%] w-[110%] h-1 bg-gradient-to-r from-red-400 to-orange-500"></div>
                  </div>
                  <div className="pt-2">
                    <CgArrowLongRight size={40} className="text-white" />
                  </div>
                  <div className="font-bold text-transparent text-4xl bg-clip-text bg-gradient-to-b from-yellow-100 to-yellow-300">
                    {(currentPrice / bnbPrice).toFixed(2)} BNB
                  </div>
                </div>
                <div className="text-center text-xs italic text-white">
                  Limited time offer only
                </div>
              </div>
              <div className="p-4">
                <div className="flex flex-col lg:flex-row justify-between items-center gap-2">
                  <div className="flex justify-between w-full items-center">
                    <div className="flex-1 shadow-db text-center font-bold bg-db-french-sky p-3 border-[1px] border-black rounded-lg">
                      BNB Balance
                    </div>
                    <div className="flex-1 text-center">{userGasBalance}</div>
                  </div>

                  <div className="flex justify-between w-full items-center">
                    <div className="flex-1 shadow-db text-center font-bold bg-db-french-sky p-3 border-[1px] border-black rounded-lg">
                      Supply Left
                    </div>
                    <div className="flex-1 text-center">
                      {trimNumber(+supplyLeft, 4, "dp")}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-between w-full items-center lg:w-1/2">
                  <div className="flex-1 shadow-db text-center font-bold bg-db-french-sky p-3 border-[1px] border-black rounded-lg">
                    Min Purchase
                  </div>
                  <div className="flex-1 text-center">
                    {(100 / bnbPrice).toFixed(3)} BNB
                  </div>
                </div>
                <div className="mt-4 flex items-center w-full">
                  <div className="font-fancy text-db-cyan-process w-24 text-center text-xl pt-1">
                    buy
                  </div>
                  <div className="w-full flex items-center p-2 justify-center bg-db-background rounded-lg shadow-db">
                    <div className="text-black text-sm flex-1 text-center">
                      {trimNumber(dbmtPerEth, 9, "dp")}
                    </div>

                    <div className="text-black font-bold w-12 text-center">
                      DBMT
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center w-full">
                  <div className="font-fancy text-db-cyan-process w-24 text-center text-xl pt-1">
                    for
                  </div>
                  <div className="w-full flex items-center p-2 justify-center bg-db-background rounded-lg shadow-db">
                    <input
                      onChange={(e) => {
                        const val = e.target.value || "0";
                        setBuyAmount(val);
                      }}
                      type={"number"}
                      min={0}
                      placeholder="Amount"
                      className="text-black text-sm flex-1"
                    />
                    <div className="relative text-black font-bold w-12 text-center">
                      <div>BNB</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-2 items-center flex-col md:flex-row justify-center">
                  <div className="w-full md:w-2/3">
                    <DBButton
                      onClick={() => {
                        console.log("a");
                        if (buyWrite.transaction.write) {
                          console.log("b");
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
                    <button
                      className="w-full bg-db-background border-[1px] h-10 border-black shadow-db rounded-lg text-sm flex items-center justify-center gap-2 "
                      onClick={() => addToWallet("DBMT")}
                    >
                      <img
                        src={require("../../src/static/image/dbmt.png")}
                        width={30}
                        height={30}
                        alt="dbmt logo"
                      />
                      Add $DBMT to wallet
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="z-0 absolute h-60 top-10 left-[2%] hidden md:block">
          <img
            alt="faucet"
            className="h-full z-0"
            src={require("../static/image/open-vault-clipart.svg").default}
          ></img>
        </div>
      </div>
    </>
  );
}
