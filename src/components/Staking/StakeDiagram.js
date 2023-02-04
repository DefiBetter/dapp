import { useContext } from "react";
import WindowContext from "../../context/WindowContext";
import { Card } from "../common/Card";
import styles from "./StakeDiagram.module.css";

const StakeDiagram = (props) => {
  const windowDimension = useContext(WindowContext);
  return (
    <div
      className={styles.container}
      style={
        ["xxs"].filter((b) => b == windowDimension.screen).length > 0
          ? { height: "unset" }
          : {}
      }
    >
      <div
        style={
          ["xxs"].filter((b) => b == windowDimension.screen).length > 0
            ? {
                position: "unset",
                width: "100%",
              }
            : {}
        }
        className={styles.front}
      >
        <Card>
          <p className={styles.text}>
            <span className={styles.textFancy}>Stake</span>
            {["xxs"].filter((b) => b == windowDimension.screen).length > 0 ? (
              "\xa0\xa0"
            ) : (
              <br></br>
            )}
            <span>
              <b>{props.stakeName}</b>
            </span>
            {["xxs"].filter((b) => b == windowDimension.screen).length > 0 ? (
              "\xa0\xa0"
            ) : (
              <br></br>
            )}
            <span className={styles.textFancy}>to receive</span>
            {["xxs"].filter((b) => b == windowDimension.screen).length > 0 ? (
              "\xa0\xa0"
            ) : (
              <br></br>
            )}
            <span>
              <b>{props.rewardName}</b>
            </span>
          </p>
        </Card>
      </div>
      <div className={styles.back}>
        <button className={styles.asset}>
          <b>{props.stakeSymbol}</b>
        </button>
        <div className={styles.arrow}>
          <svg viewBox="0 0 170 15" xmlns="http://www.w3.org/2000/svg">
            <polygon points={`0,5 0,10 160,10 160,15 170,7.5 160,0 160,5`} />
          </svg>
        </div>
        <button className={styles.asset}>
          <b>{props.rewardSymbol}</b>
        </button>
      </div>
    </div>
  );
};

export default StakeDiagram;
