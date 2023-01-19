import { Button } from "./Button";
import styled from "styled-components";
import { NormalText } from "./Text";

const Input = styled.input`
  background-color: white;
  height: 90%;
  width: 90%;
  border-radius: inherit;
`;

const Container = styled.div`
  border-color: #2aaee6;
  border-width: 2px;
  border-radius: 10px;
  border-style: solid;
  height: 2.5rem;
`;

const MaxButton = (props) => {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Button {...props} style={{ height: "80%" }} />
    </div>
  );
};

const InputNumber = (props) => {
  const setMax = () => {
    props.setValue(props.max);
  };

  return (
    <Container
      style={{
        display: "flex",
        flex: 1,
        padding: "0.2rem",
        alignItems: "center",
      }}
    >
      <Input
        onChange={props.onChange}
        type={"number"}
        min={props.min}
        placeholder={props.placeholder}
        value={props.value}
        max={props.max}
      />
      <MaxButton onClick={setMax}>
        <NormalText>MAX</NormalText>
      </MaxButton>
    </Container>
  );
};

export { Input, InputNumber };
