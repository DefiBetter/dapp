import { 
    useContractRead,
    usePrepareContractWrite, 
    useContractWrite, 
    erc20ABI,
    useWaitForTransaction
} from 'wagmi'
import { useCallback, useState } from "react";

import BetterABI from '../static/ABI/BetterABI.json'
import IERC20MetadataABI from '../static/ABI/IERC20MetadataABI.json'
import contractAddresses from '../static/contractAddresses'
import { ethers } from 'ethers';

function Better({activeChain, connectedAddress}) {

    /**   
     * struct UnderlyingData {
            address addr;
            string description;
            uint decimals;
        }

        function getBinData(address underlying) external view returns(uint, uint);
        function getEpochData(uint _epoch, address underlying) external view returns(
            uint pot,
            uint numBets,
            uint closingPrice,
            uint binStart,
            uint binSize,
            uint16[7] memory betsPerBin,
            uint[7] memory binValues // holding worth of each bin
        );

        function getUserPositions(uint _epoch, address _underlying) external view returns(uint[7] memory);

        function placeTrades(address underlying, uint[7] calldata amounts) external payable;
        function claimBetterRewards() external;

        function getUnderlyings() external view returns(address[] memory);
        function getUnderlyingPrice(address underlying) external view returns(uint);
        function getUnderlyingsDecimalsDescription() external view returns(UnderlyingData[] memory data);
        function getPendingBetterRewards() external view returns(uint);
     */

    // TODO rerender when epoch timer runs out
    // TODO disable betting when in buffer time

    // ### CONSTS ##########################
    
    const BN = ethers.BigNumber.from;
    const betterConfig = {
        addressOrName: contractAddresses[activeChain?.network]?.better,
        contractInterface: BetterABI
    };
    const BINS = 7;
    const inline = {"display": "inline", "padding": "1rem"};

    // ### STATES ##########################

    const [underlying, setUnderlying] = useState("");
    const [binBorders, setBinBorders] = useState({});

    // ### CALLBACKS #######################



    // ### READS ###########################
    
    // ---update on page load---------------

    // underlyings decimals + descriptions
    const { data: underlyingDataArray } = useContractRead({
        ...betterConfig,
        functionName: 'getUnderlyingsDecimalsDescription',
        onSuccess(data) {
            if(!underlying) setUnderlying(data[0]);
        }
    });

    // ---update on epoch-------------------

    // last epoch end

    // bin starts & sizes
    const underlyingValueToFixed = v => parseFloat(ethers.utils.formatEther(v)).toFixed(3)

    useContractRead({
        ...betterConfig,
        functionName: 'getBinData',
        args: [underlying?.addr],
        watch: true,
        onSuccess(data) {
            setBinBorders(
                [...Array(BINS).keys()].map(
                    i => data[0].add(data[1].mul(i))
                )
            )
        }
    });

    // ---update per block------------------

    // epoch
    const { data: epoch } = useContractRead({
        ...betterConfig,
        functionName: 'epoch',
    });

    // epoch data (pot, bin values, etc.)
    const { data: epochData } = useContractRead({
        ...betterConfig,
        functionName: 'getEpochData',
        args: [epoch, underlying.addr]
    });

    // underlying price
    const { data: underlyingPrice } = useContractRead({
        ...betterConfig,
        functionName: 'getUnderlyingPrice',
        args: underlying.addr
    });

    // ### WRITES ##########################

    // place trades

    // claim rewards

    // ### MISC ############################

    // --- data getters -------------------

    function getUnderlyingOptions() {
        return underlyingDataArray?.map( (underlyingDataEntry, index) =>
            <option value={index} key={index}>{underlyingDataEntry.description}</option>
        ) ?? <></>
    }

    function getBinElements() {
        return [...Array(BINS).keys()].map( k => 
            <>
                <p 
                    aria-readonly={true} 
                    id={"bin" + k}  
                    style={inline}
                >
                    {underlyingValueToFixed(binBorders[k] ?? 0)}
                </p>
                <p 
                    aria-readonly={true} 
                    id={"binValue" + k}  
                    style={inline}
                >
                    {underlyingValueToFixed(epochData?.binValues[k] ?? 0)}
                </p>
                <p 
                    aria-readonly={true} 
                    id={"binValue" + k}  
                    style={inline}
                >
                    {epochData?.betsPerBin[k] ?? 0}
                </p>
                <input type="number" style={inline}></input>
                <br></br>
            </>
        )
    }

    // --- button functions ---------------

    function triggerSelectUnderlying(e) {
        e.target.selected = true
        setUnderlying(underlyingDataArray[e.target.value]);
    }

    return (<>
        <p>Countdown: 00:00:00</p>

        <select value={underlying?.description} onChange={triggerSelectUnderlying}>
            {getUnderlyingOptions()}
        </select>

        <h2>Current price:</h2>
        {underlyingValueToFixed(underlyingPrice || 0) || "Fetching..."}

        <h2>Bins data:</h2>
        <div>
            <div style={inline}>Starts</div>
            <div style={inline}>Values</div>
            <div style={inline}># bets</div>
            <div style={inline}>User bets</div>
        </div>
        <br></br>
        {getBinElements()}
        
    </>)
}   

export default Better;