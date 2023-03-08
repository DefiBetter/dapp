import { Link } from "react-router-dom";
import { WalletConnect } from "./web3/WalletConnect";
import { useState } from "react";
import { BiMenu } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";

const Navbar = () => {
  const [showSideNavbar, setShowSideNavbar] = useState(false);

  return (
    <div className="">
      {/* Mobile nav */}
      <div className="md:hidden">
        <nav
          className={`${
            showSideNavbar ? "translate-x-0" : "-translate-x-full"
          } transition-transform left-0 z-40 fixed h-full top-24 w-full bg-white border-2 border-db-cyan-process`}
        >
          <div className="z-40 p-10 flex flex-col gap-5 font-fancy text-db-blue text-lg text-db-cyan-process underline font-bold">
            {process.env.REACT_APP_PHASE === "PRODUCTION" && (
              <>
                <div>
                  <Link
                    to={
                      process.env.REACT_APP_PHASE === "PRODUCTION" ? "/" : "/"
                    }
                    onClick={() => setShowSideNavbar(false)}
                  >
                    Better
                  </Link>
                </div>

                <div>
                  <Link
                    onClick={() => setShowSideNavbar(false)}
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
                    onClick={() => setShowSideNavbar(false)}
                    to={
                      process.env.REACT_APP_PHASE === "PRODUCTION"
                        ? "/vaults"
                        : "/"
                    }
                  >
                    Strategy vaults
                  </Link>
                </div>
              </>
            )}
            <div>
              <Link onClick={() => setShowSideNavbar(false)} to={"/airdrop"}>
                Airdrop
              </Link>
            </div>
            <div>
              <a
                onClick={() => setShowSideNavbar(false)}
                title="Documentation"
                href="https://app.gitbook.com/o/NBcMmIGNsNgrhjS2tczv/s/qLpJBZkEb6TQw9OfyioS/"
                target="_blank"
                rel="noreferrer"
              >
                Documentation
              </a>
            </div>
          </div>
        </nav>
      </div>

      {/* Desktop Nav */}
      <nav className="h-[70px] border-4 border-db-cyan-process rounded-2xl w-full shadow-db">
        <div className="flex justify-between items-center h-full px-2 md:px-4">
          <div className="md:hidden">
            {showSideNavbar ? (
              <IoMdClose
                size={30}
                className="text-db-cyan-process cursor-pointer"
                onClick={() => {
                  setShowSideNavbar(false);
                }}
              />
            ) : (
              <BiMenu
                size={30}
                className="text-db-cyan-process cursor-pointer"
                onClick={() => {
                  setShowSideNavbar(true);
                }}
              />
            )}
          </div>
          <div className="relative h-full">
            <Link
              to={process.env.REACT_APP_PHASE === "PRODUCTION" ? "/" : "/"}
              className="h-full"
            >
              <img
                alt="logo"
                className="w-[160px] pt-1"
                src={require("../../static/image/better-logo.png")}
              ></img>
            </Link>
          </div>
          <div className="hidden md:flex pt-1.5 gap-10 items-center font-fancy text-db-blue text-lg text-db-cyan-process underline font-bold">
            {process.env.REACT_APP_PHASE === "PRODUCTION" && (
              <>
                <div>
                  <Link
                    to={
                      process.env.REACT_APP_PHASE === "PRODUCTION" ? "/" : "/"
                    }
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
                      process.env.REACT_APP_PHASE === "PRODUCTION"
                        ? "/vaults"
                        : "/"
                    }
                  >
                    Strategy vaults
                  </Link>
                </div>
              </>
            )}
            <div>
              <Link to="/airdrop">Airdrop</Link>
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
      </nav>
    </div>
  );
};

export default Navbar;
