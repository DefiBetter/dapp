import { useContext, useEffect, useState } from "react";
import styles from "./Bins.module.css";
import { useNetwork } from "wagmi";
import { ethers } from "ethers";
import { contractAddresses } from "../../static/contractAddresses";
import { trimNumber } from "../common/helper";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";
import DBButton from "../common/DBButton";

const Bins = (props) => {
  /* account, network, configs */
  // network
  const { chain: activeChain } = useNetwork();

  /* states */
  //
  const [total, setTotal] = useState(0);
  const [binsOpen, setBinsOpen] = useState(false);
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
    //setAlertMessageList([...alertMessageList, "'Normal' button clicked"]);
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

  function bins() {
    return (
      <div className="h-full">
        <div className="h-11 flex flex-col text-center">
          <div className="text-xs h-full bg-db-blue-gray items-center justify-center text-white rounded-lg flex flex-col">
            <div className="">
              Total position:{" "}
              <span className="font-bold">
                {" "}
                {trimNumber(total, 6, "sf")}{" "}
                {contractAddresses[activeChain?.network]?.nativeGas}
              </span>
            </div>
            <div className="text-xs text-center">
              (
              <span className="font-bold">
                {total - props.pendingBetterBalance > 0
                  ? trimNumber(total - props.pendingBetterBalance, 6, "sf")
                  : 0}
              </span>
              {" + "}
              {total > props.pendingBetterBalance
                ? Number(props.pendingBetterBalance) > 0
                  ? trimNumber(props.pendingBetterBalance, 6, "sf")
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
                  {+ethers.utils.formatEther(binValue) > 0
                    ? trimNumber(ethers.utils.formatEther(binValue), 6, "dp") +
                      " " +
                      props.nativeGas
                    : null}
                </div>
              </div>
              <div className="h-[calc(100%/27*2)] flex flex-col text-center">
                <div className="relative flex-1 text-black bg-db-background rounded-md">
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
        <div className="h-[calc(100%/27*2)] flex flex-col text-center">
          <div className="flex justify-between gap-2">
            <DBButton onClick={handleOnClickNormal} heigthTwClass="h-10">
              <div className="flex justify-center items-center gap-2">
                <div className="text-base">Normal</div>
                <div className="font-sans text-sm pb-0.5 border-[1px] border-white rounded-full w-4 h-4 flex justify-center items-center">
                  i
                </div>
              </div>
            </DBButton>

            <DBButton
              onClick={handleOnClickNormal}
              disabled
              heigthTwClass="h-10"
            >
              <div className="flex justify-center items-center gap-2">
                <div className="text-base">Implied</div>
                <div className="font-sans text-sm pb-0.5 border-[1px] border-white rounded-full w-4 h-4 flex justify-center items-center">
                  i
                </div>
              </div>
            </DBButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full flex-wrap">
      {/* Desktop */}
      <div className="hidden w-full h-full px-2 lg:flex flex-col">{bins()}</div>

      {/* Floating Button */}
      <div
        onClick={() => setBinsOpen(!binsOpen)}
        className={`lg:hidden z-20 absolute top-[210px] ${
          binsOpen ? "right-[calc(66%+1rem)]" : "right-5"
        } flex items-center`}
      >
        <div className="cursor-pointer bg-db-beau-blue rounded-xl w-10 h-10 animate-pulse flex justify-center items-center">
          {binsOpen ? (
            <AiOutlineDoubleRight size={30} className="text-db-cyan-process " />
          ) : (
            <AiOutlineDoubleLeft size={30} className="text-db-cyan-process " />
          )}
        </div>
      </div>

      {/* Mobile */}
      {binsOpen && (
        <div className="bg-db-beau-blue absolute w-2/3 top-0 right-0 px-2 h-[480px]">
          {bins()}
        </div>
      )}
    </div>
  );
};

export default Bins;
