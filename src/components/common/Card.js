import styled from "styled-components";

const Card = styled.div`
  border-radius: ${(props) => (props.borderRadius ? props.borderRadius : 1)}rem;
  border-width: ${(props) => (props.borderWidth ? props.borderWidth : 0.2)}rem;
  border-color: ${(props) =>
    props.borderColor == "black" ? "black" : `#2aaee6`};
  background-color: ${(props) =>
    props.backgroundColor == "blue" ? `#cce5ff` : `white`};
  ${(props) => (props.noBorder ? null : `border-style: solid;`)}
  padding: ${(props) =>
    props.padding == 0 || props.padding ? props.padding : 0.5}rem;
  ${(props) => (props.shadow ? `box-shadow: 5px 5px 10px 0px grey;` : null)}
  display: flex;
  flex-direction: column;
`;

const CardBlueBg = styled(Card)`
  background-color: #cce5ff;
  border-style: none;
`;

const CardFill = styled(Card)`
  flex: 1;
`;

const CardBlueBgBlackBorder = styled(CardBlueBg)`
  border-color: black;
  border-style: solid;
  border-width: 2px;
`;

const CardBlueBgBlackBorderNoShadow = styled(CardBlueBgBlackBorder)`
  box-shadow: 0px 0px 0px 0px white;
`;

export {
  Card,
  CardBlueBg,
  CardFill,
  CardBlueBgBlackBorder,
  CardBlueBgBlackBorderNoShadow,
};
