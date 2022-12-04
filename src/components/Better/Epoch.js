import { useEffect, useState } from "react";
import styles from "./Epoch.module.css";
import Countdown from "react-countdown";

const Epoch = (props) => {
  console.log("props.instrument", props.instrument);
  console.log(
    `props.instrument?.lastEpochClosingTime -
    props.instrument?.epochDurationInSeconds -
    props.instrument?.bufferDurationInSeconds`,
    +props.instrument?.lastEpochClosingTime -
      +props.instrument?.epochDurationInSeconds -
      +props.instrument?.bufferDurationInSeconds
  );
  const [timeRemaining, setTimeRemaining] = useState(0); // seconds
  const [endTime, setEndTime] = useState(1661091710); // unix

  const now = Date.now() + timeRemaining * 1000;

  const calcEpoch = () => {
    if (props.instrument == null) {
      return;
    }

    setTimeRemaining(
      Date.now() -
        props.instrument?.lastEpochClosingTime -
        props.instrument?.epochDurationInSeconds -
        props.instrument?.bufferDurnationInSeconds
    );

    setEndTime(
      props.instrument.lastEpochClosingTime +
        props.instrument.epochDurationInSeconds +
        props.instrument.bufferDurnationInSeconds
    );
  };

  const endTimeFormatted = () => {
    let milliseconds =
      (props.instrument?.lastEpochClosingTime +
        props.instrument?.epochDurationInSeconds +
        props.instrument?.bufferDurnationInSeconds) *
      1000;
    let dateObj = new Date(milliseconds);
    let humanDateFormat = dateObj.toLocaleString();
    console.log("humanDateFormat", humanDateFormat);
    return humanDateFormat;
  };

  // useEffect(() => {
  //   calcEpoch();
  // }, []);

  console.log("timeRemaining", timeRemaining);

  return (
    <div className={styles.container}>
      <div className={styles.timeRemaining}>
        <div>
          <b>Epoch time remaining:</b>
        </div>
        <div className={styles.time}>
          <Countdown
            date={
              props.instrument
                ? Date.now() +
                  (+props.instrument?.lastEpochClosingTime -
                    +props.instrument?.epochDurationInSeconds -
                    +props.instrument?.bufferDurationInSeconds) *
                    1000
                : 0
            }
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
