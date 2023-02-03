import { useEffect, useState } from "react";
import styles from "./Epoch.module.css";
import Countdown from "react-countdown";
import { Card } from "../common/Card";
import { Grid, GridCol, GridRow } from "../common/Grid";
import { timeFormat } from "../common/helper";
import { BlueText, FancyText } from "../common/Text";

const Epoch = (props) => {
  const endTimeFormatted = () => {
    let milliseconds =
      (+props.instrument.lastEpochClosingTime +
        +props.instrument.epochDurationInSeconds +
        +props.instrument.bufferDurationInSeconds) *
      1000;
    let dateObj = new Date(milliseconds);
    let humanDateFormat = dateObj.toLocaleString();
    return humanDateFormat;
  };

  // return (
  //   <div className={styles.container}>
  //     <div className={styles.timeRemaining}>
  //       <div>
  //         <b>Epoch time remaining:</b>
  //       </div>
  //       <div className={styles.time}>
  //         <Countdown
  //           key={
  //             (+props.instrument.lastEpochClosingTime +
  //               +props.instrument.epochDurationInSeconds +
  //               +props.instrument.bufferDurationInSeconds) *
  //             1000
  //           }
  //           date={
  //             (+props.instrument.lastEpochClosingTime +
  //               +props.instrument.epochDurationInSeconds +
  //               +props.instrument.bufferDurationInSeconds) *
  //             1000
  //           }
  //           onComplete={() => {
  //             props.getInstrumentBySelectorRefetch().then((result) => {
  //               props.setInstrument({ ...props.instrument, ...result.data });
  //             });
  //           }}
  //         ></Countdown>

  //         {/* <b>{timeRemainingFormatted()}</b> */}
  //       </div>
  //     </div>
  //     <div className={styles.endTime}>
  //       <div>
  //         <b>Epoch end:</b>
  //       </div>
  //       <div>{endTimeFormatted()}</div>
  //     </div>
  //   </div>
  // );

  return (
    <div style={{ alignSelf: "center" }}>
      <Card
        padding={0}
        style={{
          fontSize: "0.75rem",
          padding: "0rem 1rem",
          justifyContent: "space-between",
        }}
        borderColor={"black"}
        borderWidth={0.1}
        backgroundColor={"blue"}
      >
        <Grid padding={0} style={{ borderSpacing: "0rem" }}>
          <GridRow>
            <GridCol padding={0}>
              <BlueText>
                <b>Gain fee:</b>
              </BlueText>
            </GridCol>
            <GridCol padding={0} style={{ textAlign: "center" }}>
              {(+props.instrument.gainFee / 10_000 ** 2) * 100}%
            </GridCol>
            <GridCol padding={0}>
              <BlueText>
                <b>Fees:</b>
              </BlueText>
            </GridCol>
            <GridCol padding={0} style={{ textAlign: "center" }}>
              {(+props.instrument.flatFee / 10_000 ** 2) * 100}%
            </GridCol>
          </GridRow>
          <GridRow>
            <GridCol padding={0}>
              <BlueText>
                <b>Buffer time:</b>
              </BlueText>
            </GridCol>
            <GridCol padding={0} style={{ textAlign: "center" }}>
              {timeFormat(+props.instrument.bufferDurationInSeconds)}
            </GridCol>
            <GridCol padding={0}>
              <BlueText>
                <b>Volatility factor:</b>
              </BlueText>
            </GridCol>
            <GridCol padding={0} style={{ textAlign: "center" }}>
              {+props.instrument.volatilityMultiplier / 10_000}
            </GridCol>
          </GridRow>
          <GridRow>
            <GridCol padding={0}>
              <BlueText>
                <b>Epoch close:</b>
              </BlueText>
            </GridCol>
            <GridCol padding={0} style={{ textAlign: "center" }}>
              {endTimeFormatted()}
            </GridCol>
            <GridCol padding={0}>
              <BlueText>
                <b>Base error:</b>
              </BlueText>
            </GridCol>
            <GridCol padding={0} style={{ textAlign: "center" }}>
              {+props.instrument.baseError / 10_000}
            </GridCol>
          </GridRow>
        </Grid>
      </Card>
    </div>
  );
};

export default Epoch;
