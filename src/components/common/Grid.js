import styled from "styled-components";

const Grid = styled.div`
  // border-style: solid;
  border-color: red;
  max-height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const GridRow = styled.div`
  // border-style: solid;
  border-color: pink;
  max-height: 100%;
  height: 100%;
  &::after {
    content: "";
    clear: both;
    display: table;
  }
  display: flex;
`;

const borderWidth = "1px";

const getWidthString = (span, padding) => {
  if (!span) return;
  return `width: calc(${(span / 12) * 100}% - ${borderWidth} * 2 - ${
    padding ? padding : "0px"
  } * 2);`;
};

const GridCol = styled.div`
  // height: 100%;
  // display: flex;
  border-style: solid;
  border-color: grey;
  border-width: ${borderWidth};
  float: left;
  width: 100%;

  ${({ padding }) => (padding ? `padding: ${padding};` : null)}

  ${({ xs }) => (xs ? getWidthString(xs) : `width: 300px;`)}
  // ${({ xs, padding }) =>
    xs ? getWidthString(xs, padding) : `width: 200px;`}
  ${({ xs }) => (xs == "0" ? "display: none;" : "display: flex;")}

  @media only screen and (min-width: 768px) and (max-width: 991px) {
    ${({ sm }) => sm && getWidthString(sm)}
    ${({ sm }) => (sm == "0" ? "display: none;" : "display: flex;")}
  }

  @media only screen and (min-width: 992px) and (max-width: 1199px) {
    ${({ md }) => md && getWidthString(md)}
    ${({ md }) => (md == "0" ? "display: none;" : "display: flex;")}
  }

  @media only screen and (min-width: 1200px) {
    ${({ lg }) => lg && getWidthString(lg)}
    ${({ lg }) => (lg == "0" ? "display: none;" : "display: flex;")}
  }
`;

export { Grid, GridRow, GridCol };
