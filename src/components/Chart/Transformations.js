import { ethers } from "ethers";
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
    const [oldMin, oldRange] = [...oldRangeInfo[i]].splice(1);
    const [newMin, newRange] = [...newRangeInfo[i]].splice(1);
    console.log("scale [oldMin, oldRange]", [oldMin, oldRange]);
    console.log("scale [newMin, newRange]", [newMin, newRange]);
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
  console.log(
    "data2SvgView oldRangeInfo, newRangeInfo",
    oldRangeInfo,
    newRangeInfo
  );
  let svgViewMatrix = scale(data, oldRangeInfo, newRangeInfo);
  console.log("data2SvgView svgViewMatrix", svgViewMatrix);
  svgViewMatrix = reflect(svgViewMatrix, true, false);
  console.log("data2SvgView reflect", svgViewMatrix);
  svgViewMatrix = translate(svgViewMatrix, 0, containerHeight);
  console.log("data2SvgView translate", svgViewMatrix);

  return svgViewMatrix;
};

// export const getRangeInfoX = (data, type, chartConfig, instrument) => {
//   let xMin, xMax, xRange;
//   let xNewMin, xNewMax, xNewRange;
//   let countdown ;
//   if (type == "trailing") {
//     /* old range */
//     xMin = Math.min(...data[0]);
//     xMax = Math.max(...data[0]);
//     xRange = xMax - xMin;

//     /* new range */
//     xNewMin = chartConfig.paddingX();
//     xNewMax = chartConfig.middleCoord()[0];
//     xNewRange = xNewMax - xNewMin;
//     middleCoords = [data[0][data[0].length - 1], data[1][data[0].length - 1]];
//   } else if (type == "epoch") {
//     console.log("epoch instrument", instrument);
//     let epochTime =
//       +instrument.bufferDurationInSeconds.toString() +
//       +instrument.epochDurationInSeconds.toString();
//     console.log("epoch epochTime", epochTime);

//     let nCount = chartConfig.epochCount;
//     console.log("epoch nCount", nCount);
//   } else if (type == "historical") {
//   }

//   let rangeInfo = [xMin, xMax, xRange];
//   let newRangeInfo = [xNewMin, xNewMax, xNewRange];
//   console.log("getRangeInfoX rangeInfo", rangeInfo);
//   console.log("getRangeInfoX newRangeInfo", newRangeInfo);
//   console.log("getRangeInfoX { rangeInfo, newRangeInfo, middleCoords }", {
//     rangeInfo,
//     newRangeInfo,
//     middleCoords,
//   });
//   return { rangeInfo, newRangeInfo, middleCoords };
// };

// export const getRangeInfoY = (
//   data,
//   type,
//   middleCoords,
//   chartConfig,
//   epochData
// ) => {
//   console.log("getRangeInfoY", [data, type, middleCoords]);
//   let yMin, yMax, yRange;
//   let yNewMin, yNewMax, yNewRange;
//   let yMiddle = middleCoords[1];
//   if (type == "minMax") {
//     /* old range */
//     yMin = Math.min(...data[1]);
//     yMax = Math.max(...data[1]);
//     yRange = yMax - yMin;

//     // logic to see which points to anchor in the y axis
//     let diffMin = yMiddle - yMin;
//     let diffMax = yMax - yMiddle;
//     if (diffMin > diffMax) {
//       yMax = yMiddle;
//       yRange = yMiddle - yMin;
//       console.log("getRangeInfoY yMin", yMin);

//       yNewMin = chartConfig.paddingY();
//       console.log("getRangeInfoY yNewMin", yNewMin);
//       yNewMax = chartConfig.middleCoord()[1];
//     } else {
//       yMin = yMiddle;
//       yRange = yMax - yMiddle;

//       yNewMin = chartConfig.middleCoord()[1];
//       console.log("getRangeInfoY yNewMin", yNewMin);
//       yNewMax = chartConfig.paddingY() + chartConfig.chartHeight;
//     }

//     /* new range */
//     // yNewMin = props.chartConfig.paddingY();
//     // yNewMax =
//     //   props.chartConfig.paddingY() + props.chartConfig.chartHeight / 2;
//     yNewRange = yNewMax - yNewMin;
//   } else if (type == "1SD") {
//   } else if (type == "2SD") {
//   } else if (type == "binBorder") {
//     console.log(
//       "getRangeInfoY binBorder",
//       +ethers.utils.formatEther(epochData.binStart)
//     );
//     yMin = +ethers.utils.formatEther(epochData.binStart);
//     console.log(
//       `+ethers.utils.formatEther(epochData.binStart) +
//     +epochData.binSize.toString() * 7`,
//       +ethers.utils.formatEther(epochData.binStart) +
//         +ethers.utils.formatEther(epochData.binSize) * 7
//     );
//     yMax =
//       +ethers.utils.formatEther(epochData.binStart) +
//       +ethers.utils.formatEther(epochData.binSize) * 7;
//     yRange = yMax - yMin;
//     yNewMin = chartConfig.paddingY();
//     yNewMax = chartConfig.paddingY() + chartConfig.chartHeight;
//     yNewRange = yNewMax - yNewMin;
//   }

//   let rangeInfo = [yMin, yMax, yRange];
//   console.log("getRangeInfoY rangeInfo", rangeInfo);
//   let newRangeInfo = [yNewMin, yNewMax, yNewRange];
//   console.log("getRangeInfoY newRangeInfo", newRangeInfo);
//   console.log("getRangeInfoY { rangeInfo, newRangeInfo }", {
//     rangeInfo,
//     newRangeInfo,
//   });
//   return { rangeInfo, newRangeInfo };
// };
// export const rangeInfo = (
//   data,
//   chartConfig,
//   epochData,
//   instrument,
//   lastEpochData,
//   xType = "epoch",
//   yType = "binBorder"
// ) => {
//   let oldRangeInfo = [
//       [0, 0, 0],
//       [0, 0, 0],
//     ],
//     newRangeInfo = [
//       [0, 0, 0],
//       [0, 0, 0],
//     ];
//   let middleCoords;
//   // setting x values for scaling
//   ({
//     rangeInfo: oldRangeInfo[0],
//     newRangeInfo: newRangeInfo[0],
//     middleCoords,
//   } = getRangeInfoX(data, xType, chartConfig, instrument, lastEpochData));

//   // setting y values for scaling
//   ({ rangeInfo: oldRangeInfo[1], newRangeInfo: newRangeInfo[1] } =
//     getRangeInfoY(data, yType, middleCoords, chartConfig, epochData));

//   console.log("rangeInfo", { oldRangeInfo, newRangeInfo, middleCoords });
//   return { oldRangeInfo, newRangeInfo, middleCoords };
// };
