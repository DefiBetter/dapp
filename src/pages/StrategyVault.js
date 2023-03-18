import VaultCard from "../components/StrategyVault/VaultCard.js";
import PageTitle from "../components/common/PageTitle.js";

function StrategyVault() {
  return (
    <div className="bg-db-light dark:bg-db-dark-nav transition-colors rounded-lg p-2 md:p-4 min-h-[86vh] border-b-2 border-db-cyan-process w-full flex justify-center items-center">
      {/* <PageTitle title="Strategy" fancyTitle="Vaults" /> */}

      <div className="p-2 md:p-4 flex justify-center w-full items-center">
        <div className="hidden lg:block lg:p-4 p-0 w-1/6">
          <img
            alt="vault"
            className="w-full h-full"
            src={require("../static/image/vault-clipart.svg").default}
          ></img>
        </div>
        <div className="w-full lg:w-2/3">
          <VaultCard />
        </div>
        <div className="hidden lg:block lg:p-4 p-0 w-1/6">
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
