import { Link } from "react-router-dom";
import { WalletConnect } from "./web3/WalletConnect";
import { useState } from "react";
import { BiBookAlt } from "react-icons/bi";

const Navbar = () => {
  const [showSideNavbar, setShowSideNavbar] = useState(false);

  return (
    <div className="">
      <div className="h-[70px] border-4 border-db-cyan-process rounded-2xl w-full shadow-db">
        <div className="flex justify-between items-center h-full px-4">
          <div className="relative h-full">
            <Link
              to={process.env.REACT_APP_PHASE === "PRODUCTION" ? "/" : "/"}
              className="h-full"
            >
              <img
                alt="logo"
                className="h-full"
                src={require("../../static/image/better-logo.png")}
              ></img>
            </Link>
          </div>
          <div className="pt-1.5 flex gap-10 items-center font-fancy text-db-blue text-lg text-db-cyan-process">
            <div>
              <Link
                to={process.env.REACT_APP_PHASE === "PRODUCTION" ? "/" : "/"}
              >
                Better
              </Link>
            </div>
            <div>
              <Link
                to={
                  process.env.REACT_APP_PHASE === "PRODUCTION"
                    ? "/staking"
                    : "/"
                }
              >
                Staking
              </Link>
            </div>
            <div>
              <Link
                to={
                  process.env.REACT_APP_PHASE === "PRODUCTION" ? "/vaults" : "/"
                }
              >
                Strategy vaults
              </Link>
            </div>
            <div>
              <a
                title="Documentation"
                href="https://app.gitbook.com/o/NBcMmIGNsNgrhjS2tczv/s/qLpJBZkEb6TQw9OfyioS/"
                target="_blank"
                rel="noreferrer"
              >
                Documentation
              </a>
            </div>
          </div>
          <div className="relative">
            <WalletConnect />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
