import { useState } from "react";
import Dropdown from "../common/Dropdown";
import { instrumentLabel } from "../common/helper";
import styles from "./Pair.module.css";

const Pair = (props) => {
  const [showInstrumentList, setShowInstrumentList] = useState(false);
  // const [currentPair, setCurrentPair] = useState("");

  const toggleOptions = () => {
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
      {/* <div className={styles.networkContainer} onClick={toggleOptions}>
        <div
          className={styles.network}
        >{`${props.instrument?.underlyingDescription.replaceAll(" ", "")} ${
          (+props.instrument?.epochDurationInSeconds.toString() +
            +props.instrument?.bufferDurationInSeconds.toString()) /
          60
        }m (${(
          +props.instrument?.volatilityMultiplier.toString() / 10000
        ).toFixed(1)} SD ${
          +props.instrument?.baseError.toString() / 10000
        } E)`}</div>
        {showInstrumentList
          ? props.instrumentList?.map((instrument) => (
              <Instrument instrument={instrument} />
            ))
          : null}
      </div> */}
      <div style={{ width: "80%", height: "60%", zIndex: 1 }}>
        <Dropdown
          currentItem={props.instrument.underlyingDescription}
          currentItemLabel={instrumentLabel(props.instrument)}
          setCurrentItem={props.setInstrument}
          itemList={props.instrumentList}
          itemLabelList={props.instrumentList.map((instrument) => {
            return instrumentLabel(instrument);
          })}
        />
      </div>
    </div>
  );
};

export default Pair;
