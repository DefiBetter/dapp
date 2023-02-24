const StakeDiagram = (props) => {
  return (
    <div>
      <div>
        <div className="flex items-center justify-center">
          <div className="hidden md:flex font-bold border-black justify-center items-center w-24 h-24 md:w-28 md:h-28 rounded-full bg-db-little-boy border-2 shadow-db">
            {props.stakeSymbol}
          </div>
          <div className="hidden md:flex  h-2 w-10 bg-db-cyan-process"></div>
          <div className="bg-white border-[3px] border-db-cyan-process rounded-2xl w-[180px] md:w-[140px]">
            <div className="p-2">
              <div className="flex flex-col items-center gap-2">
                <div className="font-fancy text-db-cyan-process underline">Stake</div>
                <div className="font-bold">{props.stakeName}</div>
                <div className="font-fancy text-db-cyan-process underline">
                  to receive
                </div>
                <div className="font-bold">{props.rewardName}</div>
              </div>
            </div>
          </div>
          <div className='hidden md:flex text-db-cyan-process'>
            <svg
              className="w-10 h-10 rotate-180"
              stroke="currentColor"
              viewBox="0 0 23 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="4"
                d="M10 19l-7-7m0 0l7-7m-7 7h20"
              ></path>
            </svg>
          </div>
          <div className="hidden md:flex font-bold border-black justify-center items-center w-28 h-28 rounded-full bg-db-little-boy border-2 shadow-db">
            {props.rewardSymbol}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StakeDiagram;
