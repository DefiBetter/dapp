import { useState } from "react";
import styles from "./Pair.module.css";

const Pair = (props) => {
  const [showOptions, setShowOptions] = useState(false);
  const [currentPair, setCurrentPair] = useState("");

  let sampleOptions = ["Ethereum", "Avalanche"];

  const toggleOptions = () => {
    console.log("toggled");
    setShowOptions(!showOptions);
  };

  return (
    <div className={styles.container}>
      <div className={styles.image} />
      <div className={styles.networkContainer} onClick={toggleOptions}>
        <div className={styles.network}>
          {currentPair == "" ? "Select pair..." : currentPair}
        </div>
        {showOptions
          ? sampleOptions.map((option) => (
              <div
                className={styles.option}
                onClick={() => {
                  setCurrentPair(`${option}`);
                  console.log(currentPair);
                }}
              >
                {option}
              </div>
            ))
          : null}
      </div>
    </div>
  );
};

export default Pair;
