import { useAccount, useConnect, useDisconnect } from "wagmi";

export function WalletConnect() {
  const { connect, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { address } = useAccount();
  const { disconnect, reset } = useDisconnect({ address });

  if (address) {
    return (
      <div>
        {address && <div>Connected: {address}</div>}
        <button
          onClick={() => {
            disconnect(address);
            reset();
          }}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <div>
      {connectors.map((connector) => (
        <button
          disabled={!connector.ready}
          key={connector.id}
          onClick={() => connect({ connector })}
        >
          {connector.name}
          {!connector.ready && " (unsupported)"}
          {isLoading &&
            connector.id === pendingConnector?.id &&
            " (connecting)"}
        </button>
      ))}

      {error && <div>{error.message}</div>}
    </div>
  );
}

export default WalletConnect;
