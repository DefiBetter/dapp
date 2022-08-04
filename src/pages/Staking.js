import IERC20MetadataABI from '../static/ABI/IERC20MetadataABI.json'
import BetterABI from '../static/ABI/BetterABI.json'

import contractAddresses from '../static/contractAddresses'

import { ethers } from 'ethers';

import { 
    useContractRead,
    usePrepareContractWrite, 
    useContractWrite,
    useWaitForTransaction,
    useBalance
  } from 'wagmi'
import { useState, useCallback } from 'react';

function Staking({activeChain, connectedAddress}) {

    // ---consts--------------------------

    const BN = ethers.BigNumber.from;

    const stakingContractConfig = {
        addressOrName: contractAddresses[activeChain?.network]?.better,
        contractInterface: BetterABI
    }

    // ---reads----------------------------

    // ------consts------------------------

    // staking token addr
    const { data: stakingTokenAddress } = useContractRead({
        ...stakingContractConfig,
        functionName: 'getStakingToken'
    });

    // staking token decimals
    const { data: stakingTokenDecimals } = useContractRead({
        addressOrName: stakingTokenAddress,
        contractInterface: IERC20MetadataABI,
        functionName: 'decimals'
    });

    // ------vars--------------------------

    const [toStake, setToStake] = useState("0");
    const [toUnstake, setToUnstake] = useState("0");

    // staking token balance
    const { 
        data: stakingTokenBalance, 
        isSuccess: stakingTokenBalanceSuccess,
        refetch: refetchStakingTokenBalance
    } = useContractRead({
        addressOrName: stakingTokenAddress,
        contractInterface: IERC20MetadataABI,
        functionName: 'balanceOf',
        args: connectedAddress,
        watch: true
    });

    // staking token allowance
    const { 
        data: stakingTokenAllowance, 
        isSuccess: stakingTokenAllowanceSuccess 
    } = useContractRead({
        addressOrName: stakingTokenAddress,
        contractInterface: IERC20MetadataABI,
        functionName: 'allowance',
        args: [connectedAddress, stakingContractConfig.addressOrName],
        watch: true
    });

    // reward token balance
    const { 
        data: rewardTokenBalance,
        isSuccess: rewardTokenBalanceSuccess,
        refetch: refetchRewardTokenBalance
    } = useBalance({
        addressOrName: connectedAddress,
    });

    // currently staked
    const { 
        data: staked,
        isSuccess: stakedBalanceSuccess,
        refetch: refetchStaked
    } = useContractRead({
        ...stakingContractConfig,
        functionName: 'getStaked',
        overrides: {
            from: connectedAddress
        }
    });

    // pending reward tokens
    const { 
        data: rewards,
        isSuccess: pendingRewardsSuccess
    } = useContractRead({
        ...stakingContractConfig,
        functionName: 'getPendingRewards'
    });

    // ---writes---------------------------

    // stake approve
    const { config: prepareWriteConfigApprove } = usePrepareContractWrite({
        addressOrName: stakingTokenAddress,
        contractInterface: IERC20MetadataABI,
        functionName: 'approve',
        args: [
            //spender
            stakingContractConfig.addressOrName,
            //value
            min(parseStakingInput(toStake), BN(stakingTokenBalance))
        ]
    });

    const { 
        data: approvalTx,
        isLoading: isApproving,
        write: executeStakeApprove
    } = useContractWrite(prepareWriteConfigApprove);

    // stake send
    const { config: prepareWriteConfigStake } = usePrepareContractWrite({
        ...stakingContractConfig,
        functionName: 'stake',
        args: [0]
    });
    const {
        isLoading: isStaking, 
        writeAsync: executeStake,
    } = useContractWrite(prepareWriteConfigStake);

    useWaitForTransaction({
        hash: approvalTx?.hash,
        onSuccess(data) {
            executeStake?.({
                recklesslySetUnpreparedArgs: [min(parseStakingInput(toStake), BN(stakingTokenBalance))]
            }).then(() => {
                refetchStakingTokenBalance?.();
                refetchStaked?.();
            });
            console.log("Staking...")
        }
    })

    // unstake
    const { config: prepareWriteConfigUnstake } = usePrepareContractWrite({
        ...stakingContractConfig,
        functionName: 'unstake',
        args: [0]
    });
    const {
        isLoading: isUnstaking, 
        writeAsync: executeUnstake,
    } = useContractWrite(prepareWriteConfigUnstake);

    // claim
    const { config: prepareWriteConfigClaim } = usePrepareContractWrite({
        ...stakingContractConfig,
        functionName: 'claim',
        overrides: {
            from: connectedAddress
        }
    });
    const {
        isLoading: isClaiming, 
        writeAsync: executeClaim,
    } = useContractWrite(prepareWriteConfigClaim);

    // ---visibility-----------------------

    function fetchOrShow(bool, result, dec) {
        if(bool && dec && result) {
            return ethers.utils.formatUnits(result, dec);
        }
        return "Fetching..."
    }

    function stakingDisabled() {
        return !parseStakingInput(toStake).gt(0) || isApproving || isStaking
    }

    const stakingbuttonText = useCallback(
        () => 
            isApproving 
                ? "Approving..."
                : (
                    isStaking
                    ? "Staking..."
                    : "Stake"
                ),
        [isStaking, isApproving]
    );

    // ---functionality--------------------

    function min(a, b) {
        return a.gt(b) ? b : a;
    }

    function triggerStake(e) {
        e.preventDefault();
        if(parseStakingInput(toStake)?.gt(0)) {
            executeStakeApprove?.();
            console.log("Approving...")
        }        
    }

    function triggerUnstake(e) {
        e.preventDefault();
        if(parseStakingInput(toUnstake)?.gt(0)) {
            executeUnstake?.({
                recklesslySetUnpreparedArgs: min(parseStakingInput(toUnstake), BN(staked)),
                recklesslySetUnpreparedOverrides: {
                    from: connectedAddress
                }
            }).then( () => {
                refetchStaked?.();
                refetchStakingTokenBalance?.();
            });
            console.log("Unstaking...")
        } 
    }

    function triggerClaim(e) {
        e.preventDefault();
        if(parseStakingInput(rewards)?.gt(0)) {
            executeClaim?.({
                recklesslySetUnpreparedOverrides: {
                    from: connectedAddress
                }
            }).then( () => {
                refetchRewardTokenBalance?.();
            });
            console.log("Claiming...")
        }
    }

    function isNumeric(i) {
        return !isNaN(parseFloat(i)) && isFinite(i)
    }

    function parseStakingInput(i) {
        if(isNumeric(i) && stakingTokenDecimals) {
            return ethers.utils.parseUnits(i, stakingTokenDecimals);
        }
        return BN(0)
    }

    const getStakingTokenBalance = 
        useCallback( 
            () => fetchOrShow(stakingTokenBalanceSuccess, stakingTokenBalance, stakingTokenDecimals), 
            [stakingTokenBalanceSuccess, stakingTokenBalance, stakingTokenDecimals]
        );
    const getStakingTokenAllowance = 
        useCallback(
            () => fetchOrShow(stakingTokenAllowanceSuccess, stakingTokenAllowance, stakingTokenDecimals),
            [stakingTokenAllowanceSuccess, stakingTokenAllowance, stakingTokenDecimals]
        );
    const getStaked =
        useCallback(
            () => fetchOrShow(stakedBalanceSuccess, staked, stakingTokenDecimals),
            [stakedBalanceSuccess, staked, stakingTokenDecimals]
        );    

    return (<>

        <p aria-readonly={true}>Staking token balance: {getStakingTokenBalance()}</p>
        <p aria-readonly={true}>Staking token allowance: {getStakingTokenAllowance()}</p>
        <p aria-readonly={true}>Staked: {getStaked()}</p>

        <label htmlFor='stake'>Stake:</label>
        <input name="stake" type="number" onChange={(e) => setToStake(e.target.value)}></input>
        <button 
            onClick={triggerStake}
            disabled={stakingDisabled()}
        >{stakingbuttonText()}</button>

        <label htmlFor='unstake'>Unstake:</label>
        <input name="unstake" type="number" onChange={(e) => setToUnstake(e.target.value)}></input>
        <button 
            onClick={triggerUnstake} 
            disabled={isUnstaking || !staked}
        >{isUnstaking ? "Unstaking..." : "Unstake"}</button>

        <h3>Claim</h3>
        (// TODO use callbacks)
        <p aria-readonly={true}>Pending rewards: {fetchOrShow(pendingRewardsSuccess, rewards, 18)}</p>
        <p aria-readonly={true}>Reward token balance: {fetchOrShow(rewardTokenBalanceSuccess, rewardTokenBalance?.value, 18)}</p>        
        <button 
            onClick={triggerClaim}
            disabled={isClaiming}
        >Claim {fetchOrShow(pendingRewardsSuccess, rewards, 18)}</button>       

    </>)
}

export default Staking