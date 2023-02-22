import { useState } from "react";

import { RiArrowDownSFill } from "react-icons/ri";
import { instrumentLabel } from "./helper";

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
    setShowItemList(!showItemList);
  };

  return (
    <div className="relative w-full">
      <div
        onClick={toggleOptions}
        className="text-sm shadow-db w-full h-10 flex flex-col justify-center bg-white border-[1px] border-black rounded-lg"
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
        <div className="absolute top-10 left-0 w-full z-50">
          {itemList?.map((item, i) => (
            <div
              className="w-full cursor-pointer"
              onClick={() => {
                setCurrentItem(item);
                toggleOptions();
              }}
            >
              <div className="z-50 h-10 text-sm px-2 shadow-db w-full flex flex-col justify-center bg-white border-[1px] border-black rounded-lg">
                <div
                  className={
                    currentItemLabel === itemLabelList[i]
                      ? "text-db-cyan-process font-bold"
                      : "text-black"
                  }
                >
                  {itemLabelList[i]}
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
