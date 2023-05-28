import { useEffect, useMemo, useState } from "react";
import { CountdownFormatted, trimNumber } from "../components/common/helper";
import { MdDoubleArrow, MdOutlineKeyboardArrowDown } from "react-icons/md";
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
import { useAccount } from "wagmi";
import { AiFillCopy } from "react-icons/ai";
import useWithdrawReferralRewards from "../hooks/useWithdrawReferralRewards";
import useUserReferralRewardPercentage from "../hooks/useUserReferralRewardPercentage";
import useInvestorData from "../hooks/useInvestorData";
import useReferralLevelRewardPercentage from "../hooks/useReferralLevelRewardPercentage";
import useGetReferralLevelThresholdsInGasToken from "../hooks/useGetReferralLevelThresholdsInGasToken";
import { BigNumber, ethers } from "ethers";

export default function Dbmt({ bnbPrice }) {
  const { address } = useAccount();
  const queryParameters = new URLSearchParams(window.location.search);
  const referral = queryParameters.get("ref") || address;

  const { chain } = useNetwork();
  const [input, setInput] = useState();
  const [buyAmount, setBuyAmount] = useState("");
  const [dbmtBuyAmount, setDbmtBuyAmount] = useState("");
  const [toggleReadMore, setToggleReadMore] = useState(false);
  const [successCopy, setSuccessCopy] = useState(false);
  const { basePrice, currentPrice } = useDbmtPrice();
  const dbmtPerEth = useDbmtPerEth(buyAmount === "" ? "0" : buyAmount);
  const ethPerDbmt = useEthPerDbmt(dbmtBuyAmount === "" ? "0" : dbmtBuyAmount);
  const supplyLeft = useDbmtSupplyLeft();
  const startTime = useDbmtStartTime();
  const duration = useDbmtDuration();
  const minAmount = useDmbtMinPayment();
  const buyWrite = useDbmtBuy(buyAmount === "" ? "0" : buyAmount, referral);
  const claim = useWithdrawReferralRewards();
  const userPercent = useUserReferralRewardPercentage();
  const investorData = useInvestorData();
  const referralLevelRewardPercentage = useReferralLevelRewardPercentage();
  const referralLevelThresholdsInGasToken =
    useGetReferralLevelThresholdsInGasToken();

  const userGasBalance = useNativeBalance();
  const tokenSymbol = useSymbol(contractAddresses[chain?.network]?.dbmtToken);

  useEffect(() => {
    if (input === 0 && ethPerDbmt) {
      setBuyAmount(ethPerDbmt);
    } else if (input === 1 && dbmtPerEth) {
      setDbmtBuyAmount(dbmtPerEth);
    }
  }, [dbmtPerEth, ethPerDbmt]);

  const isSale = useMemo(
    () => basePrice && currentPrice && basePrice !== currentPrice,
    [basePrice, currentPrice]
  );

  const nativeGasToken = contractAddresses[chain?.network]?.nativeGas;

  const bnbTilNextLevel = useMemo(() => {
    if (referralLevelThresholdsInGasToken) {
      if (investorData && basePrice) {
        const boughtInBNB =
          investorData.ownBuysInGasToken > 0
            ? ethers.utils.parseEther(investorData.ownBuysInGasToken)
            : ethers.utils.parseEther("0");

        const currentLevelIndex = referralLevelRewardPercentage.findIndex(
          (percent) => userPercent === Number(percent) / 100
        );

        for (
          let i = currentLevelIndex;
          i < referralLevelThresholdsInGasToken.length - 1;
          i++
        ) {
          if (boughtInBNB.lt(referralLevelThresholdsInGasToken[i + 1])) {
            return referralLevelThresholdsInGasToken[i + 1] - boughtInBNB;
          }
        }
      }
      return referralLevelThresholdsInGasToken[0];
    }
    return 0;
  }, [referralLevelThresholdsInGasToken, investorData, basePrice]);

  function bnbToDBMT(bnb) {
    if (basePrice && bnb > 0) {
      return bnb / basePrice;
    }
    return 0;
  }

  function displayedRoundedPrice(number) {
    const formattedNumber = ethers.utils.formatEther(number);
    const price = bnbPrice * formattedNumber;
    return Math.round(price / 50) * 50;
  }

  function displayLevelUp() {
    const userPercentValue = userPercent * 100;
    const maxPercentValue =
      referralLevelRewardPercentage && referralLevelRewardPercentage.length > 0
        ? Number(
            referralLevelRewardPercentage[
              referralLevelRewardPercentage.length - 1
            ]
          )
        : -1;
    if (userPercentValue === maxPercentValue) {
      return (
        <div className="mt-2 w-full text-center">You've reached max tier!</div>
      );
    } else if (userPercentValue !== maxPercentValue) {
      return (
        <div className="mt-2 w-full text-center">
          Buy for{" "}
          <span
            onClick={() => {
              setInput(1);
              setBuyAmount(
                ethers.utils.formatEther(bnbTilNextLevel.toString())
              );
            }}
            className="text-green-500 font-bold underline cursor-pointer"
          >
            {(+ethers.utils.formatEther(bnbTilNextLevel.toString())).toFixed(3)}{" "}
            {nativeGasToken}
          </span>{" "}
          more to unlock the next referral level!
        </div>
      );
    }
  }

  function boxClicked(index) {
    let amount = "0";
    if (investorData) {
      const userBought = ethers.utils.parseEther(investorData.ownBuysInGasToken)
      const tierAmount = BigNumber.from(referralLevelThresholdsInGasToken[index])
      amount = ethers.utils.formatEther(tierAmount.sub(userBought))
      if (+amount < 0) {
        return
      }
    }
    setInput(1);
    setBuyAmount(amount);
  }
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
                <MdOutlineKeyboardArrowDown
                  size={25}
                  className={`transition-transform ${
                    toggleReadMore === true ? "-rotate-180" : "rotate-0"
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

          <div className="w-full lg:w-2/3 bg-white dark:bg-db-dark rounded-lg overflow-hidden">
            <div className="py-2 w-full rounded-t-lg bg-green-600 text-center text-2xl font-bold">
              Refer friends to receive a share of their investments as rewards!
            </div>
            <div
              className="w-[93%] md:w-1/2 m-auto rounded-lg text-center mt-4 cursor-pointer justify-between px-2 bg-db-dark-input py-1 flex items-center"
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
              <div className="whitespace-nowrap">Your Referral Link</div>
              <div className="w-full flex gap-1 items-center cursor-pointer justify-between">
                <div className="w-full text-db-cyan-process overflow-hidden">
                  .../ref={`${address.slice(0, 5)}...${address.slice(-4)}`}
                </div>
                <AiFillCopy
                  className="text-db-cyan-process active:text-db-dark"
                  size={20}
                />
                <div
                  className={`${successCopy ? "text-green-500" : null} text-xs`}
                >
                  {successCopy ? "Copied" : "Copy"}
                </div>
              </div>
            </div>

            <div className="mt-4 w-full flex flex-col md:flex-row justify-between px-4 gap-4">
              {referralLevelRewardPercentage &&
                referralLevelThresholdsInGasToken &&
                referralLevelRewardPercentage.map((ref, index) => (
                  <div
                    onClick={() => {
                      boxClicked(index);
                    }}
                    className={`w-full rounded-lg ${
                      userPercent === Number(ref) / 100
                        ? "bg-db-cyan-process"
                        : "bg-db-cadet-grey"
                    }  p-2 text-center cursor-pointer`}
                  >
                    <div className="text-2xl font-bold">
                      {Number(ref) / 100}%
                    </div>
                    <div className="">
                      {ethers.utils.formatEther(
                        referralLevelThresholdsInGasToken[index]
                      )}{" "}
                      {nativeGasToken}{" "}
                      {bnbPrice && (
                        <span className="text-xs">
                          (≈
                          {bnbToDBMT(
                            ethers.utils.formatEther(
                              referralLevelThresholdsInGasToken[index]
                            )
                          ).toFixed(3)}{" "}
                          {tokenSymbol} ≈ $
                          {displayedRoundedPrice(
                            referralLevelThresholdsInGasToken[index]
                          )}
                          )
                        </span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
            {displayLevelUp()}

            <div className="flex w-full h-full flex-col md:flex-row justify-between p-4 gap-4 md:gap-10">
              <div className="flex flex-col justify-between w-full">
                <div className="w-full flex justify-between items-center">
                  <div className="text-db-cyan-process">
                    Your {tokenSymbol} Buys
                  </div>
                  <div className="font-bold">
                    {investorData
                      ? bnbToDBMT(investorData.ownBuysInGasToken).toFixed(3)
                      : 0}{" "}
                    {tokenSymbol}
                  </div>
                </div>

                <div className="w-full flex justify-between items-center">
                  <div className="text-db-cyan-process">
                    Raised via referral
                  </div>
                  <div className="font-bold">
                    {investorData ? investorData.totalRaisedInGasToken : 0}{" "}
                    {nativeGasToken}
                  </div>
                </div>
                <div className="w-full flex justify-between items-center">
                  <div className="text-db-cyan-process">Profit from Raised</div>
                  <div className="font-bold">
                    {investorData
                      ? investorData.totalReferralGainsInGasToken
                      : 0}{" "}
                    BNB
                  </div>
                </div>
              </div>
              <div className="min-w-[250px] flex flex-col rounded-lg bg-db-dark-input p-2">
                <div className="w-full flex justify-between items-center">
                  <div className="">Pending Rewards</div>
                  <div className="font-bold">
                    {investorData ? investorData.referralDebt : 0}{" "}
                    {nativeGasToken}
                  </div>
                </div>
                <div className="mt-4">
                  <DBButton
                    disabled={
                      !claim.transaction.write ||
                      (investorData && investorData.referralDebt === 0)
                    }
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
              </div>
            </div>
          </div>
          <div className="w-full lg:w-2/3">
            <div
              className={`w-full bg-white dark:bg-db-dark rounded-lg overflow-hidden`}
            >
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
                        value={dbmtBuyAmount}
                        onChange={(e) => {
                          setInput(0);
                          let val = e.target.value;
                          try {
                            const testNumber = Number(val);
                            if (testNumber != null && !isNaN(testNumber)) {
                              setDbmtBuyAmount(val);
                            }
                          } catch (e) {}
                        }}
                        // min={0}
                        // max={Number(supplyLeft)}
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
                        value={buyAmount}
                        onChange={(e) => {
                          setInput(1);
                          let val = e.target.value;

                          try {
                            const testNumber = Number(val);
                            if (testNumber != null && !isNaN(testNumber)) {
                              setBuyAmount(val);
                            }
                          } catch (e) {}
                        }}
                        // min={0}
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
          </div>
        </div>
      </div>
    </>
  );
}
