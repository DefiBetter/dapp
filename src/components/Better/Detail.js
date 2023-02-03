import { Button } from "../common/Button";
import { useContext, useEffect, useState } from "react";
import {
  Card,
  CardBlueBg,
  CardBlueBgBlackBorder,
  CardBlueBgBlackBorderNoShadow,
  CardFill,
} from "../common/Card";
import styles from "./Detail.module.css";
import { useContractRead, useNetwork } from "wagmi";
import {
  CenterText,
  ExSmallText,
  MedText,
  NormalText,
  SmallText,
} from "../common/Text";
import { Grid, GridCol, GridRow } from "../common/Grid";

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
          return Math.round(
            (pdf(
              -i + i / 7 + (2 * binDistFromCentre * i) / 7,
              (2 * (centreBin - 3) * i) / 7,
              1
            ) /
              binCentreSampleSum(centreBin - 3)) *
              10_000
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
    setTotal(
      props.binAmountList.reduce((a, b) => Number(a) + Number(b), 0).toString()
    );

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
    <div className={styles.container}>
      <div className={styles.binContainer}>
        <div className={styles.yPadding} />
        <div className={styles.bin}>
          <CardBlueBgBlackBorder padding={0}>
            <SmallText>
              <NormalText>
                Total position size:{" "}
                <b>
                  {total} {contractAddresses[activeChain?.network]?.nativeGas}
                </b>
              </NormalText>
            </SmallText>
            <ExSmallText>
              <NormalText>
                (
                <b>
                  {total - props.pendingBetterBalance > 0
                    ? total - props.pendingBetterBalance
                    : 0}
                </b>{" "}
                +{" "}
                {total > props.pendingBetterBalance
                  ? props.pendingBetterBalance
                  : total}{" "}
                pending)
              </NormalText>
            </ExSmallText>
          </CardBlueBgBlackBorder>
        </div>
        {props.epochData?.binValues.map((binValue, i, binValues) => {
          i = binValues.length - 1 - i;
          binValue = binValues[i];

          // console.log(
          //   "props.normalisedBinValueList",
          //   props.normalisedBinValueList
          // );
          return (
            // <div className={styles.bin}>
            //   <div className={styles.binUpper}>{bin.upper}</div>
            //   <input type="number" min={0} id={`${i}`} onInput={onInput} />
            // </div>
            <>
              <div className={styles.yLabel}>
                <SmallText>
                  {props.epochData ? binBorderList[i + 1] : null}
                </SmallText>
                <SmallText>
                  {+ethers.utils.formatEther(binValue.toString()) > 0
                    ? trimNumber(
                        ethers.utils.formatEther(binValue.toString()),
                        6,
                        "dp"
                      ) +
                      " " +
                      props.nativeGas
                    : null}
                </SmallText>
              </div>
              <div className={styles.bin}>
                <CardFill
                  style={{
                    position: "relative",
                  }}
                  borderColor={"black"}
                  backgroundColor={"blue"}
                  // noBorder={true}
                  borderWidth={0.1}
                  padding={0.1}
                  borderRadius={0.5}
                >
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
                </CardFill>
              </div>
              {i == 0 ? (
                <div
                  className={styles.yLabel}
                  style={{
                    textAlign: "left",
                  }}
                >
                  <SmallText>{binBorderList[0]}</SmallText>
                </div>
              ) : null}
            </>
          );
        })}
        <div className={styles.bin}>
          <div className={styles.binChoice}>
            <Button onClick={handleOnClickNormal}>
              <SmallText>Normal</SmallText>
            </Button>
            <Button>
              <SmallText>Implied</SmallText>
            </Button>
          </div>
        </div>
        <div className={styles.yPadding} />
      </div>
      <div className={styles.statsContainer}>
        <Scrollbar>
          <Card>
            <CenterText>
              <b>Epoch Data</b>
            </CenterText>
            <CardFill backgroundColor={"blue"} noBorder={true}>
              <Grid>
                <GridRow>
                  <GridCol padding={0.2}>
                    <ExSmallText>Epoch:</ExSmallText>
                  </GridCol>
                  <GridCol padding={0.2}>
                    <ExSmallText>
                      {props.instrument
                        ? props.instrument.epoch.toString()
                        : null}
                    </ExSmallText>
                  </GridCol>
                </GridRow>
                <GridRow>
                  <GridCol padding={0.2}>
                    <ExSmallText>Pot size:</ExSmallText>
                  </GridCol>
                  <GridCol padding={0.2}>
                    <ExSmallText>
                      {props.epochData
                        ? trimNumber(
                            ethers.utils.formatEther(props.epochData.pot),
                            6,
                            "dp"
                          )
                        : null}{" "}
                      {props.nativeGas ? props.nativeGas : null}
                    </ExSmallText>
                  </GridCol>
                </GridRow>
                <GridRow>
                  <GridCol padding={0.2}>
                    <ExSmallText>Number of bets:</ExSmallText>
                  </GridCol>
                  <GridCol padding={0.2}>
                    <ExSmallText>
                      {props.epochData
                        ? props.epochData.numBets.toString()
                        : null}
                    </ExSmallText>
                  </GridCol>
                </GridRow>
              </Grid>
            </CardFill>
          </Card>
          <Card>
            <CenterText>
              <b>My Statistics</b>
            </CenterText>
            <CardFill backgroundColor={"blue"} noBorder={true}>
              <Grid>
                <GridRow>
                  <GridCol padding={0.2}>
                    <ExSmallText>Position value:</ExSmallText>
                  </GridCol>
                  <GridCol padding={0.2}>
                    <ExSmallText>
                      {trimNumber(
                        ethers.utils.formatEther(props.userPosition || 0),
                        6,
                        "dp"
                      )}{" "}
                      {props.nativeGas}
                    </ExSmallText>
                  </GridCol>
                </GridRow>
                <GridRow>
                  <GridCol padding={0.2}>
                    <ExSmallText>Pending rewards:</ExSmallText>
                  </GridCol>
                  <GridCol padding={0.2}>
                    <ExSmallText>
                      {trimNumber(props.pendingBetterBalance, 6, "dp")}{" "}
                      {props.nativeGas}
                    </ExSmallText>
                  </GridCol>
                </GridRow>
                <GridRow>
                  <GridCol padding={0.2}>
                    <ExSmallText>Number of games:</ExSmallText>
                  </GridCol>
                  <GridCol padding={0.2}>
                    <ExSmallText>
                      {props.userGainsInfo.numberOfGames.toString()}
                    </ExSmallText>
                  </GridCol>
                </GridRow>
                <GridRow>
                  <GridCol padding={0.2}>
                    <ExSmallText>Biggest gain:</ExSmallText>
                  </GridCol>
                  <GridCol padding={0.2}>
                    <ExSmallText>
                      {+props.userGainsInfo.biggestRelativeGainAmount >= 0
                        ? "+"
                        : "-"}
                      {+props.userGainsInfo.biggestRelativeGainAmount}%{" "}
                    </ExSmallText>
                  </GridCol>
                </GridRow>
                <GridRow>
                  <GridCol padding={0.2}>
                    <ExSmallText>Most recent gain:</ExSmallText>
                  </GridCol>
                  <GridCol padding={0.2}>
                    <ExSmallText>
                      {+props.userGainsInfo.mostRecentRelativeGainAmount >= 0
                        ? "+"
                        : "-"}
                      {+props.userGainsInfo.mostRecentRelativeGainAmount}%
                    </ExSmallText>
                  </GridCol>
                </GridRow>
              </Grid>
            </CardFill>
          </Card>
          <Card>
            <CenterText>
              <b>Better Gains</b>
            </CenterText>
            <CardFill backgroundColor={"blue"} noBorder={true}>
              <Grid>
                <GridRow>
                  <GridCol padding={0.2}>
                    <ExSmallText>Time left for current week:</ExSmallText>
                  </GridCol>
                  <GridCol padding={0.2}>
                    <ExSmallText>
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
                    </ExSmallText>
                  </GridCol>
                </GridRow>
                <GridRow>
                  <GridCol padding={0.2}>
                    <ExSmallText>Biggest gain (current):</ExSmallText>
                  </GridCol>
                  <GridCol padding={0.2}>
                    <ExSmallText>
                      {+props.rewardPeriodInfo
                        .globalBiggestRelativeGainCurrentPeriod >= 0
                        ? "+"
                        : "-"}
                      {
                        +props.rewardPeriodInfo
                          .globalBiggestRelativeGainCurrentPeriod
                      }
                      %<br></br>
                      {truncateEthAddress(
                        props.rewardPeriodInfo
                          .globalBiggestRelativeGainCurrentPeriodAddress
                      )}
                    </ExSmallText>
                  </GridCol>
                </GridRow>
                <GridRow>
                  <GridCol padding={0.2}>
                    <ExSmallText>Biggest gain (last):</ExSmallText>
                  </GridCol>
                  <GridCol padding={0.2}>
                    <ExSmallText>
                      {+props.rewardPeriodInfo
                        .globalBiggestRelativeGainPastPeriod >= 0
                        ? "+"
                        : "-"}
                      {
                        +props.rewardPeriodInfo
                          .globalBiggestRelativeGainPastPeriod
                      }
                      %<br></br>
                      {truncateEthAddress(
                        props.rewardPeriodInfo
                          .globalBiggestRelativeGainPastPeriodAddress
                      )}
                    </ExSmallText>
                  </GridCol>
                </GridRow>
                <GridRow>
                  <GridCol padding={0.2}>
                    <ExSmallText>Biggest gain of all time:</ExSmallText>
                  </GridCol>
                  <GridCol padding={0.2}>
                    <ExSmallText>
                      {+props.rewardPeriodInfo.globalBiggestRelativeGain >= 0
                        ? "+"
                        : "-"}
                      {+props.rewardPeriodInfo.globalBiggestRelativeGain}%
                      <br></br>
                      {truncateEthAddress(
                        props.rewardPeriodInfo.globalBiggestRelativeGainAddress
                      )}
                    </ExSmallText>
                  </GridCol>
                </GridRow>
              </Grid>
            </CardFill>
          </Card>
        </Scrollbar>
      </div>
    </div>
  );
};

export default Detail;
