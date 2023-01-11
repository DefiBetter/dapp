import { useEffect, useState } from "react";
import Button from "./Button";
import { NormalText } from "./Text";
import styled from "styled-components";

const Container = styled.div`
  z-index: 1;
  height: 100%;
  border-radius: 10px;
  min-width: 200px;
  // width: inherit;
`;

const Option = styled(Button)`
  text-align: center;
  margin-top: 0.1rem;
  //   font-size: 1.5rem;
  height: 100%;
  background-color: white;
  color: black;
`;

const Dropdown = ({
  currentItem,
  currentItemLabel,
  setCurrentItem,
  itemList,
  itemLabelList,
  ...props
}) => {
  const [showItemList, setShowItemList] = useState(false);

  const toggleOptions = () => {
    console.log("dropdown toggled", !showItemList);
    setShowItemList(!showItemList);
  };

  console.log("dropdown currentItem", currentItem);
  console.log("dropdown currentItemLabel", currentItemLabel);
  console.log("dropdown itemList", itemList);
  console.log("dropdown itemLabelList", itemLabelList);

  return (
    <Container onClick={toggleOptions}>
      <Option activeColor={`white`}>
        <NormalText>{currentItemLabel}</NormalText>
      </Option>

      {showItemList
        ? itemList.map((item, i) => (
            <Option
              activeColor={`white`}
              onClick={() => {
                setCurrentItem(item);
              }}
            >
              <NormalText>{itemLabelList[i]}</NormalText>
            </Option>
          ))
        : null}
    </Container>
  );
};

export default Dropdown;
