import { useEffect, useState } from "react";
import styles from "./Epoch.module.css";
import Countdown from "react-countdown";

const Epoch = (props) => {
  const countdownDate = () => {
    return (
      (+props.instrument?.lastEpochClosingTime +
        +props.instrument?.epochDurationInSeconds +
        +props.instrument?.bufferDurationInSeconds) *
      1000
    );
  };

  const endTimeFormatted = () => {
    let milliseconds =
      (+props.instrument?.lastEpochClosingTime +
        +props.instrument?.epochDurationInSeconds +
        +props.instrument?.bufferDurationInSeconds) *
      1000;
    let dateObj = new Date(milliseconds);
    let humanDateFormat = dateObj.toLocaleString();
    console.log("humanDateFormat", humanDateFormat);
    return humanDateFormat;
  };

  console.log("isRefetching", props.getInstrumentBySelectorIsRefetching);
  return (
    <div className={styles.container}>
      <div className={styles.timeRemaining}>
        <div>
          <b>Epoch time remaining:</b>
        </div>
        <div className={styles.time}>
          <Countdown
            key={
              (+props.instrument?.lastEpochClosingTime +
                +props.instrument?.epochDurationInSeconds +
                +props.instrument?.bufferDurationInSeconds) *
              1000
            }
            date={
              (+props.instrument?.lastEpochClosingTime +
                +props.instrument?.epochDurationInSeconds +
                +props.instrument?.bufferDurationInSeconds) *
              1000
            }
            onComplete={() => {
              console.log("countdown complete");
              props.getInstrumentBySelectorRefetch().then((result) => {
                console.log("countdown result", result);
                props.setInstrument({ ...props.instrument, ...result.data });
              });
              console.log("countdown refetch");
              console.log("countdown instrument", props.instrument);
            }}
          />

          {/* <b>{timeRemainingFormatted()}</b> */}
        </div>
      </div>
      <div className={styles.endTime}>
        <div>
          <b>Epoch end:</b>
        </div>
        <div>{endTimeFormatted()}</div>
      </div>
    </div>
  );
};

export default Epoch;
