import styled from "styled-components";

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
  }
`;

export const ButtonDisabled = styled(Button)`
  background-color: grey;
`;

export default Button;
