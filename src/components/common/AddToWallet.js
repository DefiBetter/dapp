export default function AddToWallet({
  symbol,
  address,
  decimals,
  imageURL,
  logo,
}) {
  return (
    <button
      className="active:scale-[0.99] transition-all min-w-min h-14 px-2 w-full bg-db-background dark:bg-db-blue-gray shadow-sm shadow-db-cyan-process rounded-lg text-sm flex items-center justify-center gap-2"
      onClick={async () => {
        const { ethereum } = window;

        await ethereum.request({
          method: "wallet_watchAsset",
          params: {
            type: "ERC20",
            options: {
              address: address,
              symbol: symbol,
              decimals: decimals,
              image: imageURL,
            },
          },
        });
      }}
    >
      {logo ? (
        <img
          src={require(`../../../src/static/image/${logo}`)}
          width={30}
          height={30}
          alt="dbmt logo"
        />
      ) : (
        <img
          src={require(`../../../src/static/image/metamask.svg`).default}
          width={30}
          height={30}
          alt="dbmt logo"
        />
      )}
      <span className="">Add {symbol} to wallet</span>
    </button>
  );
}
