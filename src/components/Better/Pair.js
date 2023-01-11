import { useState } from "react";
import Countdown from "react-countdown";
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
      {/* <div className={styles.image} /> */}
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
      <div
        style={{ width: "80%", height: "80%", zIndex: 1, margin: "0rem 1rem" }}
      >
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
      <div style={{ textAlign: "center" }}>
        <div>
          <b>Time left:</b>
        </div>
        <div style={{ color: "DarkCyan" }}>
          <b>
            <Countdown
              key={
                (+props.instrument.lastEpochClosingTime +
                  +props.instrument.epochDurationInSeconds +
                  +props.instrument.bufferDurationInSeconds) *
                1000
              }
              date={
                (+props.instrument.lastEpochClosingTime +
                  +props.instrument.epochDurationInSeconds +
                  +props.instrument.bufferDurationInSeconds) *
                1000
              }
              onComplete={() => {
                props.getInstrumentBySelectorRefetch().then((result) => {
                  props.setInstrument({ ...props.instrument, ...result.data });
                });
              }}
            />
          </b>
        </div>
      </div>
    </div>
  );
};

export default Pair;
