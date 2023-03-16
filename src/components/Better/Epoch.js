import { timeFormat } from "../common/helper";

const Epoch = (props) => {
  const endTimeFormatted = () => {
    let milliseconds =
      (+props.instrument.lastEpochClosingTime +
        +props.instrument.epochDurationInSeconds +
        +props.instrument.bufferDurationInSeconds) *
      1000;
    let dateObj = new Date(milliseconds);
    let humanDateFormat = dateObj.toLocaleString();
    return humanDateFormat;
  };

  return (
    <div className="text-xs flex bg-white dark:bg-db-dark rounded-lg py-1.5 px-3 gap-5">
      {/* Left */}
      <div className="flex flex-col">
        <div className="flex justify-between gap-10">
          <div className="font-bold text-db-blue-gray">Gain Fee</div>
          <div>
            {" "}
            {((+props.instrument.gainFee / 10_000 ** 2) * 100).toFixed(4)}%
          </div>
        </div>
        <div className="flex justify-between gap-10">
          <div className="font-bold text-db-blue-gray">Buffer time</div>
          <div>{timeFormat(+props.instrument.bufferDurationInSeconds)}</div>
        </div>
      </div>
      {/* Right */}
      <div className="flex flex-col">
        <div className="flex justify-between gap-10">
          <div className="font-bold text-db-blue-gray">Volatility factor</div>
          <div>{+props.instrument.volatilityMultiplier / 10_000}</div>
        </div>
        <div className="flex justify-between gap-10">
          <div className="font-bold text-db-blue-gray">Epoch close</div>
          <div>{endTimeFormatted()}</div>
        </div>
      </div>
    </div>
  );
};

export default Epoch;
