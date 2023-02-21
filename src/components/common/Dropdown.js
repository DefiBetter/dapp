import { useState } from "react";

import { RiArrowDownSFill } from "react-icons/ri";

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
        className="shadow-db w-full h-10 flex flex-col justify-center bg-white border-[1px] border-black rounded-lg"
      >
        <div className="flex justify-between items-center px-3">
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
        <div className="absolute top-10 left-0 w-full">
          {itemList?.map((item, i) => (
            <div
              className="w-full h-10 cursor-pointer"
              onClick={() => {
                setCurrentItem(item);
                toggleOptions();
              }}
            >
              <div
                className='px-4 shadow-db w-full h-10 flex flex-col justify-center bg-white border-[1px] border-black rounded-lg'
              >
                {itemLabelList[i]}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default Dropdown;
