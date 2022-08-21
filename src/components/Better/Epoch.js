import { useState } from "react";
import styles from "./Epoch.module.css";

const Epoch = (props) => {
  const [timeRemaining, setTimeRemaining] = useState(599); // seconds
  const [endTime, setEndTime] = useState(1661091710); // unix

  const timeRemainingFormatted = () => {
    let minutes = String((timeRemaining / 60).toFixed(0)).padStart(2, "0");
    let seconds = String(timeRemaining % 60).padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const endTimeFormatted = () => {
    let milliseconds = endTime * 1000;
    let dateObj = new Date(milliseconds);
    let humanDateFormat = dateObj.toLocaleString();
    return humanDateFormat;
  };

  return (
    <div className={styles.container}>
      <div className={styles.timeRemaining}>
        <div>
          <b>Epoch time remaining:</b>
        </div>
        <div className={styles.time}>
          <b>{timeRemainingFormatted()}</b>
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
