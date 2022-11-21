import styles from "./Action.module.css";

const Action = (props) => {
  const deposit = () => {};

  const claim = () => {};

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={() => props.write?.()}>
        Deposit
      </button>
      <button className={styles.button} onClick={claim}>
        <div>Claim</div>
      </button>
    </div>
  );
};

export default Action;
