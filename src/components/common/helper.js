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

const instrumentLabel = (instrument) => {
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

  if (instrument) {
    return `${instrument.underlyingDescription.replaceAll(
      " ",
      ""
    )} ${timeFormat(+instrument.epochDurationInSeconds)}+${timeFormat(
      +instrument.bufferDurationInSeconds
    )} (${(+instrument.volatilityMultiplier / 10000).toFixed(1)} SD, ${
      +instrument.baseError / 10000
    } E)`;
  }
  return ``;
};

export { trimNumber, instrumentLabel };
