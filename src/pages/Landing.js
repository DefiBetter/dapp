import { FaThinkPeaks } from "react-icons/fa";
import { GiReceiveMoney, GiPayMoney, GiMoneyStack } from "react-icons/gi";

export default function Landing() {
  return (
    <div className="px-6">
      <div className="flex justify-between flex-col w-full min-h-[80vh] md:min-h-[84vh] py-6">
        <div className="w-full text-center">
          <h1 className="text-xl flex justify-center">
            Welcome to DeFi{" "}
            <span className="font-fancy text-db-cyan-process mt-5 -ml-3">
              Better
            </span>
          </h1>
          <h2 className="text-6xl flex flex-col items-center font-bold">
            <div>Bet & Win,</div>
            <div>Stake & Earn!</div>
          </h2>
          <h3 className="mt-10">
            Quick multiples. Automatic stop losses. No liquidation risk. No
            third party capital.
          </h3>
        </div>

        <div className="mt-10 flex flex-col lg:flex-row justify-between">
          <div className="w-full lg:w-1/3">
            <div className="flex flex-col gap-4 items-stretch md:items-center justify-center">
              <div className="w-full flex flex-col lg:flex-row justify-between gap-4">
                <div className="w-full lg:w-1/2 text-center p-4 bg-db-light dark:bg-db-dark-nav transition-colors rounded-md border-b-2 border-db-cyan-process">
                  <div className="flex items-center gap-4">
                    <div>
                      <GiMoneyStack size={50} />
                    </div>
                    <div className="w-full text-left">
                      <div className="">Total Value Locked</div>
                      <div className="text-2xl font-bold">$15,594,123</div>
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-1/2 text-center p-4 bg-db-light dark:bg-db-dark-nav transition-colors rounded-md border-b-2 border-db-cyan-process">
                  <div className="flex items-center gap-4">
                    <div>
                      <FaThinkPeaks size={50} />
                    </div>
                    <div className="w-full text-left">
                      <div className="">Daily Volume</div>
                      <div className="text-2xl font-bold">$594,123</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col lg:flex-row justify-between gap-4">
                <div className="w-full lg:w-1/2 text-center p-4 bg-db-light dark:bg-db-dark-nav transition-colors rounded-md border-b-2 border-db-cyan-process">
                  <div className="flex items-center gap-4">
                    <div>
                      <GiReceiveMoney size={50} />
                    </div>
                    <div className="w-full text-left">
                      <div className="">Daily Fees</div>
                      <div className="text-2xl font-bold">$214,123</div>
                    </div>
                  </div>
                </div>
                <div className="w-full lg:w-1/2 text-center p-4 bg-db-light dark:bg-db-dark-nav transition-colors rounded-md border-b-2 border-db-cyan-process">
                  <div className="flex items-center gap-4">
                    <div>
                      <GiPayMoney size={50} />
                    </div>
                    <div className="w-full text-left">
                      <div className="">Paid to $BETR</div>
                      <div className="text-2xl font-bold">$114,123</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='w-full lg:w-2/3 flex justify-end'>things to do</div>
        </div>
      </div>
    </div>
  );
}
