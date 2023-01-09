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
  if (instrument) {
    return `${instrument.underlyingDescription.replaceAll(" ", "")} ${
      (+instrument.epochDurationInSeconds +
        +instrument.bufferDurationInSeconds) /
      60
    }m (${(+instrument.volatilityMultiplier / 10000).toFixed(1)} SD, ${
      +instrument.baseError / 10000
    } E)`;
  }
  return ``;
};

export { trimNumber, instrumentLabel };
