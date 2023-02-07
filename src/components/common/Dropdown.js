import { Button } from "./Button";
import { useEffect, useState } from "react";
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
  //   font-size: 1.5rem;
  height: 100%;
  background-color: ${(props) => (props.active ? `#cce5ff` : `white`)};
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

  // console.log("dropdown currentItem", currentItem);
  // console.log("dropdown currentItemLabel", currentItemLabel);
  // console.log("dropdown itemList", itemList);
  // console.log("dropdown itemLabelList", itemLabelList);

  const Arrow = styled.i`
    border: solid black;
    border-width: 0 3px 3px 0;
    display: inline-block;
    padding: 3px;
    border-color: #2aaee6;
    transition: transform 0.5s;
    transform: rotate(${(props) => (props.active ? "45deg" : "-135deg")});
    -webkit-transform: rotate(
      ${(props) => (props.active ? "45deg" : "-135deg")}
    );
  `;
  const ArrowUp = styled(Arrow)`
    transform: rotate(-135deg);
    -webkit-transform: rotate(-135deg);
  `;
  const ArrowDown = styled(Arrow)`
    transform: rotate(45deg);
    -webkit-transform: rotate(45deg);
  `;

  return (
    <Container
      onClick={toggleOptions}
      style={{ position: "relative", width: "100%", height: "2.5rem" }}
    >
      <Option activeColor={`white`}>
        <NormalText>
          <div style={{}}>
            <div
              style={{
                maxWidth: "calc(100% - 3rem)",
                margin: "0 auto",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {currentItemLabel}
            </div>
          </div>
          <div
            style={{
              position: "absolute",
              right: "1rem",
              top: `calc(50% - ${showItemList ? 9 : 6}px)`,
            }}
          >
            <Arrow active={showItemList} />
          </div>
        </NormalText>
      </Option>

      {showItemList
        ? itemList?.map((item, i) => (
            <Option
              style={{ width: "100%" }}
              active={currentItemLabel == itemLabelList[i] ? true : false}
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
