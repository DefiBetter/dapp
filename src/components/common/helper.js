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

export { trimNumber };
