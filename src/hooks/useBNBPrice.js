import { useState } from "react";

export default function useBNBPrice() {
  const [price, setPrice] = useState(0);

  async function fetchPrice() {
    try {
      const bnbPriceData = await (
        await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd"
        )
      ).json();
      setPrice(bnbPriceData["binancecoin"].usd);
    } catch (e) {
      console.error(e);
    }
  }
  fetchPrice();
  return price;
}
