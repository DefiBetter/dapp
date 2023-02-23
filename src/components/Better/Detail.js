import { useContext, useEffect, useState } from "react";
import styles from "./Detail.module.css";
import { useContractRead, useNetwork } from "wagmi";
import { ethers } from "ethers";
import truncateEthAddress from "truncate-eth-address";
import { contractAddresses } from "../../static/contractAddresses";
import Countdown from "react-countdown";
import { Scrollbar } from "react-scrollbars-custom";
import { trimNumber } from "../common/helper";
import AlertContext from "../../context/AlertContext";

const Detail = (props) => {
  /* account, network, configs */
  // network
  const { chain: activeChain } = useNetwork();

  /* states */
  //
  const [total, setTotal] = useState(0);
  const [rewardPeriodLength, setRewardPeriodLength] = useState(0); // seconds
  const [binBorderList, setBinBorderList] = useState([
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
    "0",
  ]);

  // current period
  const [weekBiggestRelativeGainAmount, setWeekBiggestRelativeGainAmount] =
    useState();

  // past period
  const [
    lastWeekBiggestRelativeGainAmount,
    setLastWeekBiggestRelativeGainAmount,
  ] = useState();

  /* contract read/writes */
  useContractRead({
    ...props.betterContractConfig,
    functionName: "rewardPeriodLength",
    args: [],
    onError(data) {},
    onSuccess(data) {
      setRewardPeriodLength(+data.toString());
    },
  });

  // // user gain info current period
  // useContractRead({
  //   ...props.betterContractConfig,
  //   functionName: "getUserGainsInfo",
  //   args: [
  //     props.rewardPeriodInfo.globalBiggestRelativeGainCurrentPeriodAddress,
  //   ],
  //   onError(data) {},
  //   onSuccess(data) {
  //     // console.log("getUserGainsInfo", data);
  //     setWeekBiggestRelativeGainAmount(data.biggestRelativeGainAmount);
  //   },
  // });

  // // user gain info past period
  // useContractRead({
  //   ...props.betterContractConfig,
  //   functionName: "getUserGainsInfo",
  //   args: [props.rewardPeriodInfo.globalBiggestRelativeGainPastPeriodAddress],
  //   onError(data) {},
  //   onSuccess(data) {
  //     setLastWeekBiggestRelativeGainAmount(data.biggestRelativeGainAmount);
  //   },
  // });

  const [alertMessageList, setAlertMessageList] = useContext(AlertContext);

  /* handle on input */
  const onInput = (e) => {
    let temp = [...props.binAmountList];
    // console.log("e.target.value", typeof +e.target.value);
    temp[e.target.id] = e.target.value ? +e.target.value : 0;
    props.setBinAmountList(temp);
    props.setBinTotal(temp.reduce((a, b) => +a + +b, 0));
  };

  /* handle normal/implied button */
  const handleOnClickNormal = () => {
    setAlertMessageList([...alertMessageList, "'Normal' button clicked"]);
    const range = (x) => [...Array(x).keys()];

    function getBinWeights(i) {
      // probabilty density function of normal distribution
      const pdf = (x, mu, sigma) =>
        Math.exp(-0.5 * ((x - mu) / sigma) ** 2) /
        (sigma * (2 * Math.PI) ** 0.5);

      /**
       * - normal dist centred around bin with index c determines relative allocations for capital
       * - this function returns the sum of the PDF of the normal distribution centred around the bin with
       *   index c with a standard deviation of i (since the calculation is invariant towards the actual
       *   volatility of the underlying)
       */
      const binCentreSampleSum = (binCentreIndex) =>
        range(7).reduce(
          (prev, curr, binIndex) =>
            prev +
            pdf(
              -i + i / 7 + (2 * binIndex * i) / 7,
              (2 * binCentreIndex * i) / 7,
              1
            ),
          0
        );

      /**
       * returns matrix [centreBin][distanceToCentreBin] containing weights for bins in basis points
       * starting with centre bin -3 (left most) to centre bin 0 = centre bin -3, -2, -1, 0
       */
      return range(4).map((centreBin) =>
        range(7).map((binDistFromCentre) => {
          // console.log(binCentreSampleSum(binDistFromCentre));
          return (
            Math.floor(
              (pdf(
                -i + i / 7 + (2 * binDistFromCentre * i) / 7,
                (2 * (centreBin - 3) * i) / 7,
                1
              ) /
                binCentreSampleSum(centreBin - 3)) *
                10_000 *
                1_000_000_000
            ) / 1_000_000_000
          );
        })
      );
    }

    // this generates ALL the possible samples, so just need to pick the one where the user has entered the biggest amount in as the centre point. index = distance, so if index = 0, distance from centre = 0
    const sampleList = getBinWeights(
      props.instrument.volatilityMultiplier / 10_000
    ).reverse();

    // find biggest bin
    let idx = props.binAmountList.indexOf(Math.max(...props.binAmountList));

    // if no biggest, then use centre bin
    if (idx < 0) {
      idx = 3;
    }

    let distanceFromCentre = 3 - idx;
    // console.log("sampleList distanceFromCentre", distanceFromCentre);

    let result;
    if (distanceFromCentre < 0) {
      distanceFromCentre = Math.abs(distanceFromCentre);
      result = [...sampleList[distanceFromCentre]].reverse();
    } else if (distanceFromCentre >= 0) {
      result = sampleList[distanceFromCentre];
    }

    // console.log("sampleList props.binAmountList", props.binAmountList);
    // console.log(
    //   "sampleList Math.max(...props.binAmountList)",
    //   Math.max(...props.binAmountList)
    // );

    // console.log("sampleList idx", idx);
    // console.log("sampleList distanceFromCentre", distanceFromCentre);
    // console.log("sampleList", sampleList);

    // console.log("sampleList result", result);
    // console.log("sampleList props.binTotal", props.binTotal);

    let newArr = [];
    result.map((r) => {
      newArr.push(+((r / 10_000) * props.binTotal).toFixed(9));
      // console.log("sampleList newArr", newArr);
      // console.log(
      //   "sampleList total newArr",
      //   newArr.reduce((a, b) => a + b)
      // );
      props.setBinAmountList(newArr);
      props.setBinTotal(newArr.reduce((a, b) => a + b));
    });
  };

  /* useEffect */
  useEffect(() => {
    setTotal(props.binAmountList.reduce((a, b) => Number(a) + Number(b), 0));

    if (props.epochData) {
      const t = props.epochData.binValues.map((bin, i) =>
        (+ethers.utils.formatEther(
          props.epochData.binSize.mul(i + 1).add(props.epochData.binStart)
        )).toPrecision(5)
      );
      setBinBorderList([
        (+ethers.utils.formatEther(props.epochData.binStart)).toPrecision(5),
        ...t,
      ]);
    }
  }, [props]);

  return (
    <div className="flex w-full h-full bg-db-beau-blue">
      <div className="w-1/2 h-full px-2 flex flex-col">
        <div className="mt-2.5 h-[calc(100%/27*2)] flex flex-col text-center">
          <div className="text-xs border-[1px] border-black bg-db-background flex flex-col rounded-md">
            <div className="">
              Total position:{" "}
              <span className="font-bold">
                {" "}
                {total} {contractAddresses[activeChain?.network]?.nativeGas}
              </span>
            </div>
            <div className="text-xs text-center">
              (
              <span className="font-bold">
                {total - props.pendingBetterBalance > 0
                  ? total - props.pendingBetterBalance
                  : 0}
              </span>
              {" + "}
              {total > props.pendingBetterBalance
                ? Number(props.pendingBetterBalance) > 0
                  ? Number(props.pendingBetterBalance).toFixed(6)
                  : 0
                : total}{" "}
              pending)
            </div>
          </div>
        </div>
        {props.epochData?.binValues.map((binValue, i, binValues) => {
          i = binValues.length - 1 - i;
          binValue = binValues[i];
          return (
            <>
              <div className="text-xs h-[calc(100%/27)] flex justify-between">
                <div className="">
                  {props.epochData ? binBorderList[i + 1] : null}
                </div>
                <div>
                  {+ethers.utils.formatEther(binValue.toString()) > 0
                    ? trimNumber(
                        ethers.utils.formatEther(binValue.toString()),
                        6,
                        "dp"
                      ) +
                      " " +
                      props.nativeGas
                    : null}
                </div>
              </div>
              <div className="h-[calc(100%/27*2)] flex flex-col text-center">
                <div className="relative flex-1 border-2 border-black bg-db-background rounded-md">
                  <input
                    style={{
                      fontSize: "1rem",
                      width: "90%",
                      height: "90%",
                      alignSelf: "center",
                    }}
                    type="number"
                    min={0}
                    id={`${i}`}
                    onInput={onInput}
                    value={
                      props.binAmountList[i] > 0 ? props.binAmountList[i] : ""
                    }
                    placeholder={`Bin ${i + 1} (${
                      i + 1 > 4
                        ? `Bull ${i + 1 - 4}`
                        : i + 1 < 4
                        ? `Bear ${4 - (i + 1)}`
                        : `Neutral`
                    })`}
                  />
                  <div
                    style={{
                      backgroundColor: "#80A9E4",
                      height: "20%",
                      width: `calc(100% * ${props.normalisedBinValueList[i]})`,
                      bottom: "0",
                      right: "0",
                      position: "absolute",
                      borderRadius: "0.5rem 0 0.5rem 0.5rem",
                      margin: "0rem",
                    }}
                  />
                </div>
              </div>
              {i === 0 ? (
                <div className="h-[calc(100%/27)] text-xs">
                  {binBorderList[0]}
                </div>
              ) : null}
            </>
          );
        })}
        <div className='h-[calc(100%/27*2)] flex flex-col text-center'>
          <div className='flex justify-between gap-2'>
            <button
              className="flex justify-center items-center gap-2 border-[1px] border-black shadow-db bg-db-cyan-process h-10 w-full rounded-lg text-white hover:bg-db-blue-200"
              onClick={handleOnClickNormal}
            >
              <div className="font-fancy pt-1 ">Normal</div>
              <div className="text-sm pb-0.5 border-[1px] border-white rounded-full w-4 h-4 flex justify-center items-center">
                i
              </div>
            </button>

            <button
              className="disabled:bg-gray-400 flex justify-center items-center gap-2 border-[1px] border-black shadow-db bg-db-cyan-process h-10 w-full rounded-lg text-white hover:bg-db-blue-200"
              onClick={handleOnClickNormal}
              disabled
            >
              <div className="font-fancy pt-1 ">Implied</div>
              <div className="text-sm pb-0.5 border-[1px] border-white rounded-full w-4 h-4 flex justify-center items-center">
                i
              </div>
            </button>
          </div>
        </div>
      </div>
      <div className="w-1/2 overflow-y-auto">
        <Scrollbar>
          <div className="flex flex-col gap-2 w-full p-2">
            <div className="border-2 border-black shadow-db bg-white flex flex-col">
              <div className="flex justify-center font-bold py-1">
                Epoch Data
              </div>
              <div className="p-1 text-xs">
                <div className="bg-db-background border-[1px] border-black flex flex-col p-1">
                  <div className="flex justify-between">
                    <div>Epoch</div>
                    <div>
                      {props.instrument
                        ? props.instrument.epoch.toString()
                        : null}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>Pot Size</div>
                    <div>
                      {props.epochData
                        ? trimNumber(
                            ethers.utils.formatEther(props.epochData.pot),
                            6,
                            "dp"
                          )
                        : null}{" "}
                      {props.nativeGas ? props.nativeGas : null}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>Number of bets</div>
                    <div>
                      {props.epochData
                        ? props.epochData.numBets.toString()
                        : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full p-2">
            <div className="border-2 border-db-cyan-process shadow-db bg-white flex flex-col rounded-xl">
              <div className="text-center font-bold flex justify-center py-1">
                My
                <span className="font-fancy mt-3 text-db-cyan-process">
                  Statistics
                </span>
              </div>
              <div className="p-1 pt-0 text-xs">
                <div className="bg-db-background border-[1px] border-black flex flex-col p-1 rounded-xl">
                  <div className="flex justify-between font-bold">
                    <div>Position value</div>
                    <div>
                      {trimNumber(
                        ethers.utils.formatEther(props.userPosition || 0),
                        6,
                        "dp"
                      )}{" "}
                      {props.nativeGas}
                    </div>
                  </div>
                  <div className="flex justify-between font-bold">
                    <div>Pending Rewards</div>
                    <div>
                      {trimNumber(props.pendingBetterBalance, 6, "dp")}{" "}
                      {props.nativeGas}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>Number of games</div>
                    <div>{props.userGainsInfo.numberOfGames.toString()}</div>
                  </div>
                  <div className="flex justify-between">
                    <div>Biggest gain</div>
                    <div className="text-lime-500">
                      {+props.userGainsInfo.biggestRelativeGainAmount >= 0
                        ? "+"
                        : "-"}
                      {+props.userGainsInfo.biggestRelativeGainAmount}%{" "}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>Most recent gain</div>
                    <div className="text-lime-500">
                      {+props.userGainsInfo.mostRecentRelativeGainAmount >= 0
                        ? "+"
                        : "-"}
                      {+props.userGainsInfo.mostRecentRelativeGainAmount}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full p-2">
            <div className="border-2 border-db-cyan-process shadow-db bg-white flex flex-col rounded-xl">
              <div className="text-center font-bold flex justify-center py-1">
                Better
                <span className="font-fancy mt-3 text-db-cyan-process">
                  Gains
                </span>
              </div>
              <div className="p-1 pt-0 text-xs">
                <div className="bg-db-background border-[1px] border-black flex flex-col p-1 rounded-xl">
                  <div className="flex justify-between">
                    <div className="w-1/2">Time left for current week</div>
                    <div className=" text-right">
                      {props.rewardPeriodInfo ? (
                        <Countdown
                          key={
                            (+props.rewardPeriodInfo.rewardPeriodStart +
                              +rewardPeriodLength) *
                            1000
                          }
                          date={
                            (+props.rewardPeriodInfo.rewardPeriodStart +
                              +rewardPeriodLength) *
                            1000
                          }
                        />
                      ) : null}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-1/2">Week's biggest gain</div>
                    <div className="text-lime-500 text-right flex flex-col">
                      <div>
                        {+props.rewardPeriodInfo
                          .globalBiggestRelativeGainCurrentPeriod >= 0
                          ? "+"
                          : "-"}
                        {
                          +props.rewardPeriodInfo
                            .globalBiggestRelativeGainCurrentPeriod
                        }
                        %
                      </div>
                      <div className="text-black">
                        {truncateEthAddress(
                          props.rewardPeriodInfo
                            .globalBiggestRelativeGainCurrentPeriodAddress
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-1/2">Last week's biggest gain</div>
                    <div className="text-lime-500 text-right flex flex-col">
                      <div>
                        {+props.rewardPeriodInfo
                          .globalBiggestRelativeGainPastPeriod >= 0
                          ? "+"
                          : "-"}
                        {
                          +props.rewardPeriodInfo
                            .globalBiggestRelativeGainPastPeriod
                        }
                        %
                      </div>
                      <div className="text-black">
                        {truncateEthAddress(
                          props.rewardPeriodInfo
                            .globalBiggestRelativeGainPastPeriodAddress
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-1/2">Biggest gain of all time</div>
                    <div className="text-lime-500 text-right flex flex-col">
                      <div>
                        {+props.rewardPeriodInfo.globalBiggestRelativeGain >= 0
                          ? "+"
                          : "-"}
                        {+props.rewardPeriodInfo.globalBiggestRelativeGain}%
                      </div>
                      <div className="text-black">
                        {truncateEthAddress(
                          props.rewardPeriodInfo
                            .globalBiggestRelativeGainAddress
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Scrollbar>
      </div>
    </div>
  );
};

export default Detail;
