import { useEffect } from "react";
import { multiply, resize, identity, size } from "mathjs";

const Axes = (props) => {
  const preProcessData = () => {
    let data = props.data.bars;
    return data.map((bar) => {
      return [
        bar.timestamp, // x value/time
        bar.closeUsd, // y value/price
      ];
    });
  };

  const transpose = (matrix) => {
    try {
      return matrix[0].map((col, i) => matrix.map((row) => row[i]));
    } catch (e) {
      return [];
    }
  };

  const reflectXAxis = (matrix, x, y) => {
    matrix = multiply(
      [
        [y == true ? -1 : 1, 0],
        [0, x == true ? -1 : 1],
      ],
      matrix
    );
    return matrix;
  };

  const translate = (matrix, x, y) => {
    matrix = resize(matrix, [3, size(matrix)[1]], 1); // resize 2x2 to 3x3 with x,y,w

    let T = identity(3);
    T.set([0, 2], x); // move along x axis
    T.set([1, 2], y); // move along y axis

    matrix = multiply(T, matrix).resize([2, size(matrix)[1]]);
    return matrix.toArray();
  };

  const dataRange = (data, range, alignMiddle) => {
    data = data.map((a) => {
      return a.slice(-range);
    });
    try {
      let xMax = Math.max(...data[0]);
      let xMin = Math.min(...data[0]);
      let yMin = Math.min(...data[1]);
      let yMax = Math.max(...data[1]);

      let xRange = xMax - xMin;
      let yRange = yMax - yMin;

      return [
        [xMin, xMax, xRange],
        [yMin, yMax, yRange],
      ];
    } catch (e) {
      return [];
    }
  };

  const viewRange = () => {
    return [
      [0 + props.chartConfig.paddingX(), props.chartConfig.middleCoord()[0]],
      [
        0 + props.chartConfig.paddingY(),
        props.chartConfig.paddingY() + props.chartConfig.chartHeight,
      ],
    ];
  };

  const data2View = (range) => {
    try {
      let data = transpose(preProcessData());
      let _dataRange = dataRange(data, range);

      data = translate(data, 0, -(_dataRange[1][2] / 2 + _dataRange[1][0]));
      console.log("data (translated)", data);
      data = reflectXAxis(data, true, false);
      console.log("data (reflected)", data);
      data = translate(data, 0, _dataRange[1][2] / 2 + _dataRange[1][0]);
      console.log("data (translated)", data);

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

      let offsetY =
        viewMatrix[1][viewMatrix[1].length - 1] -
        props.chartConfig.middleCoord()[1];

      viewMatrix = translate(viewMatrix, 0, -offsetY);

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
            r={0}
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
      {plotData(320)}
      {/* <circle cx="1" cy="1" r={100} fill="red" /> */}
    </>
  );
};

export default Axes;
