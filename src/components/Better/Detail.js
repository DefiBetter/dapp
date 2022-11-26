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
                    {total - props.pendingRewards > 0
                      ? total - props.pendingRewards
                      : 0}
                  </b>{" "}
                  +{" "}
                  {total > props.pendingRewards ? props.pendingRewards : total}{" "}
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
