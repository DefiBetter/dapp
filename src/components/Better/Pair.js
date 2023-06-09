import { useEffect, useState } from "react";
import Countdown from "react-countdown";
import Dropdown from "../common/Dropdown";
import { instrumentToLabel } from "../common/helper";

const Pair = (props) => {
  const [showInstrumentList, setShowInstrumentList] = useState(false);
  // const [currentPair, setCurrentPair] = useState("");

  const toggleOptions = () => {
    setShowInstrumentList(!showInstrumentList);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
        <Dropdown
          currentItem={props.instrument}
          currentItemLabel={instrumentToLabel(props.instrument, false)}
          type="instrument"
          setCurrentItem={props.setInstrument}
          itemList={props.instrumentList}
          itemLabelList={props.instrumentList.map((instrument) => {
            return instrumentToLabel(instrument);
          })}
        />
        <div className="flex flex-col justify-center items-center m-auto">
          <div className="font-bold">Time left</div>
          <div className="font-bold text-db-cyan-process">
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
                  props.setInstrument({
                    ...props.instrument,
                    ...result.data,
                  });
                });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pair;
