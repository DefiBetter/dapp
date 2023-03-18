import useAddToWallet from "../../hooks/useAddToWallet";

export default function AddToWallet({ asset }) {
  const addToWallet = useAddToWallet();

  return (
    <button
      className="min-w-min h-14 px-2 w-full bg-db-background dark:bg-db-blue-gray shadow-sm shadow-db-cyan-process rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
      onClick={() => addToWallet(asset)}
    >
      <img
        src={require("../../../src/static/image/dbmt.png")}
        width={30}
        height={30}
        alt="dbmt logo"
      />
      Add {asset} to wallet
    </button>
  );
}
