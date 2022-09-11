import styled from "styled-components";

const Input = styled.input`
  background-color: white;
  border-color: #2aaee6;
  border-width: 2px;
  border-radius: 10px;
  border-style: solid;
  height: 40px;
`;

const InputNumber = () => {
  return <Input type={"number"}></Input>;
};

export { Input, InputNumber };
