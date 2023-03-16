import { MdDoubleArrow } from "react-icons/md";

const StakeDiagram = (props) => {
  return (
    <div className=''>
        <div className="flex items-center justify-center gap-2 md:gap-5">
          <div className="flex flex-col font-bold justify-center items-center p-4 w-32 rounded-lg bg-white dark:bg-db-dark-info shadow-sm shadow-db-cyan-process dark:shadow-black">
            <div className="font-fancy text-db-cyan-process text-xl">Stake</div>
            <div>{props.stakeSymbol}</div>
          </div>
          <MdDoubleArrow size={30} className="animate-slide-left-to-right text-db-cyan-process" />
          <MdDoubleArrow size={40} className="animate-slide-left-to-right text-db-cyan-process" />
          <MdDoubleArrow size={30} className="animate-slide-left-to-right text-db-cyan-process" />
          <div className="flex flex-col font-bold justify-center items-center p-4 w-32 rounded-lg bg-white dark:bg-db-dark-info shadow-sm shadow-db-cyan-process dark:shadow-black">
            <div className="font-fancy text-db-cyan-process text-xl">to receive</div>
            <div className="font-bold">{props.rewardSymbol}</div>
          </div>
        </div>
    </div>
  );
};

export default StakeDiagram;
