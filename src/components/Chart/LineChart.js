import { useEffect } from "react";
import { multiply, resize, identity, size } from "mathjs";
import {
  preProcessData,
  reflect,
  translate,
  transpose,
  scale,
} from "./Transformations";

const Axes = (props) => {
  const getRangeInfoX = (data, type) => {
    let xMin, xMax, xRange;
    let xNewMin, xNewMax, xNewRange;
    let yMiddle;
    if (type == "trailing") {
      /* old range */
      xMin = Math.min(...data[0]);
      xMax = Math.max(...data[0]);
      xRange = xMax - xMin;

      /* new range */
      xNewMin = props.chartConfig.paddingX();
      xNewMax = props.chartConfig.middleCoord()[0];
      xNewRange = xNewMax - xNewMin;
      yMiddle = data[1][data[0].length - 1];
    } else if (type == "epoch") {
    } else if (type == "historical") {
    }

    let rangeInfo = [xMin, xMax, xRange];
    let newRangeInfo = [xNewMin, xNewMax, xNewRange];
    console.log("getRangeInfoX rangeInfo", rangeInfo);
    console.log("getRangeInfoX newRangeInfo", newRangeInfo);
    console.log("getRangeInfoX { rangeInfo, newRangeInfo, yMiddle }", {
      rangeInfo,
      newRangeInfo,
      yMiddle,
    });
    return { rangeInfo, newRangeInfo, yMiddle };
  };

  const getRangeInfoY = (data, type, yMiddle) => {
    console.log("getRangeInfoY", [data, type, yMiddle]);
    let yMin, yMax, yRange;
    let yNewMin, yNewMax, yNewRange;
    if (type == "minMax") {
      /* old range */
      yMin = Math.min(...data[1]);
      yMax = Math.max(...data[1]);
      yRange = yMax - yMin;

      // logic to see which points to anchor in the y axis
      let diffMin = yMiddle - yMin;
      let diffMax = yMax - yMiddle;
      if (diffMin > diffMax) {
        yMax = yMiddle;
        yRange = yMiddle - yMin;
        console.log("getRangeInfoY yMin", yMin);

        yNewMin = props.chartConfig.paddingY();
        console.log("getRangeInfoY yNewMin", yNewMin);
        yNewMax = props.chartConfig.middleCoord()[1];
      } else {
        yMin = yMiddle;
        yRange = yMax - yMiddle;

        yNewMin = props.chartConfig.middleCoord()[1];
        console.log("getRangeInfoY yNewMin", yNewMin);
        yNewMax = props.chartConfig.paddingY() + props.chartConfig.chartHeight;
      }

      /* new range */
      // yNewMin = props.chartConfig.paddingY();
      // yNewMax =
      //   props.chartConfig.paddingY() + props.chartConfig.chartHeight / 2;
      yNewRange = yNewMax - yNewMin;
    } else if (type == "1SD") {
    } else if (type == "2SD") {
    }

    let rangeInfo = [yMin, yMax, yRange];
    console.log("getRangeInfoY rangeInfo", rangeInfo);
    let newRangeInfo = [yNewMin, yNewMax, yNewRange];
    console.log("getRangeInfoY newRangeInfo", newRangeInfo);
    console.log("getRangeInfoY { rangeInfo, newRangeInfo }", {
      rangeInfo,
      newRangeInfo,
    });
    return { rangeInfo, newRangeInfo };
  };

  const data2View = (data, range) => {
    /* data needs to be transformed correctly to display data depending on the (type, range) of the chart:
    - xType (x axis scaling):
      - trailing => mid coord is fixed to the latest price
      - epoch => mid coord is fixed to the calculated epoch start price via better.epochTransition()
      - historical => latest price is shown at the right most side of the chart, and historical prices are shown

    - yType (y axis scaling):
      - minMax => scale to fit the historical price based on the biggest difference between min/max and mid coord
      - 1SD => scale to fit the historical price based on the biggest difference between 1 SD values and mid coord
      - 2SD => scale to fit the historical price based on the biggest difference between 2 SD values and mid coord
    */

    data = preProcessData(data);
    console.log("data2View preProcessData", data);
    data = transpose(data);
    console.log("data2View transpose", data);

    let oldRangeInfo = [
        [0, 0, 0],
        [0, 0, 0],
      ],
      newRangeInfo = [
        [0, 0, 0],
        [0, 0, 0],
      ];
    let xType = "trailing",
      yType = "minMax",
      yMiddle;
    // setting x values for scaling
    ({
      rangeInfo: oldRangeInfo[0],
      newRangeInfo: newRangeInfo[0],
      yMiddle,
    } = getRangeInfoX(data, xType));
    console.log("data2View oldRangeInfo", oldRangeInfo);
    console.log("data2View newRangeInfo", newRangeInfo);
    console.log("data2View yMiddle", yMiddle);
    // setting y values for scaling
    ({ rangeInfo: oldRangeInfo[1], newRangeInfo: newRangeInfo[1] } =
      getRangeInfoY(data, yType, yMiddle));
    console.log("data2View oldRangeInfo", oldRangeInfo[1]);
    console.log("data2View newRangeInfo", newRangeInfo[1]);

    console.log("data2View data", data);
    // let _dataRange = dataRange(data, range);
    // console.log("data2View _dataRange", _dataRange);
    // let _viewRange = viewRange();
    // console.log("data2View _viewRange", _viewRange);

    console.log("data2View transpose", data);
    data = scale(data, oldRangeInfo, newRangeInfo);
    console.log("data2View scale", data);
    console.log("data2View paddingY", props.chartConfig.paddingY());
    data = reflect(data, true, false);
    // console.log("data2View reflect", data);
    data = translate(data, 0, props.chartConfig.containerHeight);
    console.log("data2View translate", data);
    console.log(
      "data2View containerHeight",
      props.chartConfig.containerHeight - props.chartConfig.paddingY()
    );

    // console.log("data2View _dataRange 2", _dataRange);

    // data = translate(data, 0, -(_dataRange[1][2] / 2 + _dataRange[1][0]));
    // console.log("data2View translate 3", data);
    // data = reflectXAxis(data, true, false);
    // console.log("data2View reflect 4", data);
    // console.log(
    //   "data2View _dataRange[1][2] / 2 + _dataRange[1][0]",
    //   _dataRange[1][2] / 2 + _dataRange[1][0]
    // );
    // data = translate(data, 0, _dataRange[1][2] / 2 + _dataRange[1][0]);
    // console.log("data2View translate 5", data);

    // console.log("data2View _viewRange 6", _viewRange);

    // let viewMatrix = scale(data, _dataRange, _viewRange);

    let viewMatrix = data;
    // console.log("data2View viewMatrix 7", viewMatrix);

    // let offsetY =
    //   viewMatrix[1][viewMatrix[1].length - 1] -
    //   props.chartConfig.middleCoord()[1];

    // viewMatrix = translate(viewMatrix, 0, -offsetY);
    // console.log("data2View viewMatrix 8", viewMatrix);
    return viewMatrix;
  };

  const plotData = (data, range) => {
    try {
      console.log("plotData", range);
      data = data2View(data, range);

      data = transpose(data);
      console.log("plotData transpose", data);

      let dataPoints = [];
      data.map((coord) => {
        coord = [coord[0], Number(coord[1])];
        dataPoints.push(
          <circle
            cx={coord[0]}
            cy={Number(coord[1])}
            r={2}
            fill="red"
            className="circle"
          />
        );
      });

      data.map((coord, i) => {
        if (i < data.length - 1) {
          coord = [coord[0], Number(coord[1])];
          let coordNext = [data[i + 1][0], Number(data[i + 1][1])];
          dataPoints.push(
            <line
              x1={coord[0]}
              y1={coord[1]}
              x2={coordNext[0]}
              y2={coordNext[1]}
              stroke="grey"
            />
          );
        }
      });

      data.map((coord, i) => {
        let yPad = props.chartConfig.paddingY() + props.chartConfig.chartHeight;
        dataPoints.push(
          <text x={100} y={yPad} fill="red">
            bitch
          </text>
        );
      });
      return dataPoints;
    } catch (e) {}
  };

  return (
    <>
      {plotData(props.data.bars, 200)}
      {/* <circle cx="1" cy="1" r={100} fill="red" /> */}
    </>
  );
};

export default Axes;
