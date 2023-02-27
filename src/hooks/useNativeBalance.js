import { useAccount, useBalance } from "wagmi";

export default function useNativeBalance() {
  const { address } = useAccount();

  const { data } = useBalance({
    address: address,
  });
  return data ? data.formatted : 0;
}
