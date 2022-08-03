function SwitchNetwork({network, networkSwitcher}) {

  const { chain: activeChain } = network;
  const { chains: supportedChains, isLoading, pendingChainId, error, switchNetwork } = networkSwitcher;

  return (
    <>
      {activeChain && (
        !activeChain.unsupported 
        ? <div>Connected to {activeChain.name}</div>
        : <div>Connected to unsupported chain with ID {activeChain.name}</div>
      )}

      {supportedChains.map((x) => (
        <button
          disabled={!switchNetwork || x.id === activeChain?.id}
          key={x.id}
          onClick={() => switchNetwork?.(x.id)}
        >
          {x.name}
          {isLoading && pendingChainId === x.id && ' (switching)'}
        </button>
      ))}

      <div>{error && error.message}</div>
    </>
  )
}

export default SwitchNetwork;