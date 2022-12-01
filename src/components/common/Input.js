import styled from "styled-components";
import Button from "./Button";
import { NormalText } from "./Text";

const Input = styled.input`
  background-color: white;
  border-color: #2aaee6;
  border-width: 2px;
  border-radius: 10px;
  border-style: solid;
  height: 40px;
`;

const MaxButton = (props) => {
  return (
    <div
      styles={{
        width: "100px",
      }}
    >
      <Button {...props} />
    </div>
  );
};

const InputNumber = (props) => {
  const setMax = () => {
    props.setValue(props.max);
  };

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <Input
        onChange={props.onChange}
        type={"number"}
        min={props.min}
        placeholder={props.placeholder}
        value={props.value}
        max={props.max}
      ></Input>
      <MaxButton onClick={setMax}>
        <NormalText>MAX</NormalText>
      </MaxButton>
    </div>
  );
};

export { Input, InputNumber };
