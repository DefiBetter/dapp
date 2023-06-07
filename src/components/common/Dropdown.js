import { useRef, useState } from "react";

import { RiArrowDownSFill } from "react-icons/ri";
import { instrumentLabel } from "./helper";
import Countdown from "react-countdown";

const Dropdown = ({
  currentItem,
  currentItemLabel,
  type,
  setCurrentItem,
  itemList,
  itemLabelList,
  ...props
}) => {
  const [showItemList, setShowItemList] = useState(false);

  const toggleOptions = () => {
    setShowItemList(!showItemList);
  };

  const dropdownRef = useRef(null);

  const closeDropdown = (e) => {
    if (
      dropdownRef &&
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target)
    )
      setShowItemList(false);
  };

  document.addEventListener("mousedown", closeDropdown);

  return (
    <div className="relative min-w-max" ref={dropdownRef}>
      <div
        onClick={toggleOptions}
        className="cursor-pointer text-sm w-full h-12 flex flex-col justify-center bg-db-light dark:bg-db-dark-input rounded-lg border-b-2 border-db-cyan-process"
      >
        <div className="flex justify-between items-center px-2">
          <div className="flex-1">{currentItemLabel}</div>
          <div>
            <RiArrowDownSFill
              size={30}
              className={`${
                showItemList ? "rotate-180" : null
              } transition-transform`}
            />
          </div>
        </div>
      </div>
      {showItemList ? (
        <div className="absolute bg-white dark:bg-db-dark top-12 left-0 w-full z-50  min-w-max p-2 rounded-lg">
          {itemList?.map((item, i) => (
            <div
              key={item.selector}
              className="w-full cursor-pointer"
              onClick={() => {
                setCurrentItem(item);
                toggleOptions();
              }}
            >
              <div className="z-50 h-12 mt-1 text-sm px-2 w-full flex flex-col justify-center bg-db-light dark:bg-db-dark-input  border-b-2 border-db-cyan-process rounded-lg">
                <div
                  className={
                    currentItemLabel === itemLabelList[i]
                      ? "text-db-cyan-process font-bold"
                      : "text-black dark:text-white"
                  }
                >
                  <div>{itemLabelList[i]}</div>
                  {type === "instrument" && (
                    <div className="text-xs">
                      <div>
                        Time left:{" "}
                        <Countdown
                          key={
                            (+itemList[i].lastEpochClosingTime +
                              +itemList[i].epochDurationInSeconds +
                              +itemList[i].bufferDurationInSeconds) *
                            1000
                          }
                          date={
                            (+itemList[i].lastEpochClosingTime +
                              +itemList[i].epochDurationInSeconds +
                              +itemList[i].bufferDurationInSeconds) *
                            1000
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Dropdown;
