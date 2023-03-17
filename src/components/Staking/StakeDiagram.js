import { MdDoubleArrow } from "react-icons/md";

const StakeDiagram = (props) => {
  return (
    <div className="">
      <div className="flex items-center justify-center gap-2 md:gap-5">
        <div className="flex flex-col md:flex-row font-bold justify-center items-center p-2 md:p-4 gap-0 md:gap-2 rounded-lg bg-white dark:bg-db-dark-input shadow-sm shadow-db-cyan-process dark:shadow-black">
          <div className="text-lg md:text-xl">Stake </div>
          <div className="text-lg md:text-xl text-db-cyan-process">
            {props.stakeSymbol}
          </div>
        </div>
        <MdDoubleArrow
          size={30}
          className="hidden md:block animate-slide-left-to-right text-db-cyan-process"
        />
        <MdDoubleArrow
          size={40}
          className="animate-slide-left-to-right text-db-cyan-process"
        />
        <MdDoubleArrow
          size={30}
          className="hidden md:block animate-slide-left-to-right text-db-cyan-process"
        />
        <div className="flex flex-col md:flex-row font-bold justify-center items-center p-2 md:p-4 gap-0 md:gap-2 rounded-lg bg-white dark:bg-db-dark-input shadow-sm shadow-db-cyan-process dark:shadow-black">
          <div className="text-lg md:text-xl">to receive </div>
          <div className="text-lg md:text-xl text-db-cyan-process">
            {props.rewardSymbol}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakeDiagram;
