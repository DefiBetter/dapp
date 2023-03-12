import { Link, useLocation } from "react-router-dom";
import { WalletConnect } from "./web3/WalletConnect";
import { useState } from "react";
import { BiMenu } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { useTheme } from "../../context/ThemeContext";
import { BiHomeAlt2 } from "react-icons/bi";
import { BsSun, BsMoon, BsPiggyBank, BsBook, BsCoin } from "react-icons/bs";
import { CiVault } from "react-icons/ci";

const Navbar = () => {
  const [showSideNavbar, setShowSideNavbar] = useState(false);
  const location = useLocation();
  const themeProvider = useTheme();

  function menuItems() {
    let menuItems = [
      // {
      //   label: "Dbmt",
      //   path: "/",
      //   icon: (
      //     <BiHomeAlt2
      //       size={30}
      //       className={`${
      //         location.pathname === "/" ? "text-[#2aaee6] " : "text-[#3A4D69]"
      //       } group-hover:text-[#2aaee6] transition-all`}
      //     />
      //   ),
      // },
    ];

    if (process.env.REACT_APP_PHASE === "PRODUCTION") {
      menuItems.push(
        {
          label: "Staking",
          path: "/staking",
          icon: (
            <BsPiggyBank
              size={30}
              className={`${
                location.pathname === "/staking"
                  ? "text-[#2aaee6] "
                  : "text-[#3A4D69]"
              } group-hover:text-[#2aaee6] transition-all`}
            />
          ),
        },
        {
          label: "Vaults",
          path: "/vaults",
          icon: (
            <CiVault
              size={30}
              className={`${
                location.pathname === "/vaults"
                  ? "text-[#2aaee6] "
                  : "text-[#3A4D69]"
              } group-hover:text-[#2aaee6] transition-all`}
            />
          ),
        }
      );
    } else if (process.env.REACT_APP_PHASE === "DBMT_SALE") {
      menuItems.push({
        label: "$DBMT",
        path: "/dbmt",
        icon: (
          <BsCoin
            size={30}
            className={`${
              location.pathname === "/dbmt"
                ? "text-[#2aaee6] "
                : "text-[#3A4D69]"
            } group-hover:text-[#2aaee6] transition-all`}
          />
        ),
      });
    } else if (
      process.env.REACT_APP_PHASE === "VC_PRESALE" ||
      process.env.REACT_APP_PHASE === "COMMUNITY_PRESALE" ||
      process.env.REACT_APP_PHASE === "PUBLIC_SALE"
    ) {
      menuItems.push({
        label: "Presale",
        path: "/presale",
        icon: (
          <BsCoin
            size={30}
            className={`${
              location.pathname === "/presale"
                ? "text-[#2aaee6] "
                : "text-[#3A4D69]"
            } group-hover:text-[#2aaee6] transition-all`}
          />
        ),
      });
    }
    return menuItems;
  }

  return (
    <div className="w-full dark:bg-db-dark-nav bg-db-light transition-colors">
      {process.env.REACT_APP_PHASE === "PRODUCTION" && (
        <div className="h-8 w-full flex justify-end gap-5 text-xs px-2 md:px-4 items-center text-db-cyan-process">
          <div>
            Daily Volume Avg: <span className="font-bold">69k</span> BNB
          </div>
          <div>
            Volume Today: <span className="font-bold">1,425</span> BNB
          </div>
          <div>
            Daily Fees Avg: <span className="font-bold">3,169</span> BNB
          </div>
          <div>
            Fees Today: <span className="font-bold">1,425</span> BNB
          </div>
          <div>
            Paid to $BETR: <span className="font-bold">921</span> BNB
          </div>
        </div>
      )}
      <div className="h-16 flex justify-between items-center px-2 md:px-4">
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
        <Link to="/">
          <img
            src={
              themeProvider.theme === "dark"
                ? require("../../static/image/better-logo-light.png")
                : require("../../static/image/better-logo.png")
            }
            className="w-[160px]"
            alt="logo"
          />
        </Link>
        <nav className="gap-4 items-center justify-center h-full hidden md:flex">
          {menuItems().map((item) => (
            <Link
              to={item.path}
              className="w-16 group h-full flex flex-col items-center justify-center relative"
            >
              {item.icon}
              <span
                className={`${
                  location.pathname === item.path
                    ? "text-[#2aaee6] "
                    : "text-[#3A4D69]"
                } text-xs group-hover:text-[#2aaee6] transition-colors`}
              >
                {item.label}
              </span>
              <div
                className={`${
                  location.pathname === item.path ? "scale-100" : "scale-0"
                } dark:block hidden group-hover:scale-100 bg-[#2aaee6] absolute w-5 h-5 opacity-90 rounded-full blur-lg transition-transform`}
              />
              <div
                className={`${
                  location.pathname === item.path ? "w-full" : "w-0"
                } absolute bottom-0 h-0.5 bg-[#2aaee6] group-hover:w-full transition-all duration-300`}
              ></div>
            </Link>
          ))}

          <a
            target="_blank"
            rel="noreferrer"
            href="https://github.com/DefiBetter/BetterDocs/blob/main/DeFiBetter%20Litepaper.pdf"
            className="w-16 group h-full flex flex-col items-center justify-center relative"
          >
            <BsBook
              size={27}
              className="text-[#3A4D69] mt-1 group-hover:text-[#2aaee6] transition-all"
            />
            <span className="text-[#3A4D69] text-xs group-hover:text-[#2aaee6] transition-colors">
              Docs
            </span>
            <div className="scale-0 dark:block hidden group-hover:scale-100 bg-[#2aaee6] absolute w-5 h-5 opacity-90 rounded-full blur-lg transition-transform" />
            <div className="w-0 absolute bottom-0 h-0.5 bg-[#2aaee6] group-hover:w-full transition-all duration-300"></div>
          </a>
        </nav>
        <div className="flex gap-4 items-center">
          <div onClick={themeProvider?.toggleTheme}>
            {themeProvider?.theme === "dark" ? (
              <BsSun
                size={25}
                className="text-[#3A4D69] hover:text-[#2aaee6] cursor-pointer transition-colors"
              />
            ) : (
              <BsMoon
                size={25}
                className="text-[#3A4D69] hover:text-[#2aaee6] cursor-pointer transition-colors"
              />
            )}
          </div>

          <div className="relative">
            <WalletConnect />
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden">
        <nav
          className={`${
            showSideNavbar ? "translate-x-0" : "-translate-x-full"
          } transition-transform left-0 z-40 fixed h-full top-24 w-full dark:bg-db-dark bg-white`}
        >
          <div className="gap-4 mt-4 items-center flex flex-col text-xl">
            {menuItems().map((item) => (
              <Link
                onClick={() => setShowSideNavbar(false)}
                to={item.path}
                className="h-12 group gap-2 flex items-center justify-center relative"
              >
                {item.icon}
                <span
                  className={`${
                    location.pathname === item.path
                      ? "text-[#2aaee6] "
                      : "text-[#3A4D69]"
                  } group-hover:text-[#2aaee6] transition-colors`}
                >
                  {item.label}
                </span>
                <div
                  className={`${
                    location.pathname === item.path ? "scale-100" : "scale-0"
                  } dark:block left-1 hidden group-hover:scale-100 bg-[#2aaee6] absolute w-5 h-5 opacity-90 blur-lg transition-transform`}
                />
                <div
                  className={`${
                    location.pathname === item.path ? "w-full" : "w-0"
                  } absolute bottom-0 h-0.5 bg-[#2aaee6] group-hover:w-full transition-all duration-300`}
                ></div>
              </Link>
            ))}

            <a
              target="_blank"
              rel="noreferrer"
              href="https://github.com/DefiBetter/BetterDocs/blob/main/DeFiBetter%20Litepaper.pdf"
              className="h-12 group gap-2 flex items-center justify-center relative"
            >
              <BsBook
                size={30}
                className="text-[#3A4D69] group-hover:text-[#2aaee6] transition-all"
              />
              <span className="text-[#3A4D69] group-hover:text-[#2aaee6] transition-colors">
                Docs
              </span>
              <div className="scale-0 dark:block left-1 hidden group-hover:scale-100 bg-[#2aaee6] absolute w-5 h-5 opacity-90 blur-lg transition-transform" />
              <div className="w-0 absolute bottom-0 h-0.5 bg-[#2aaee6] group-hover:w-full transition-all duration-300"></div>
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
