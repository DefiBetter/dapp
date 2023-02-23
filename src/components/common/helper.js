import Countdown from "react-countdown";

const trimNumber = (number = 0, count = 0, type = "dp") => {
  number = +number;
  if (type == "dp") {
    return number.toFixed(count);
  } else if (type == "sf") {
    return number.toPrecision(count);
  } else {
    throw `type: ${type} invalid. Can only be "dp" or "sf"`;
  }
};

const timeFormat = (seconds) => {
  const timeFormattedList = [];
  const timeList = [
    ["d", 60 * 60 * 24],
    ["h", 60 * 60],
    ["m", 60],
    ["s", 1],
  ];
  timeList.map((e) => {
    if (seconds >= e[1]) {
      timeFormattedList.push(Math.floor(seconds / e[1]).toString() + e[0]);
      seconds %= e[1];
    }
  });
  return timeFormattedList.join("");
};

const CountdownFormatted = ({ ms }) => {
  console.log("ms", ms);
  return (
    <Countdown
      key={ms}
      date={ms}
      renderer={({ days, hours, minutes, seconds }) => {
        let s = seconds;
        s += days * 60 * 60 * 24;
        s += hours * 60 * 60;
        s += minutes * 60;
        return timeFormat(s);
      }}
    />
  );
};

const instrumentToLabel = (instrument) => {
  if (instrument) {
      return `${instrument.underlyingDescription.replaceAll(" ", "")} ${timeFormat(
    +instrument.epochDurationInSeconds
  )}+${timeFormat(+instrument.bufferDurationInSeconds)} (${(
    +instrument.volatilityMultiplier / 10000
  ).toFixed(2)} SD, ${+instrument.baseError / 10000} E)`;
  }
  return ''
};

const instrumentLabel = (instrument, br = false) => {
  if (instrument) {
    return (
      <div>
        {`${instrument.underlyingDescription.replaceAll(" ", "")} ${timeFormat(
          +instrument.epochDurationInSeconds
        )}+${timeFormat(+instrument.bufferDurationInSeconds)}`}
        {br == true ? <br></br> : ` `}
        {`(${(+instrument.volatilityMultiplier / 10000).toFixed(2)} SD, ${
          +instrument.baseError / 10000
        } E)`}
      </div>
    );
  }
  return ``;
};

export { trimNumber, instrumentLabel, instrumentToLabel, timeFormat, CountdownFormatted };
