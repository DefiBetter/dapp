import styled from "styled-components";
import { Card, CardBlueBg } from "../common/Card";
import styles from "./Detail.module.css";

const Detail = (props) => {
  let sampleBins = [
    { upper: 5, lower: 4.5 },
    { upper: 4.5, lower: 4 },
    { upper: 4, lower: 3.5 },
    { upper: 3.5, lower: 3 },
    { upper: 3, lower: 2.5 },
    { upper: 2.5, lower: 2 },
    { upper: 2, lower: 1.5 },
  ];

  const onInput = () => {};

  const totalAmount = 10;
  const gasTokenSymbol = "BNB";

  return (
    <div className={styles.container}>
      <div className={styles.binContainer}>
        <div className={styles.totalAmount}>
          Adding:{" "}
          <b>
            {totalAmount} {gasTokenSymbol}
          </b>
        </div>
        {sampleBins.map((bin, i) => {
          return (
            <div className={styles.bin}>
              <div className={styles.binUpper}>{bin.upper}</div>
              <input type="number" min={0} id={`${i}`} onInput={onInput} />
            </div>
          );
        })}
      </div>
      <div className={styles.statsContainer}>
        <Card>
          My Statistics
          <CardBlueBg>
            <b>Position value: 123 BNB</b>
            <br></br>
            Number of games: 102
          </CardBlueBg>
        </Card>
        <Card>Better Gains</Card>
        <Card>Epoch Data</Card>
      </div>
    </div>
  );
};

export default Detail;
