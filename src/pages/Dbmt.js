import { useEffect, useMemo, useState } from "react";
import { CountdownFormatted, trimNumber } from "../components/common/helper";
import { MdDoubleArrow } from "react-icons/md";
import { CgArrowLongRight } from "react-icons/cg";
import useDbmtPerEth from "../hooks/useDbmtPerEth";
import useEthPerDbmt from "../hooks/useEthPerDbmt";
import useDbmtPrice from "../hooks/useDbmtPrice";
import useDbmtSupplyLeft from "../hooks/useDbmtSupplyLeft";
import useDbmtStartTime from "../hooks/useDbmtStartTime";
import useDbmtDuration from "../hooks/useDbmtDuration";
import useDbmtBuy from "../hooks/useDbmtBuy";
import DBButton from "../components/common/DBButton";
import Loader from "../components/common/Loader";
import useNativeBalance from "../hooks/useNativeBalance";
// import { AiOutlineCopy } from "react-icons/ai";
import { GiTwoCoins, GiWallet, GiPriceTag } from "react-icons/gi";
import AddToWallet from "../components/common/AddToWallet";
import PageTitle from "../components/common/PageTitle";
import { contractAddresses } from "../static/contractAddresses";
import { useNetwork } from "wagmi";
import useDmbtMinPayment from "../hooks/useDmbtMinPayment";
import ContainerStats from "../components/common/ContainerStats.js";
import useSymbol from "../hooks/useSymbol";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useAccount } from "wagmi";
import { AiFillCopy, AiOutlineInfoCircle } from "react-icons/ai";
import useWithdrawReferralRewards from "../hooks/useWithdrawReferralRewards";
import useUserReferralRewardPercentage from "../hooks/useUserReferralRewardPercentage";
import useInvestor from "../hooks/useInvestor";

