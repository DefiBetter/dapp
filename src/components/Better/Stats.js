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
    <div className="w-full h-full flex flex-col lg:justify-between lg:items-stretch px-1 gap-2 lg:gap-0">
      <div className="w-full bg-white dark:bg-db-dark-input rounded-lg flex flex-col border-b-2 border-db-cyan-process">
        <div className="flex justify-center font-bold py-1">Epoch Data</div>
        <div className="p-1 text-xs">
          <div className="flex flex-col p-1">
            <div className="flex justify-between">
              <div className="font-bold text-db-blue-gray">Epoch</div>
              <div>
                {props.instrument ? props.instrument.epoch.toString() : null}
              </div>
            </div>
            <div className="flex justify-between">
              <div className="font-bold text-db-blue-gray">Pot Size</div>
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
              <div className="font-bold text-db-blue-gray">Number of bets</div>
              <div>
                {props.epochData ? props.epochData.numBets.toString() : null}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <div className="bg-white dark:bg-db-dark-input rounded-lg flex flex-col border-b-2 border-db-cyan-process">
          <div className="text-center font-bold flex justify-center py-1">
            My
            <span className="font-fancy mt-3 text-db-cyan-process">
              Statistics
            </span>
          </div>
          <div className="p-1 pt-0 text-xs">
            <div className="flex flex-col p-1">
              <div className="flex justify-between font-bold">
                <div className="font-bold text-db-blue-gray">
                  Position value
                </div>
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
                <div className="font-bold text-db-blue-gray">
                  Pending Rewards
                </div>
                <div>
                  {trimNumber(props.pendingBetterBalance, 6, "dp")}{" "}
                  {props.nativeGas}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="font-bold text-db-blue-gray">
                  Number of games
                </div>
                <div>{props.userGainsInfo.numberOfGames.toString()}</div>
              </div>
              <div className="flex justify-between">
                <div className="font-bold text-db-blue-gray">Biggest gain</div>
                <div className="text-db-cyan-process">
                  {+props.userGainsInfo.biggestRelativeGainAmount >= 0
                    ? "+"
                    : "-"}
                  {+props.userGainsInfo.biggestRelativeGainAmount}%{" "}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="font-bold text-db-blue-gray">
                  Most recent gain
                </div>
                <div className="text-db-cyan-process">
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

      <div className="flex flex-col gap-2 w-full">
        <div className="bg-white dark:bg-db-dark-input rounded-lg flex flex-col border-b-2 border-db-cyan-process">
          <div className="text-center font-bold flex justify-center py-1">
            Better
            <span className="font-fancy mt-3 text-db-cyan-process">Gains</span>
          </div>
          <div className="p-1 pt-0 text-xs">
            <div className="flex flex-col p-1">
              <div className="flex justify-between">
                <div className="w-1/2 font-bold text-db-blue-gray">
                  Time left for current week
                </div>
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
                <div className="w-1/2 font-bold text-db-blue-gray">
                  Week's biggest gain
                </div>
                <div className="text-right flex flex-col">
                  <div className="text-db-cyan-process">
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
                  <div>
                    {truncateEthAddress(
                      props.rewardPeriodInfo
                        .globalBiggestRelativeGainCurrentPeriodAddress
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="w-1/2 font-bold text-db-blue-gray">
                  Last week's biggest gain
                </div>
                <div className="text-right flex flex-col">
                  <div className="text-db-cyan-process">
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
                  <div className="">
                    {truncateEthAddress(
                      props.rewardPeriodInfo
                        .globalBiggestRelativeGainPastPeriodAddress
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <div className="w-1/2 font-bold text-db-blue-gray">
                  Biggest gain of all time
                </div>
                <div className=" text-right flex flex-col">
                  <div className="text-db-cyan-process">
                    {+props.rewardPeriodInfo.globalBiggestRelativeGain >= 0
                      ? "+"
                      : "-"}
                    {+props.rewardPeriodInfo.globalBiggestRelativeGain}%
                  </div>
                  <div className="">
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
    </div>
  );
};

export default Stats;
