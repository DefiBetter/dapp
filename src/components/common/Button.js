import styled from "styled-components";
import { NormalText, SmallText } from "./Text";

const Button = styled.button`
  border-radius: 10px;
  border-width: 1px;
  border-color: black;
  background-color: #2aaee6;
  width: 100%;
  font-size: 1rem;
  font-family: marguerite;
  color: white;
  cursor: pointer;
  height: 100%;
  &:enabled {
    &:active {
      background-color: ${(props) =>
        props.activeColor == "white"
          ? `rgba(255, 255, 255, 0.5)`
          : `rgba(42, 174, 230, 0.5)`};
    }
  }
  &:disabled {
    cursor: not-allowed;
    background-color: grey;
  }
`;

const ButtonWithInfo = ({ children, info }) => {
  return (
    <Button>
      {children}
      <SmallText>
        <NormalText>{info}</NormalText>
      </SmallText>
    </Button>
  );
};

export { Button, ButtonWithInfo };