export default function Dbmt() {
  const queryParameters = new URLSearchParams(window.location.search);
  const referral = queryParameters.get("ref");

  const { address } = useAccount();
  const [input, setInput] = useState();
  const [buyAmount, setBuyAmount] = useState("0");
  const [dbmtBuyAmount, setDbmtBuyAmount] = useState("0");
  const [toggleReadMore, setToggleReadMore] = useState(false);
  const [showReferralInfo, setShowReferralInfo] = useState(false);
  const [successCopy, setSuccessCopy] = useState(false);

  useEffect(() => {
    if (input === 0 && ethPerDbmt) {
      setBuyAmount(ethPerDbmt);
    } else if (input === 1 && dbmtPerEth) {
      setDbmtBuyAmount(dbmtPerEth);
    }
  }, [dbmtPerEth, ethPerDbmt]);

  const { basePrice, currentPrice } = useDbmtPrice();
  const dbmtPerEth = useDbmtPerEth(buyAmount);
  const ethPerDbmt = useEthPerDbmt(dbmtBuyAmount);
  const supplyLeft = useDbmtSupplyLeft();
  const startTime = useDbmtStartTime();
  const duration = useDbmtDuration();
  const { chain } = useNetwork();
  const minAmount = useDmbtMinPayment();
  const buyWrite = useDbmtBuy(buyAmount, referral);
  const claim = useWithdrawReferralRewards();
  const userPercent = useUserReferralRewardPercentage();
  const investorData = useInvestor();

  const userGasBalance = useNativeBalance();
  const tokenSymbol = useSymbol(contractAddresses[chain?.network]?.dbmtToken);

  const isSale = useMemo(
    () => basePrice && currentPrice && basePrice !== currentPrice,
    [basePrice, currentPrice]
  );

  const nativeGasToken = contractAddresses[chain?.network]?.nativeGas;

  //1678802400
  // const timeStop = 1678802400;
  // const timeLeft = new Date(timeStop * 1000) - new Date();

  // const fireworks = useFirework();

  // const [playedConfetti, setPlayedConfetti] = useState(false);

  // const [shouldPlayConfettis, setShouldPlayConfettis] = useState(false)

  // useEffect(() => {
  //   if (timeLeft < 0 && playedConfetti === false && shouldPlayConfettis === true) {
  //     setPlayedConfetti(true);
  //     fireworks.firework();
  //   }
  // }, [timeLeft]);

  // useEffect(() => {
  //   if (timeLeft > 0) {
  //     setShouldPlayConfettis(true)
  //   }
  // }, [])

  return (
    <>
      {/* {timeLeft > 0 && (
        <div className="frosted z-50 fixed top-0 left-0 h-screen w-screen">
          <div className="gap-4 mt-24 flex flex-col justify-center items-center font-bold text-yellow-300 text-[5rem] md:text-[8rem] lg:text-[12rem]">
            <div>
              <CountdownFormatted
                ms={(Date.now() + (timeStop - Date.now())) * 1000}
              />
            </div>
            <div className="flex gap-3 items-center">
              <a
                target="_blank"
                rel="noreferrer"
                href="https://discord.gg/DSDXSXf6Ub"
              >
                <img
                  className="w-10 h-10"
                  src={require("../static/image/discord-logo.png")}
                />
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://t.me/+2z4mDnFAnjxiMWJl"
              >
                <img
                  className="w-10 h-10"
                  src={require("../static/image/telegram-logo.png")}
                />
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://twitter.com/defi_better"
              >
                <img
                  className="w-10 h-10"
                  src={require("../static/image/twitter-logo.png")}
                />
              </a>
              <a
                target="_blank"
                rel="noreferrer"
                href="https://medium.com/@defibetter"
              >
                <img
                  className="w-10 h-10"
                  src={require("../static/image/medium-logo.png")}
                />
              </a>
            </div>
          </div>
        </div>
      )} */}

      {isSale && (
        <div className="z-40 fixed left-0 bottom-0 w-full bg-gradient-to-r from-red-400 to-orange-500 flex justify-center items-center">
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
              <CountdownFormatted ms={(startTime + duration) * 1000} />
            </div>
          </div>
        </div>
      )}

      <div
        className={`bg-db-light dark:bg-db-dark-nav transition-colors rounded-lg p-2 md:p-4 min-h-[86vh] border-b-2 border-db-cyan-process ${
          isSale ? "mb-16 md:mb-12 lg:mb-12" : "mb-0"
        } `}
      >
        <PageTitle title={tokenSymbol} fancyTitle={"Sale"} />

        <div className="mt-2 md:mt-4 flex flex-col justify-center items-center gap-4">
          <div
            className={`w-full lg:w-2/3 ${
              toggleReadMore === true
                ? "max-h-[600px] md:max-h-[380px] lg:max-h-[400px]"
                : "max-h-14"
            }  bg-white dark:bg-db-dark rounded-lg transition-all border-b-2 border-db-cyan-process`}
          >
            <div
              className="w-full h-14 flex justify-between px-2 md:px-4 items-center cursor-pointer"
              onClick={() => setToggleReadMore(!toggleReadMore)}
            >
              <div>Read more about DeFiBetter Milestone Reward Program</div>
              <div>
                <MdOutlineKeyboardArrowRight
                  size={25}
                  className={`transition-transform ${
                    toggleReadMore === true ? "rotate-90" : "rotate-0"
                  }`}
                />
              </div>
            </div>

            <div
              className={`${toggleReadMore ? "block" : "hidden"} w-full p-4`}
            >
              <div className="flex flex-col ml-3 gap-2">
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
          </div>
          <div className="w-full lg:w-2/3 flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-2/3 bg-white dark:bg-db-dark rounded-lg overflow-hidden">
              <div className="w-full bg-db-cyan-process pb-2">
                <div className="flex flex-col md:flex-row justify-center items-center gap-0 md:gap-5 py-1">
                  {isSale && (
                    <div className="text-2xl font-bold relative pt-2 text-black">
                      1 {tokenSymbol} = {basePrice ? basePrice.toFixed(3) : 0}{" "}
                      {nativeGasToken}
                      <div className="absolute bottom-[35%] left-[0%] w-full h-1 bg-gradient-to-r from-red-400 to-orange-500"></div>
                    </div>
                  )}
                  {isSale && (
                    <div className="hidden md:block pt-2">
                      <CgArrowLongRight size={40} className="text-white" />
                    </div>
                  )}
                  <div className="font-bold text-3xl text-white">
                    1 {tokenSymbol} ={" "}
                    {currentPrice ? currentPrice.toFixed(3) : 0}{" "}
                    {nativeGasToken}
                  </div>
                </div>
                {isSale && (
                  <div className="text-center text-xs italic text-white">
                    Limited time offer only
                  </div>
                )}
              </div>
              <div className="p-4">
                <ContainerStats
                  stats={[
                    {
                      label: "Your Wallet Balance",
                      icon: <GiWallet size={20} />,
                      value1: `${userGasBalance}`,
                      value2: `${nativeGasToken}`,
                    },
                    {
                      label: "Supply left",
                      icon: <GiTwoCoins size={20} />,
                      value1: trimNumber(+supplyLeft, 4, "dp"),
                    },
                    {
                      label: "Min. Purchase",
                      icon: <GiPriceTag size={20} />,
                      value1: `${minAmount.toFixed(2)} ${nativeGasToken}`,
                    },
                  ]}
                />

                <div className="mt-4 flex justify-center w-full">
                  <div className="w-full gap-2 flex">
                    <div className="w-16 md:w-20 flex justify-center items-center">
                      <span className="text-xl">Buy</span>
                    </div>
                    <div className="h-14 w-full bg-white dark:bg-db-dark-input shadow-inner shadow-db-cyan-process dark:shadow-black rounded-lg flex gap-2 items-center px-4">
                      <input
                        value={Number(dbmtBuyAmount) !== 0 ? dbmtBuyAmount : ""}
                        onChange={(e) => {
                          setInput(0);
                          let val = e.target.value || "0";
                          if (Number(val) > supplyLeft) {
                            val = supplyLeft.toString();
                          }
                          setDbmtBuyAmount(val);
                          if (val === "0") {
                            setBuyAmount("0");
                          }
                        }}
                        type={"number"}
                        min={0}
                        max={Number(supplyLeft)}
                        className="text-left md:text-center px-0 md:px-4 h-10 w-full focus:ring-0 focus:outline-none rounded-lg bg-white dark:bg-db-dark-input"
                        placeholder={`${tokenSymbol} amount`}
                      />
                      <div className="">{tokenSymbol}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-center w-full">
                  <div className="w-full gap-2 flex">
                    <div className="w-16 md:w-20 flex justify-center items-center">
                      <span className="text-xl">For</span>
                    </div>
                    <div className="h-14 w-full bg-white dark:bg-db-dark-input rounded-lg flex gap-4 items-center px-4 shadow-inner shadow-db-cyan-process dark:shadow-black">
                      <input
                        value={Number(buyAmount) !== 0 ? buyAmount : ""}
                        onChange={(e) => {
                          setInput(1);
                          const val = e.target.value || "0";
                          setBuyAmount(val);
                          if (val === "0") {
                            setDbmtBuyAmount("0");
                          }
                        }}
                        type={"number"}
                        min={0}
                        className="text-left md:text-center md:pl-20 px-0 md:px-4 h-10 w-full focus:ring-0 focus:outline-none rounded-lg bg-white dark:bg-db-dark-input"
                        placeholder={`${nativeGasToken} amount`}
                      />
                      <div
                        onClick={() => {
                          setInput(1);
                          setBuyAmount(
                            (Number(userGasBalance) - 0.0001).toString()
                          );
                        }}
                        className="cursor-pointer rounded-lg flex justify-center items-center h-9 pb-0.5 px-2  border-[1px] border-db-cyan-process text-db-cyan-process hover:bg-db-cyan-process hover:text-white transition-colors"
                      >
                        MAX
                      </div>
                      <div className="">{nativeGasToken}</div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex gap-4 items-center flex-col md:flex-row justify-center">
                  <div className="w-full md:w-2/3">
                    <DBButton
                      disabled={!buyWrite.transaction.write}
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
            <div className="w-full lg:w-1/3 bg-white dark:bg-db-dark rounded-lg overflow-hidden p-4">
              <div className="flex flex-col w-full h-full justify-between">
                <div className="relative text-center w-full text-xl flex gap-4 justify-center items-center">
                  DBMT Referral
                  <AiOutlineInfoCircle
                    size={25}
                    className="text-db-cyan-process"
                    onMouseEnter={() => setShowReferralInfo(true)}
                    onMouseLeave={() => setShowReferralInfo(false)}
                  />
                  {showReferralInfo && (
                    <div className="absolute left-0 top-8 bg-db-light dark:bg-db-dark-info rounded-lg p-2 text-xs">
                      Recommend DeFiBetter and bring in new investors to earn
                      incentives and BNB. Referees must invest a minimum of $50.
                    </div>
                  )}
                </div>

                <div className="mt-4 w-full flex justify-between items-center">
                  <div className="text-db-cyan-process">Your $DBMT</div>
                  <div>{investorData ? investorData.ownBuysInGasToken : 0}</div>
                </div>
                <div className="w-full flex justify-between items-center">
                  <div className="text-db-cyan-process">Referral % rewards</div>
                  <div>{userPercent}%</div>
                </div>
                <div className="w-full flex justify-between items-center">
                  <div className="text-db-cyan-process">Raised</div>
                  <div>{investorData ? investorData.totalRaisedInGasToken : 0} BNB</div>
                </div>
                <div className="w-full flex justify-between items-center">
                  <div className="text-db-cyan-process">Profit from Raised</div>
                  <div>{investorData ? investorData.totalReferralGainsInGasToken : 0} BNB</div>
                </div>
                <div className="w-full flex justify-between items-center">
                  <div className="text-db-cyan-process">Pending Rewards</div>
                  <div>{investorData ? investorData.referralDebt : 0} BNB</div>
                </div>
                <div className="mt-4">
                  <DBButton
                    disabled={!claim.transaction.write}
                    heigthTwClass={"h-10"}
                    onClick={() => {
                      if (claim.transaction.write) {
                        claim.transaction.write();
                      }
                    }}
                  >
                    {claim.confirmation.isLoading ? (
                      <Loader text="Claiming Rewards" />
                    ) : (
                      "Claim Rewards"
                    )}
                  </DBButton>
                </div>
                <div
                  className="mt-4 overflow-hidden cursor-pointer"
                  onClick={() => {
                    setSuccessCopy(true);
                    navigator.clipboard.writeText(
                      `${window.location.origin}${window.location.pathname}?ref=${address}`
                    );
                    setTimeout(() => {
                      setSuccessCopy(false);
                    }, 3000);
                  }}
                >
                  <div className="text-db-cyan-process">
                    Your Referral Link (click to copy)
                  </div>
                  <div className="w-full flex gap-4 items-center cursor-pointer justify-between">
                    <div className="w-full text-db-dark-info overflow-hidden">
                      .../ref={address}...
                    </div>
                    <AiFillCopy
                      className="text-db-cyan-process active:text-db-dark"
                      size={20}
                    />
                  </div>
                </div>
                <div className="h-5 text-green-500 text-xs text-center">
                  {successCopy && (
                    <span>Copied referral link to clipboard</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
