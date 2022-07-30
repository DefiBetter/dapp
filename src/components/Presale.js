import { useNetwork, useContractRead, useAccount } from 'wagmi'
import { useState } from "react";

import DutchAuctionABI from '../static/ABI/DutchAuctionABI.json'
import contractAddresses from '../static/contractAddresses'
import { ethers } from 'ethers';

export function Presale() {

    const { account } = useAccount();
    const { chain } = useNetwork();

    const [input, setInput] = useState("");
    const [output, setOutput] = useState("0");

    let { isError, refetch } = useContractRead({
        addressOrName: contractAddresses[chain?.network]?.presale,
        contractInterface: DutchAuctionABI,
        functionName: 'estimateOutput',
        args: [ethers.utils.parseEther(input || "0")],
        watch: true,
        onSuccess(data) {
          setOutput(ethers.utils.formatEther(data.toString()))
        },
        onError(error) {
          setOutput(error);
        }
    });

    const buyingTargetChanged = (e) => {
        setInput(e.target.value);
        refetch();
    };

  if(!account) {
    return <div>Please connect your wallet!</div>
  }

  if(chain?.unsupported) {
    return <div>Unsupported chain</div>
  }

  return (
    <>
      {chain &&
        chain.unsupported 
        ? "Unsupported chain"
        : (
          <form>
            <div onChange={buyingTargetChanged}>
                <label htmlFor='inputField'>Input amount:</label>
                <input
                    name="inputField"
                    type="text"
                    className="input"
                    placeholder="Buy for..."
                    autoComplete='off'
                    value={input.toString()}
                />
            </div>
            <div readOnly={true}>
                <label htmlFor='outputField'>Output estimate:</label>
                <input
                    name="outputField"
                    type="text"
                    className="input"
                    value={output}
                />
            </div>
            {isError && <div>Error occured while fetching data!</div>}
          </form>
        )
      }
      
    </>
  )
}