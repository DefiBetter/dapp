import useAddToWallet from "../../hooks/useAddToWallet";

export default function AddToWallet({ asset }) {
  const addToWallet = useAddToWallet();

  return (
    <button
      className="h-14 w-full dark:hover:bg-db-dark bg-white dark:bg-db-dark shadow-sm shadow-db-cyan-process rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
      onClick={() => addToWallet(asset)}
    >
      <img
        src={require("../../../src/static/image/dbmt.png")}
        width={30}
        height={30}
        alt="dbmt logo"
      />
      Add $DBMT to wallet
    </button>
  );
}
