import styles from "./StakeDiagram.module.css";

const StakeDiagram = (props) => {
  return (
    <div className={styles.container}>
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
      <button className={styles.front}>
        <div className={styles.textFancy}>Stake</div>
        <div>
          <b>{props.stakeName}</b>
        </div>
        <div className={styles.textFancy}>to receive</div>
        <div>
          <b>{props.rewardName}</b>
        </div>
      </button>
    </div>
  );
};

export default StakeDiagram;
