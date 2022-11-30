import { useEffect, useState } from "react";
import styled from "styled-components";
import { Card, CardBlueBg, CardBlueBgBlackBorder } from "../common/Card";
import styles from "./Detail.module.css";
import DeFiBetterV1ABI from "../../static/ABI/DeFiBetterV1ABI.json";
import {
  useAccount,
  useContractRead,
  useNetwork,
  usePrepareContractWrite,
  useContractWrite,
} from "wagmi";
import Button from "../common/Button";
import { MedText, NormalText, SmallText } from "../common/Text";
import { Grid, GridCell2, GridRow } from "../common/Grid";

import { ethers } from "ethers";

const Detail = (props) => {
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setTotal(
      props.binAmountList.reduce((a, b) => Number(a) + Number(b), 0).toString()
    );
    console.log("total", total);
  }, [props]);

  const onInput = (e) => {
    let temp = [...props.binAmountList];
    temp[e.target.id] = e.target.value ? e.target.value : 0;
    props.setBinAmountList(temp);
    console.log("binAmountList", temp);
  };

  const totalAmount = 10;
  const gasTokenSymbol = "BNB";

  console.log("props.userPosition", props.userPosition);

  return (
    <div className={styles.container}>
      <div className={styles.binContainer}>
        <div className={styles.bin}>
          <div>
            <div className={styles.binChoice}>
              <Button>Normal</Button>
              <Button>Implied</Button>
            </div>
            <CardBlueBgBlackBorder>
              <MedText>
                <NormalText>
                  Total: <b>{total}</b>
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
        </div>
        {props.epochData?.binValues.map((bin, i) => {
          console.log(
            "100 * props.normalisedBinValueList[i]",
            props.normalisedBinValueList[i]
          );
          return (
            // <div className={styles.bin}>
            //   <div className={styles.binUpper}>{bin.upper}</div>
            //   <input type="number" min={0} id={`${i}`} onInput={onInput} />
            // </div>
            <div className={styles.bin}>
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
                  }}
                ></div>
              </CardBlueBgBlackBorder>
            </div>
          );
        })}
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
                  <SmallText>5d 10h 14min 32s</SmallText>
                </GridCell2>
              </GridRow>
              <GridRow>
                <GridCell2>
                  <SmallText>Week's biggest gain so far:</SmallText>
                </GridCell2>
                <GridCell2>
                  <SmallText>
                    +20.20%<br></br>0xhash
                  </SmallText>
                </GridCell2>
              </GridRow>
              <GridRow>
                <GridCell2>
                  <SmallText>Last week's biggest gain:</SmallText>
                </GridCell2>
                <GridCell2>
                  <SmallText>
                    +20.20%<br></br>0xhash
                  </SmallText>
                </GridCell2>
              </GridRow>
              <GridRow>
                <GridCell2>
                  <SmallText>Biggest gain of all time:</SmallText>
                </GridCell2>
                <GridCell2>
                  <SmallText>
                    +20.20%<br></br>0xhash
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
