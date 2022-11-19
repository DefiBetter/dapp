import { useState } from "react";
import styles from "./Pair.module.css";

const Pair = (props) => {
  const [showInstrumentList, setShowInstrumentList] = useState(false);
  // const [currentPair, setCurrentPair] = useState("");

  const toggleOptions = () => {
    console.log("toggled");
    setShowInstrumentList(!showInstrumentList);
  };

  const Instrument = ({ instrument }) => {
    return (
      <div
        className={styles.option}
        onClick={() => {
          props.setInstrument(instrument);
        }}
      >
        {`${instrument?.underlyingDescription.replaceAll(" ", "")} ${
          (+instrument?.epochDurationInSeconds.toString() +
            +instrument?.bufferDurationInSeconds.toString()) /
          60
        }m (${(+instrument?.volatilityMultiplier.toString() / 10000).toFixed(
          1
        )} SD  E)`}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.image} />
      <div className={styles.networkContainer} onClick={toggleOptions}>
        <div className={styles.network}>{`${
          props.instrument?.underlyingDescription
        } ${
          (+props.instrument?.epochDurationInSeconds.toString() +
            +props.instrument?.bufferDurationInSeconds.toString()) /
          60
        }m (${(
          +props.instrument?.volatilityMultiplier.toString() / 10000
        ).toFixed(1)} SD  E)`}</div>
        {showInstrumentList
          ? props.instrumentList?.map((instrument) => (
              <Instrument instrument={props.instrument} />
            ))
          : null}
      </div>
    </div>
  );
};

export default Pair;
