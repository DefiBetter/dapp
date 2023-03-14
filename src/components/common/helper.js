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
  const timeList = [60 * 60 * 24, 60 * 60, 60, 1];
  timeList.map((e) => {
    if (seconds >= e) {
      const numbr = Math.floor(seconds / e);
      timeFormattedList.push((numbr < 10 ? "0" : "") + numbr.toString());
      seconds %= e;
    }
  });
  return timeFormattedList.join(":");
};

const CountdownFormatted = ({ ms }) => {
  return (
    <Countdown
      key={ms}
      date={ms}
      renderer={({ days, hours, minutes, seconds }) => {
        let display = "";
        if (days) {
          display += `${days < 10 ? `0${days}` : days}:`;
        }
        if (hours || (hours === 0 && minutes > 0)) {
          display += `${hours < 10 ? `0${hours}` : hours}:`;
        }
        if (minutes || (minutes === 0 && minutes > 0)) {
          display += `${minutes < 10 ? `0${minutes}` : minutes}:`;
        }
        display += `${seconds < 10 ? `0${seconds}` : seconds}`;
        return display;
      }}
    />
  );
};

const instrumentToLabel = (instrument) => {
  if (instrument) {
    return `${instrument.underlyingDescription.replaceAll(
      " ",
      ""
    )} ${timeFormat(+instrument.epochDurationInSeconds)}+${timeFormat(
      +instrument.bufferDurationInSeconds
    )} (${(+instrument.volatilityMultiplier / 10000).toFixed(2)} SD, ${
      +instrument.baseError / 10000
    } E)`;
  }
  return "";
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

export {
  trimNumber,
  instrumentLabel,
  instrumentToLabel,
  timeFormat,
  CountdownFormatted,
};
