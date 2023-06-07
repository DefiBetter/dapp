import { useEffect, useState } from "react";
import { underlyingToTradingViewSymbol } from "../static/contractAddresses";

const useTradingView = (underlyingDescription) => {
  // address for instrument based on instrument.underlyingDescription
  // const [url, setUrl] = useState();

  // useEffect(() => {
  //   setUrl(
  //     `https://dexscreener.com/${
  //       underlyingPairAddress[
  //         underlyingDescription.split("/")[0].toUpperCase().trim()
  //       ]
  //     }?embed=1&trades=0&info=0`
  //   );
  // }, [underlyingDescription]);

  // TradingView symbol based on instrument.underlyingDescription
  const [symbol, setSymbol] = useState("BTCUSD");

  useEffect(() => {
    setSymbol(
      underlyingToTradingViewSymbol[
        underlyingDescription.split("/")[0].toUpperCase().trim()
      ]
    );
  }, [underlyingDescription]);

  return symbol;
};

export default useTradingView;
