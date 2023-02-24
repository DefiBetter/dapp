import VaultCard from "../components/StrategyVault/VaultCard.js";

function StrategyVault() {
  return (
    <div className="relative bg-db-background border-[3px] border-db-cyan-process h-full">
      <div className="p-2 md:p-4 flex justify-around items-center">
        <div className="hidden lg:block lg:p-4 p-0 w-1/4">
          <img
            alt="vault"
            className="w-full h-full"
            src={require("../static/image/vault-clipart.svg").default}
          ></img>
        </div>
        <div className='w-full lg:w-1/2'>
          <VaultCard />
        </div>
        <div className="hidden lg:block lg:p-4 p-0 w-1/4">
          <img
            alt="vaultOpen"
            className="w-full h-full"
            src={require("../static/image/open-vault-clipart.svg").default}
          ></img>
        </div>
      </div>
    </div>
  );
}

export default StrategyVault;
