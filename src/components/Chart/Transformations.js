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

export const reflectXAxis = (matrix, x, y) => {
  matrix = multiply(
    [
      [y == true ? -1 : 1, 0],
      [0, x == true ? -1 : 1],
    ],
    matrix
  );
  return matrix;
};

export const translate = (matrix, x, y) => {
  matrix = resize(matrix, [3, size(matrix)[1]], 1); // resize 2x2 to 3x3 with x,y,w

  let T = identity(3);
  T.set([0, 2], x); // move along x axis
  T.set([1, 2], y); // move along y axis

  matrix = multiply(T, matrix).resize([2, size(matrix)[1]]);
  return matrix.toArray();
};
