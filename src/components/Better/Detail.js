import { useEffect, useState } from "react";
import { Card, CardBlueBg, CardBlueBgBlackBorder } from "../common/Card";
import styles from "./Detail.module.css";
import { useContractRead, useNetwork } from "wagmi";
import Button from "../common/Button";
import { MedText, NormalText, SmallText } from "../common/Text";
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
  const [timeLeftCurrentPeriod, setTimeLeftCurrentPeriod] = useState(0); // seconds
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
  console.log("binBorderList", binBorderList);

  useEffect(() => {
    setTotal(
      props.binAmountList.reduce((a, b) => Number(a) + Number(b), 0).toString()
    );
    console.log("total", total);

    if (props.epochData) {
      console.log(
        `props.epochData.binValues.map((bin, i) =>
      ethers.utils.formatEther(
        props.epochData.binSize.mul(i + 1).add(props.epochData.binStart)
      )
    )`,
        props.epochData.binValues.map((bin, i) =>
          ethers.utils.formatEther(
            props.epochData.binSize.mul(i + 1).add(props.epochData.binStart)
          )
        )
      );

      const t = props.epochData.binValues.map((bin, i) =>
        (+ethers.utils.formatEther(
          props.epochData.binSize.mul(i + 1).add(props.epochData.binStart)
        )).toPrecision(5)
      );
      setBinBorderList([
        (+ethers.utils.formatEther(props.epochData.binStart)).toPrecision(5),
        ...t,
      ]);
      console.log("binBorderList", binBorderList);
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
    console.log("binAmountList", temp);
  };

  const totalAmount = 10;
  const gasTokenSymbol = "BNB";

  console.log("props.userPosition", props.userPosition);

  useContractRead({
    ...props.betterContractConfig,
    functionName: "rewardPeriodLength",
    args: [],
    onError(data) {
      console.log("rewardPeriodLength error", data);
    },
    onSuccess(data) {
      setRewardPeriodLength(data.toString());
      console.log("rewardPeriodLength", data.toString());
    },
  });

  useContractRead({
    ...props.betterContractConfig,
    functionName: "rewardPeriodStart",
    args: [],
    onError(data) {
      console.log("rewardPeriodStart error", data);
    },
    onSuccess(data) {
      console.log(
        "rewardPeriodStart",
        rewardPeriodLength - (Date.now() / 1000 - +data.toString())
      );
      setTimeLeftCurrentPeriod(
        rewardPeriodLength - (Date.now() / 1000 - +data.toString())
      );
    },
    watch: true,
  });

  useContractRead({
    ...props.betterContractConfig,
    functionName: "globalBiggestRelativeGainCurrentPeriodAddress",
    args: [],
    onError(data) {
      console.log("globalBiggestRelativeGainCurrentPeriodAddress error", data);
    },
    onSuccess(data) {
      console.log("globalBiggestRelativeGainCurrentPeriodAddress", data);
      setGlobalBiggestRelativeGainCurrentPeriodAddress(data);
    },
  });

  useContractRead({
    ...props.betterContractConfig,
    functionName: "globalBiggestRelativeGainPastPeriodAddress",
    args: [],
    onError(data) {
      console.log("globalBiggestRelativeGainPastPeriodAddress error", data);
    },
    onSuccess(data) {
      console.log("globalBiggestRelativeGainPastPeriodAddress", data);
      setGlobalBiggestRelativeGainPastPeriodAddress(data);
    },
  });

  useContractRead({
    ...props.betterContractConfig,
    functionName: "userGainsInfo",
    args: [globalBiggestRelativeGainCurrentPeriodAddress],
    onError(data) {
      console.log("userGainsInfo.biggestRelativeGainAmount error", data);
    },
    onSuccess(data) {
      console.log(
        "userGainsInfo.biggestRelativeGainAmount",
        data.biggestRelativeGainAmount
      );
      setWeekBiggestRelativeGainAmount(data.biggestRelativeGainAmount);
    },
  });

  useContractRead({
    ...props.betterContractConfig,
    functionName: "userGainsInfo",
    args: [globalBiggestRelativeGainPastPeriodAddress],
    onError(data) {
      console.log("userGainsInfo.biggestRelativeGainAmount (past) error", data);
    },
    onSuccess(data) {
      console.log(
        "userGainsInfo.biggestRelativeGainAmount (past)",
        data.biggestRelativeGainAmount
      );
      setLastWeekBiggestRelativeGainAmount(data.biggestRelativeGainAmount);
    },
  });

  useContractRead({
    ...props.betterContractConfig,
    functionName: "globalBiggestRelativeGain",
    args: [],
    onError(data) {
      console.log("globalBiggestRelativeGain error", data);
    },
    onSuccess(data) {
      console.log("globalBiggestRelativeGain", data);
      setGlobalBiggestRelativeGain(data);
    },
  });

  useContractRead({
    ...props.betterContractConfig,
    functionName: "globalBiggestRelativeGainAddress",
    args: [],
    onError(data) {
      console.log("globalBiggestRelativeGainAddress error", data);
    },
    onSuccess(data) {
      console.log("globalBiggestRelativeGainAddress", data);
      setGlobalBiggestRelativeGainAddress(data);
    },
  });

  props.epochData?.binValues.map((bin, i) => {
    console.log(
      "bin borders",
      ethers.utils.formatEther(
        props.epochData.binSize.mul(i).add(props.epochData.binStart)
      )
    );
  });

  return (
    <div className={styles.container}>
      <div className={styles.binContainer}>
        <div className={styles.bin}>
          <CardBlueBgBlackBorder>
            <MedText>
              <NormalText>
                Total position size:{" "}
                <b>
                  {total} {contractAddresses[activeChain?.network]?.nativeGas}
                </b>
              </NormalText>
            </MedText>
            <SmallText>
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
            </SmallText>
          </CardBlueBgBlackBorder>
        </div>
        {props.epochData?.binValues.map((binValue, i) => {
          console.log(
            "100 * props.normalisedBinValueList[i]",
            props.normalisedBinValueList[i]
          );
          console.log(
            "binValue",
            ethers.utils.formatEther(binValue.toString())
          );
          return (
            // <div className={styles.bin}>
            //   <div className={styles.binUpper}>{bin.upper}</div>
            //   <input type="number" min={0} id={`${i}`} onInput={onInput} />
            // </div>
            <div className={styles.bin}>
              <div>
                {props.epochData
                  ? binBorderList[props.epochData.binValues.length - i]
                  : null}
              </div>
              <CardBlueBgBlackBorder>
                <input
                  type="number"
                  min={0}
                  id={`${i}`}
                  onInput={onInput}
                  value={
                    props.binAmountList[i] > 0 ? props.binAmountList[i] : ""
                  }
                  placeholder={0}
                />
                <div
                  style={{
                    backgroundColor: "#80A9E4",
                    height: "40%",
                    width: `${100 * props.normalisedBinValueList[i]}%`,
                    float: "right",
                    margin: 0,
                    textAlign: "right",
                  }}
                >
                  {+ethers.utils.formatEther(binValue.toString()) > 0
                    ? +ethers.utils.formatEther(binValue.toString())
                    : null}
                </div>
              </CardBlueBgBlackBorder>
            </div>
          );
        })}
        <div className={styles.bin}>
          <div>{binBorderList[0]}</div>
          <div className={styles.binChoice}>
            <Button>Normal</Button>
            <Button>Implied</Button>
          </div>
        </div>
      </div>
      <div className={styles.statsContainer}>
        <Card>
          Epoch Data
          <CardBlueBg>
            <Grid>
              <GridRow>
                <GridCell2>
                  <SmallText>Epoch:</SmallText>
                </GridCell2>
                <GridCell2>
                  <SmallText>
                    {props.instrument
                      ? props.instrument.epoch.toString()
                      : null}
                  </SmallText>
                </GridCell2>
              </GridRow>
              <GridRow>
                <GridCell2>
                  <SmallText>Pot size:</SmallText>
                </GridCell2>
                <GridCell2>
                  <SmallText>
                    {props.epochData
                      ? ethers.utils.formatEther(props.epochData.pot)
                      : null}{" "}
                    {props.nativeGas ? props.nativeGas : null}
                  </SmallText>
                </GridCell2>
              </GridRow>
              <GridRow>
                <GridCell2>
                  <SmallText>Number of bets:</SmallText>
                </GridCell2>
                <GridCell2>
                  <SmallText>
                    {props.epochData
                      ? props.epochData.numBets.toString()
                      : null}
                  </SmallText>
                </GridCell2>
              </GridRow>
            </Grid>
          </CardBlueBg>
        </Card>
        <Card>
          My Statistics
          <CardBlueBg>
            <Grid>
              <GridRow>
                <GridCell2>
                  <SmallText>Position value:</SmallText>
                </GridCell2>
                <GridCell2>
                  <SmallText>
                    {props.userPosition
                      ?.slice(0, 1)[0]
                      .map((v, i) => ethers.utils.formatEther(v))
                      .reduce((a, b) => +a + +b)}{" "}
                    {props.nativeGas}
                  </SmallText>
                </GridCell2>
              </GridRow>
              <GridRow>
                <GridCell2>
                  <SmallText>Pending rewards:</SmallText>
                </GridCell2>
                <GridCell2>
                  <SmallText>
                    {props.pendingBetterBalance} {props.nativeGas}
                  </SmallText>
                </GridCell2>
              </GridRow>
              <GridRow>
                <GridCell2>
                  <SmallText>Number of games:</SmallText>
                </GridCell2>
                <GridCell2>
                  <SmallText>
                    {props.userGainsInfo?.numberOfGames.toString()}
                  </SmallText>
                </GridCell2>
              </GridRow>
              <GridRow>
                <GridCell2>
                  <SmallText>Biggest gain:</SmallText>
                </GridCell2>
                <GridCell2>
                  <SmallText>
                    {Number(props.userGainsInfo?.biggestRelativeGainAmount) >= 0
                      ? "+"
                      : "-"}
                    {Number(props.userGainsInfo?.biggestRelativeGainAmount)}%
                  </SmallText>
                </GridCell2>
              </GridRow>
              <GridRow>
                <GridCell2>
                  <SmallText>Most recent gain:</SmallText>
                </GridCell2>
                <GridCell2>
                  <SmallText>
                    {Number(
                      props.userGainsInfo?.mostRecentRelativeGainAmount
                    ) >= 0
                      ? "+"
                      : "-"}
                    {Number(props.userGainsInfo?.mostRecentRelativeGainAmount)}%
                  </SmallText>
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
                <GridCell2>
                  <SmallText>Time left for current week:</SmallText>
                </GridCell2>
                <GridCell2>
                  <SmallText>
                    {timeLeftCurrentPeriod.toFixed(2)}
                    {timeLeftCurrentPeriod ? (
                      <Countdown
                        key={Date.now() + timeLeftCurrentPeriod * 1000}
                        date={Date.now() + timeLeftCurrentPeriod * 1000}
                      />
                    ) : null}
                  </SmallText>
                </GridCell2>
              </GridRow>
              <GridRow>
                <GridCell2>
                  <SmallText>Week's biggest gain so far:</SmallText>
                </GridCell2>
                <GridCell2>
                  <SmallText>
                    {Number(weekBiggestRelativeGainAmount) >= 0 ? "+" : "-"}
                    {Number(weekBiggestRelativeGainAmount)}%<br></br>
                    {truncateEthAddress(
                      globalBiggestRelativeGainCurrentPeriodAddress
                    )}
                  </SmallText>
                </GridCell2>
              </GridRow>
              <GridRow>
                <GridCell2>
                  <SmallText>Last week's biggest gain:</SmallText>
                </GridCell2>
                <GridCell2>
                  <SmallText>
                    {Number(lastWeekBiggestRelativeGainAmount) >= 0 ? "+" : "-"}
                    {Number(lastWeekBiggestRelativeGainAmount)}%<br></br>
                    {truncateEthAddress(
                      globalBiggestRelativeGainPastPeriodAddress
                    )}
                  </SmallText>
                </GridCell2>
              </GridRow>
              <GridRow>
                <GridCell2>
                  <SmallText>Biggest gain of all time:</SmallText>
                </GridCell2>
                <GridCell2>
                  <SmallText>
                    {Number(globalBiggestRelativeGain) >= 0 ? "+" : "-"}
                    {Number(globalBiggestRelativeGain)}%<br></br>
                    {truncateEthAddress(globalBiggestRelativeGainAddress)}
                  </SmallText>
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
