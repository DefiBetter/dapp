import { identity, multiply, resize, size } from "mathjs";

export const preProcessData = (data) => {
  return data.map((bar) => {
    return [
      bar.timestamp, // x value/time
      bar.closeUsd, // y value/price
    ];
  });
};

export const transpose = (matrix) => {
  try {
    return matrix[0].map((col, i) => matrix.map((row) => row[i]));
  } catch (e) {
    return [];
  }
};

export const reflect = (matrix, xAxis, yAxis) => {
  matrix = multiply(
    [
      [yAxis == true ? -1 : 1, 0],
      [0, xAxis == true ? -1 : 1],
    ],
    matrix
  );
  return matrix;
};

export const translate = (matrix, x, y) => {
  console.log("translate matrix original", matrix);
  matrix = resize(matrix, [3, size(matrix)[1]], 1); // resize 2x2 to 3x3 with x,y,w
  console.log("translate size(matrix)[1]", size(matrix)[1]);
  console.log("translate matrix 1", matrix);

  let T = identity(3);
  T.set([0, 2], x); // move along x axis
  T.set([1, 2], y); // move along y axis

  matrix = multiply(T, matrix).resize([2, size(matrix)[1]]);
  console.log("translate matrix 2", matrix);
  return matrix.toArray();
};

export const scale = (matrix, oldRangeInfo, newRangeInfo) => {
  /* matrix structure:
  matrix = [[x1, x2, ...xn],
            [y1, y2, ...yn]]
  
  range info:
  rangeInfo = [axisMin, axisMax, axisRange]
  
  scaling formula:
  dataScaled = (data - oldMin) / oldRange * newRange + newMin */

  console.log("scale matrix", matrix);
  console.log("scale oldRangeInfo", oldRangeInfo);
  console.log("scale newRangeInfo", newRangeInfo);

  return matrix.map((axis, i) => {
    const [oldMin, oldRange] = oldRangeInfo[i].splice(1);
    const [newMin, newRange] = newRangeInfo[i].splice(1);
    return axis.map(
      (value) => ((value - oldMin) / oldRange) * newRange + newMin
    );
  });
};

/* chain transformations */
export const data2SvgView = (
  data,
  oldRangeInfo,
  newRangeInfo,
  containerHeight
) => {
  let svgViewMatrix = scale(data, oldRangeInfo, newRangeInfo);
  svgViewMatrix = reflect(svgViewMatrix, true, false);
  svgViewMatrix = translate(svgViewMatrix, 0, containerHeight);

  return svgViewMatrix;
};
