import { useNetwork, useSwitchNetwork } from "wagmi";

export function SwitchNetwork() {
  const { chain } = useNetwork();
  const { chains, error, isLoading, pendingChainId, switchNetwork } =
    useSwitchNetwork();

  return (
    <>
      {chain &&
        (!chain.unsupported ? (
          <div>Connected to {chain.name}</div>
        ) : (
          <div>Connected to unsupported chain with ID {chain.name}</div>
        ))}

      {chains.map((x) => (
        <button
          disabled={!switchNetwork || x.id === chain?.id}
          key={x.id}
          onClick={() => switchNetwork?.(x.id)}
        >
          {x.name}
          {isLoading && pendingChainId === x.id && " (switching)"}
        </button>
      ))}

      <div>{error && error.message}</div>
    </>
  );
}

export default SwitchNetwork;
