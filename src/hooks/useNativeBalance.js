import { useAccount, useBalance } from "wagmi";

export default function useNativeBalance() {
  const { address } = useAccount();

  const { data } = useBalance({
    address: address,
    watch: true
  });
  return data ? Number(data.formatted).toFixed(4) : 0;
}
