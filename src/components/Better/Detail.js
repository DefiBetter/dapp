import { useEffect, useState } from "react";
import {
  Card,
  CardBlueBg,
  CardBlueBgBlackBorder,
  CardBlueBgBlackBorderNoShadow,
} from "../common/Card";
import styles from "./Detail.module.css";
import { useContractRead, useNetwork } from "wagmi";
import Button from "../common/Button";
import {
  CenterText,
  ExSmallText,
  MedText,
  NormalText,
  SmallText,
} from "../common/Text";
import { Grid, GridCell2, GridRow } from "../common/Grid";

import { ethers } from "ethers";
import truncateEthAddress from "truncate-eth-address";
import { contractAddresses } from "../../static/contractAddresses";
import Countdown from "react-countdown";

const Detail = (props) => {
  /* account, network, configs */
  // network
  const { chain: activeChain } = useNetwork();

  /* states */
  //
  const [total, setTotal] = useState(0);
  const [rewardPeriodLength, setRewardPeriodLength] = useState(0); // seconds
  const [currentPeriodEndTime, setCurrentPeriodEndTime] = useState(0); // seconds
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

  // current period
  const [
    globalBiggestRelativeGainCurrentPeriodAddress,
    setGlobalBiggestRelativeGainCurrentPeriodAddress,
  ] = useState("");
  const [weekBiggestRelativeGainAmount, setWeekBiggestRelativeGainAmount] =
    useState();

  // past period
  const [
    globalBiggestRelativeGainPastPeriodAddress,
    setGlobalBiggestRelativeGainPastPeriodAddress,
  ] = useState("");
  const [
    lastWeekBiggestRelativeGainAmount,
    setLastWeekBiggestRelativeGainAmount,
  ] = useState();

  // all time
  const [globalBiggestRelativeGain, setGlobalBiggestRelativeGain] = useState();
  const [
    globalBiggestRelativeGainAddress,
    setGlobalBiggestRelativeGainAddress,
  ] = useState("");

  const onInput = (e) => {
    let temp = [...props.binAmountList];
    temp[e.target.id] = e.target.value ? e.target.value : 0;
    props.setBinAmountList(temp);
    props.setBinTotal(temp.reduce((a, b) => +a + +b, 0));
    props.openPositionConfigRefetch();
  };

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

  useContractRead({
    ...props.betterContractConfig,
    functionName: "rewardPeriodStart",
    args: [],
    onError(data) {},
    onSuccess(data) {
      setCurrentPeriodEndTime(+data.toString() + rewardPeriodLength);
    },
  });

  useContractRead({
    ...props.betterContractConfig,
    functionName: "globalBiggestRelativeGainCurrentPeriodAddress",
    args: [],
    onError(data) {},
    onSuccess(data) {
      setGlobalBiggestRelativeGainCurrentPeriodAddress(data);
    },
  });

  useContractRead({
    ...props.betterContractConfig,
    functionName: "globalBiggestRelativeGainPastPeriodAddress",
    args: [],
    onError(data) {},
    onSuccess(data) {
      setGlobalBiggestRelativeGainPastPeriodAddress(data);
    },
  });

  useContractRead({
    ...props.betterContractConfig,
    functionName: "userGainsInfo",
    args: [globalBiggestRelativeGainCurrentPeriodAddress],
    onError(data) {},
    onSuccess(data) {
      setWeekBiggestRelativeGainAmount(data.biggestRelativeGainAmount);
    },
  });

  useContractRead({
    ...props.betterContractConfig,
    functionName: "userGainsInfo",
    args: [globalBiggestRelativeGainPastPeriodAddress],
    onError(data) {},
    onSuccess(data) {
      setLastWeekBiggestRelativeGainAmount(data.biggestRelativeGainAmount);
    },
  });

  useContractRead({
    ...props.betterContractConfig,
    functionName: "globalBiggestRelativeGain",
    args: [],
    onError(data) {},
    onSuccess(data) {
      setGlobalBiggestRelativeGain(data);
    },
  });

  useContractRead({
    ...props.betterContractConfig,
    functionName: "globalBiggestRelativeGainAddress",
    args: [],
    onError(data) {},
    onSuccess(data) {
      setGlobalBiggestRelativeGainAddress(data);
    },
  });

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
                    ? ethers.utils.formatEther(binValue.toString()) +
                      " " +
                      props.nativeGas
                    : null}
                </SmallText>
              </div>
              <div className={styles.bin}>
                <Card
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
                      height: "40%",
                      width: `${100 * props.normalisedBinValueList[i]}%`,
                      float: "right",
                      margin: 0,
                      textAlign: "right",
                      bottom: "0px",
                    }}
                  ></div>
                </Card>
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
            <Button>
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
        <Card>
          <CenterText>
            <b>Epoch Data</b>
          </CenterText>
          <CardBlueBg>
            <Grid padding={0}>
              <GridRow>
                <GridCell2 padding={0}>
                  <ExSmallText>Epoch:</ExSmallText>
                </GridCell2>
                <GridCell2 padding={0}>
                  <ExSmallText>
                    {props.instrument
                      ? props.instrument.epoch.toString()
                      : null}
                  </ExSmallText>
                </GridCell2>
              </GridRow>
              <GridRow>
                <GridCell2 padding={0}>
                  <ExSmallText>Pot size:</ExSmallText>
                </GridCell2>
                <GridCell2 padding={0}>
                  <ExSmallText>
                    {props.epochData
                      ? ethers.utils.formatEther(props.epochData.pot)
                      : null}{" "}
                    {props.nativeGas ? props.nativeGas : null}
                  </ExSmallText>
                </GridCell2>
              </GridRow>
              <GridRow>
                <GridCell2 padding={0}>
                  <ExSmallText>Number of bets:</ExSmallText>
                </GridCell2>
                <GridCell2 padding={0}>
                  <ExSmallText>
                    {props.epochData
                      ? props.epochData.numBets.toString()
                      : null}
                  </ExSmallText>
                </GridCell2>
              </GridRow>
            </Grid>
          </CardBlueBg>
        </Card>
        <Card>
          My Statistics
          <CardBlueBg>
            <Grid padding={0}>
              <GridRow>
                <GridCell2 padding={0}>
                  <ExSmallText>Position value:</ExSmallText>
                </GridCell2>
                <GridCell2 padding={0}>
                  <ExSmallText>
                    {ethers.utils.formatEther(props.userPosition || 0)}{" "}
                    {props.nativeGas}
                  </ExSmallText>
                </GridCell2>
              </GridRow>
              <GridRow>
                <GridCell2 padding={0}>
                  <ExSmallText>Pending rewards:</ExSmallText>
                </GridCell2>
                <GridCell2 padding={0}>
                  <ExSmallText>
                    {props.pendingBetterBalance} {props.nativeGas}
                  </ExSmallText>
                </GridCell2>
              </GridRow>
              <GridRow>
                <GridCell2 padding={0}>
                  <ExSmallText>Number of games:</ExSmallText>
                </GridCell2>
                <GridCell2 padding={0}>
                  <ExSmallText>
                    {props.userGainsInfo?.numberOfGames.toString()}
                  </ExSmallText>
                </GridCell2>
              </GridRow>
              <GridRow>
                <GridCell2 padding={0}>
                  <ExSmallText>Biggest gain:</ExSmallText>
                </GridCell2>
                <GridCell2 padding={0}>
                  <ExSmallText>
                    {Number(props.userGainsInfo?.biggestRelativeGainAmount) >= 0
                      ? "+"
                      : "-"}
                    {Number(props.userGainsInfo?.biggestRelativeGainAmount)}%
                  </ExSmallText>
                </GridCell2>
              </GridRow>
              <GridRow>
                <GridCell2 padding={0}>
                  <ExSmallText>Most recent gain:</ExSmallText>
                </GridCell2>
                <GridCell2 padding={0}>
                  <ExSmallText>
                    {Number(
                      props.userGainsInfo?.mostRecentRelativeGainAmount
                    ) >= 0
                      ? "+"
                      : "-"}
                    {Number(props.userGainsInfo?.mostRecentRelativeGainAmount)}%
                  </ExSmallText>
                </GridCell2>
              </GridRow>
            </Grid>
          </CardBlueBg>
        </Card>
        <Card>
          Better Gains
          <CardBlueBg>
            <Grid>
              <GridRow>
                <GridCell2 padding={0}>
                  <ExSmallText>Time left for current week:</ExSmallText>
                </GridCell2>
                <GridCell2 padding={0}>
                  <ExSmallText>
                    {currentPeriodEndTime ? (
                      <Countdown
                        key={currentPeriodEndTime * 1000}
                        date={currentPeriodEndTime * 1000}
                      />
                    ) : null}
                  </ExSmallText>
                </GridCell2>
              </GridRow>
              <GridRow>
                <GridCell2 padding={0}>
                  <ExSmallText>Week's biggest gain so far:</ExSmallText>
                </GridCell2>
                <GridCell2 padding={0}>
                  <ExSmallText>
                    {Number(weekBiggestRelativeGainAmount) >= 0 ? "+" : "-"}
                    {Number(weekBiggestRelativeGainAmount)}%<br></br>
                    {truncateEthAddress(
                      globalBiggestRelativeGainCurrentPeriodAddress
                    )}
                  </ExSmallText>
                </GridCell2>
              </GridRow>
              <GridRow>
                <GridCell2 padding={0}>
                  <ExSmallText>Last week's biggest gain:</ExSmallText>
                </GridCell2>
                <GridCell2 padding={0}>
                  <ExSmallText>
                    {Number(lastWeekBiggestRelativeGainAmount) >= 0 ? "+" : "-"}
                    {Number(lastWeekBiggestRelativeGainAmount)}%<br></br>
                    {truncateEthAddress(
                      globalBiggestRelativeGainPastPeriodAddress
                    )}
                  </ExSmallText>
                </GridCell2>
              </GridRow>
              <GridRow>
                <GridCell2 padding={0}>
                  <ExSmallText>Biggest gain of all time:</ExSmallText>
                </GridCell2>
                <GridCell2 padding={0}>
                  <ExSmallText>
                    {Number(globalBiggestRelativeGain) >= 0 ? "+" : "-"}
                    {Number(globalBiggestRelativeGain)}%<br></br>
                    {truncateEthAddress(globalBiggestRelativeGainAddress)}
                  </ExSmallText>
                </GridCell2>
              </GridRow>
            </Grid>
          </CardBlueBg>
        </Card>
      </div>
    </div>
  );
};

export default Detail;
