import { useEffect } from "react";
import { multiply, resize, identity, size } from "mathjs";
import {
  preProcessData,
  reflectXAxis,
  translate,
  transpose,
} from "./Transformations";

const Axes = (props) => {
  const dataRange = (data, range, alignMiddle) => {
    console.log("dataRange data", data);
    data = data.map((a) => {
      return a.slice(-range);
    });
    console.log("dataRange sliced", data);
    try {
      let xMax = Math.max(...data[0]);
      let xMin = Math.min(...data[0]);
      let yMin = Math.min(...data[1]);
      let yMax = Math.max(...data[1]);

      let xRange = xMax - xMin;
      let yRange = yMax - yMin;

      /* logic to see which points to anchor in the y axis */
      let yMiddle = data[1][data[1].length - 1];
      console.log("dataRange yMiddle", yMiddle);
      let rangeYMin = yMiddle - yMin;
      let rangeYMax = yMiddle - yMax;
      console.log("dataRange rangeYMin", rangeYMin);
      console.log("dataRange rangeYMax", rangeYMax);

      if (rangeYMin > rangeYMax) {
        return [
          [xMin, xMax, xRange],
          [yMin, yMiddle, yMiddle - yMin],
        ];
      } else {
        return [
          [xMin, xMax, xRange],
          [yMiddle, yMax, yMax - yMiddle],
        ];
      }

      // return [
      //   [xMin, xMax, xRange],
      //   [yMin, yMax, yRange],
      // ];
    } catch (e) {
      return [];
    }
  };

  const viewRange = () => {
    return [
      [0 + props.chartConfig.paddingX(), props.chartConfig.middleCoord()[0]],
      [
        0 + props.chartConfig.paddingY(),
        props.chartConfig.paddingY() + props.chartConfig.chartHeight / 2,
      ],
    ];
  };

  const data2View = (range) => {
    try {
      let data = transpose(preProcessData(props.data.bars));
      console.log("data2View transpose 1", data);
      let _dataRange = dataRange(data, range);
      console.log("data2View _dataRange 2", _dataRange);

      data = translate(data, 0, -(_dataRange[1][2] / 2 + _dataRange[1][0]));
      console.log("data2View translate 3", data);
      data = reflectXAxis(data, true, false);
      console.log("data2View reflect 4", data);
      data = translate(data, 0, _dataRange[1][2] / 2 + _dataRange[1][0]);
      console.log("data2View translate 5", data);

      let _viewRange = viewRange();
      let viewRangeValue = [
        _viewRange[0][1] - _viewRange[0][0],
        _viewRange[1][1] - _viewRange[1][0],
      ];

      let viewMatrix = data.map((axis, i) =>
        axis.map(
          (value) =>
            ((value - _dataRange[i][0]) * viewRangeValue[i]) /
              _dataRange[i][2] +
            _viewRange[i][0]
        )
      );
      console.log("data2View viewMatrix 6", viewMatrix);

      let offsetY =
        viewMatrix[1][viewMatrix[1].length - 1] -
        props.chartConfig.middleCoord()[1];

      viewMatrix = translate(viewMatrix, 0, -offsetY);
      console.log("data2View viewMatrix 7", viewMatrix);
      return viewMatrix;
    } catch (e) {
      return [];
    }
  };

  const plotData = (range) => {
    try {
      let data = data2View(range);

      data = transpose(data);

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
      return dataPoints;
    } catch (e) {}
  };

  return (
    <>
      {plotData(200)}
      {/* <circle cx="1" cy="1" r={100} fill="red" /> */}
    </>
  );
};

export default Axes;
