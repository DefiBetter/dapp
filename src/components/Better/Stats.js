import { useState } from "react";
import { useContractRead } from "wagmi";
import { ethers } from "ethers";
import truncateEthAddress from "truncate-eth-address";
import Countdown from "react-countdown";
import { Scrollbar } from "react-scrollbars-custom";
import { trimNumber } from "../common/helper";

const Stats = (props) => {
  /* account, network, configs */
  // network

  /* states */
  //
  const [rewardPeriodLength, setRewardPeriodLength] = useState(0); // seconds
 
  // current period
  const [weekBiggestRelativeGainAmount, setWeekBiggestRelativeGainAmount] =
    useState();

  // past period
  const [
    lastWeekBiggestRelativeGainAmount,
    setLastWeekBiggestRelativeGainAmount,
  ] = useState();

  /* contract read/writes */
  useContractRead({
    ...props.betterContractConfig,
    functionName: "rewardPeriodLength",
    args: [],
    onError(data) {},
    onSuccess(data) {
      setRewardPeriodLength(+data.toString());
    },
  });

  return (
    <div className="w-full overflow-y-auto h-full">
      <Scrollbar>
        <div className="flex flex-col gap-2 w-full p-2">
          <div className="border-2 border-black shadow-db bg-white flex flex-col">
            <div className="flex justify-center font-bold py-1">Epoch Data</div>
            <div className="p-1 text-xs">
              <div className="bg-db-background border-[1px] border-black flex flex-col p-1">
                <div className="flex justify-between">
                  <div>Epoch</div>
                  <div>
                    {props.instrument
                      ? props.instrument.epoch.toString()
                      : null}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>Pot Size</div>
                  <div>
                    {props.epochData
                      ? trimNumber(
                          ethers.utils.formatEther(props.epochData.pot),
                          6,
                          "dp"
                        )
                      : null}{" "}
                    {props.nativeGas ? props.nativeGas : null}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>Number of bets</div>
                  <div>
                    {props.epochData
                      ? props.epochData.numBets.toString()
                      : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full p-2">
          <div className="border-2 border-db-cyan-process shadow-db bg-white flex flex-col rounded-xl">
            <div className="text-center font-bold flex justify-center py-1">
              My
              <span className="font-fancy mt-3 text-db-cyan-process">
                Statistics
              </span>
            </div>
            <div className="p-1 pt-0 text-xs">
              <div className="bg-db-background border-[1px] border-black flex flex-col p-1 rounded-xl">
                <div className="flex justify-between font-bold">
                  <div>Position value</div>
                  <div>
                    {trimNumber(
                      ethers.utils.formatEther(props.userPosition || 0),
                      6,
                      "dp"
                    )}{" "}
                    {props.nativeGas}
                  </div>
                </div>
                <div className="flex justify-between font-bold">
                  <div>Pending Rewards</div>
                  <div>
                    {trimNumber(props.pendingBetterBalance, 6, "dp")}{" "}
                    {props.nativeGas}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>Number of games</div>
                  <div>{props.userGainsInfo.numberOfGames.toString()}</div>
                </div>
                <div className="flex justify-between">
                  <div>Biggest gain</div>
                  <div className="text-lime-500">
                    {+props.userGainsInfo.biggestRelativeGainAmount >= 0
                      ? "+"
                      : "-"}
                    {+props.userGainsInfo.biggestRelativeGainAmount}%{" "}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>Most recent gain</div>
                  <div className="text-lime-500">
                    {+props.userGainsInfo.mostRecentRelativeGainAmount >= 0
                      ? "+"
                      : "-"}
                    {+props.userGainsInfo.mostRecentRelativeGainAmount}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full p-2">
          <div className="border-2 border-db-cyan-process shadow-db bg-white flex flex-col rounded-xl">
            <div className="text-center font-bold flex justify-center py-1">
              Better
              <span className="font-fancy mt-3 text-db-cyan-process">
                Gains
              </span>
            </div>
            <div className="p-1 pt-0 text-xs">
              <div className="bg-db-background border-[1px] border-black flex flex-col p-1 rounded-xl">
                <div className="flex justify-between">
                  <div className="w-1/2">Time left for current week</div>
                  <div className=" text-right">
                    {props.rewardPeriodInfo ? (
                      <Countdown
                        key={
                          (+props.rewardPeriodInfo.rewardPeriodStart +
                            +rewardPeriodLength) *
                          1000
                        }
                        date={
                          (+props.rewardPeriodInfo.rewardPeriodStart +
                            +rewardPeriodLength) *
                          1000
                        }
                      />
                    ) : null}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="w-1/2">Week's biggest gain</div>
                  <div className="text-lime-500 text-right flex flex-col">
                    <div>
                      {+props.rewardPeriodInfo
                        .globalBiggestRelativeGainCurrentPeriod >= 0
                        ? "+"
                        : "-"}
                      {
                        +props.rewardPeriodInfo
                          .globalBiggestRelativeGainCurrentPeriod
                      }
                      %
                    </div>
                    <div className="text-black">
                      {truncateEthAddress(
                        props.rewardPeriodInfo
                          .globalBiggestRelativeGainCurrentPeriodAddress
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="w-1/2">Last week's biggest gain</div>
                  <div className="text-lime-500 text-right flex flex-col">
                    <div>
                      {+props.rewardPeriodInfo
                        .globalBiggestRelativeGainPastPeriod >= 0
                        ? "+"
                        : "-"}
                      {
                        +props.rewardPeriodInfo
                          .globalBiggestRelativeGainPastPeriod
                      }
                      %
                    </div>
                    <div className="text-black">
                      {truncateEthAddress(
                        props.rewardPeriodInfo
                          .globalBiggestRelativeGainPastPeriodAddress
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="w-1/2">Biggest gain of all time</div>
                  <div className="text-lime-500 text-right flex flex-col">
                    <div>
                      {+props.rewardPeriodInfo.globalBiggestRelativeGain >= 0
                        ? "+"
                        : "-"}
                      {+props.rewardPeriodInfo.globalBiggestRelativeGain}%
                    </div>
                    <div className="text-black">
                      {truncateEthAddress(
                        props.rewardPeriodInfo.globalBiggestRelativeGainAddress
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Scrollbar>
    </div>
  );
};

export default Stats;
