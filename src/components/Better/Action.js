import styles from "./Action.module.css";

const Action = (props) => {
  const deposit = () => {
    props.depositWrite?.();
  };

  const claim = () => {
    props.claimWrite?.();
  };

  return (
    <div className={styles.container}>
      <button className={styles.button} onClick={deposit}>
        Deposit
      </button>
      <button className={styles.button} onClick={claim}>
        <div>Claim</div>
      </button>
    </div>
  );
};

export default Action;
