import { Link, useLocation } from "react-router-dom";
import { WalletConnect } from "./web3/WalletConnect";
import { useState } from "react";
import { BiMenu } from "react-icons/bi";
import { IoMdClose } from "react-icons/io";
import { useTheme } from "../../context/ThemeContext";
import { BiHomeAlt2 } from "react-icons/bi";
import { BsSun, BsMoon, BsPiggyBank, BsBook, BsCoin } from "react-icons/bs";
import { CiVault } from "react-icons/ci";
import { FaThinkPeaks } from "react-icons/fa";
import { MdOutlineLeaderboard } from "react-icons/md";

const Navbar = () => {
  const [showSideNavbar, setShowSideNavbar] = useState(false);
  const location = useLocation();
  const themeProvider = useTheme();

  function menuItems() {
    let menuItems = [];

    if (process.env.REACT_APP_PHASE === "PRODUCTION") {
      menuItems.push({
        label: "Home",
        path: "/",
        icon: (
          <BiHomeAlt2
            size={30}
            className={`${
              location.pathname === "/"
                ? "text-db-cyan-process "
                : "text-[#3A4D69]"
            } group-hover:text-db-cyan-process transition-all`}
          />
        ),
      });
    }

    if (process.env.REACT_APP_PHASE === "DBMT_SALE") {
      menuItems.push({
        label: "DBMT",
        path: "/dbmt",
        icon: (
          <BsCoin
            size={30}
            className={`${
              location.pathname === "/dbmt"
                ? "text-db-cyan-process "
                : "text-[#3A4D69]"
            } group-hover:text-db-cyan-process transition-all`}
          />
        ),
      });
      menuItems.push({
        label: "Leaderboard",
        path: "/leaderboard",
        icon: (
          <MdOutlineLeaderboard
            size={30}
            className={`${
              location.pathname === "/leaderboard"
                ? "text-db-cyan-process "
                : "text-[#3A4D69]"
            } group-hover:text-db-cyan-process transition-all`}
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
                ? "text-db-cyan-process "
                : "text-[#3A4D69]"
            } group-hover:text-db-cyan-process transition-all`}
          />
        ),
      });
    }
    menuItems.push(
      {
        label: "Better",
        path: process.env.REACT_APP_PHASE === "PRODUCTION" ? "/better" : "#",
        icon: (
          <FaThinkPeaks
            size={30}
            className={`${
              location.pathname === "/better"
                ? "text-db-cyan-process "
                : "text-[#3A4D69]"
            } group-hover:text-db-cyan-process transition-all`}
          />
        ),
      },
      {
        label: "Staking",
        path: process.env.REACT_APP_PHASE === "PRODUCTION" ? "/staking" : "#",
        icon: (
          <BsPiggyBank
            size={30}
            className={`${
              location.pathname === "/staking"
                ? "text-db-cyan-process "
                : "text-[#3A4D69]"
            } group-hover:text-db-cyan-process transition-all`}
          />
        ),
      },
      {
        label: "Vaults",
        path: process.env.REACT_APP_PHASE === "PRODUCTION" ? "/vaults" : "#",
        icon: (
          <CiVault
            size={30}
            className={`${
              location.pathname === "/vaults"
                ? "text-db-cyan-process "
                : "text-[#3A4D69]"
            } group-hover:text-db-cyan-process transition-all`}
          />
        ),
      }
    );
    return menuItems;
  }

  return (
    <div className="w-full dark:bg-db-dark-nav bg-db-light transition-colors">
      {/* {process.env.REACT_APP_PHASE === "PRODUCTION" && (
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
      )} */}
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
              themeProvider.theme && themeProvider.theme === "light"
                ? require("../../static/image/better-logo.png")
                : require("../../static/image/better-logo-light.png")
            }
            className="w-[160px]"
            alt="logo"
          />
        </Link>
        <nav className="gap-4 items-center justify-center h-full hidden md:flex">
          {menuItems().map((item, index) => (
            <Link
              key={`${item.label}-${index}`}
              to={item.path}
              className={`${
                process.env.REACT_APP_PHASE !== "PRODUCTION" && index > 1 && index !== menuItems.length
                  ? "cursor-not-allowed"
                  : ""
              } w-16 group h-full flex flex-col items-center justify-center relative`}
            >
              {item.icon}
              <span
                className={`${
                  location.pathname === item.path
                    ? "text-db-cyan-process "
                    : "text-[#3A4D69]"
                } text-xs group-hover:text-db-cyan-process transition-colors`}
              >
                {item.label}
              </span>
              <div
                className={`${
                  location.pathname === item.path ? "scale-100" : "scale-0"
                } dark:block hidden group-hover:scale-100 bg-db-cyan-process absolute w-5 h-5 opacity-90 rounded-full blur-lg transition-transform`}
              />
              <div
                className={`${
                  location.pathname === item.path ? "w-full" : "w-0"
                } absolute bottom-0 h-0.5 bg-db-cyan-process group-hover:w-full transition-all duration-300`}
              ></div>
            </Link>
          ))}

          <a
            target="_blank"
            rel="noreferrer"
            href="https://defibetter.gitbook.io/defibetter/"
            className="w-16 group h-full flex flex-col items-center justify-center relative"
          >
            <BsBook
              size={27}
              className="text-[#3A4D69] mt-1 group-hover:text-db-cyan-process transition-all"
            />
            <span className="text-[#3A4D69] text-xs group-hover:text-db-cyan-process transition-colors">
              Docs
            </span>
            <div className="scale-0 dark:block hidden group-hover:scale-100 bg-db-cyan-process absolute w-5 h-5 opacity-90 rounded-full blur-lg transition-transform" />
            <div className="w-0 absolute bottom-0 h-0.5 bg-db-cyan-process group-hover:w-full transition-all duration-300"></div>
          </a>
        </nav>
        <div className="flex gap-4 items-center">
          <div onClick={themeProvider?.toggleTheme}>
            {themeProvider?.theme === "dark" ? (
              <BsSun
                size={25}
                className="text-[#3A4D69] hover:text-db-cyan-process cursor-pointer transition-colors"
              />
            ) : (
              <BsMoon
                size={25}
                className="text-[#3A4D69] hover:text-db-cyan-process cursor-pointer transition-colors"
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
          } transition-transform left-0 z-40 fixed h-full top-16 w-full dark:bg-db-dark bg-white`}
        >
          <div className="gap-4 mt-4 items-center flex flex-col text-xl">
            {menuItems().map((item, index) => (
              <Link
                key={`${item.label}-${index}`}
                onClick={() => setShowSideNavbar(false)}
                to={item.path}
                className={`${
                  process.env.REACT_APP_PHASE !== "PRODUCTION" && index !== 0 && index !== menuItems.length
                    ? "cursor-not-allowed"
                    : ""
                } h-12 group gap-2 flex items-center justify-center relative`}
              >
                {item.icon}
                <span
                  className={`${
                    location.pathname === item.path
                      ? "text-db-cyan-process "
                      : "text-[#3A4D69]"
                  } group-hover:text-db-cyan-process transition-colors`}
                >
                  {item.label}
                </span>
                <div
                  className={`${
                    location.pathname === item.path ? "scale-100" : "scale-0"
                  } dark:block left-1 hidden group-hover:scale-100 bg-db-cyan-process absolute w-5 h-5 opacity-90 blur-lg transition-transform`}
                />
                <div
                  className={`${
                    location.pathname === item.path ? "w-full" : "w-0"
                  } absolute bottom-0 h-0.5 bg-db-cyan-process group-hover:w-full transition-all duration-300`}
                ></div>
              </Link>
            ))}

            <a
              target="_blank"
              rel="noreferrer"
              href="https://defibetter.gitbook.io/defibetter/"
              className="h-12 group gap-2 flex items-center justify-center relative"
            >
              <BsBook
                size={30}
                className="text-[#3A4D69] group-hover:text-db-cyan-process transition-all"
              />
              <span className="text-[#3A4D69] group-hover:text-db-cyan-process transition-colors">
                Docs
              </span>
              <div className="scale-0 dark:block left-1 hidden group-hover:scale-100 bg-db-cyan-process absolute w-5 h-5 opacity-90 blur-lg transition-transform" />
              <div className="w-0 absolute bottom-0 h-0.5 bg-db-cyan-process group-hover:w-full transition-all duration-300"></div>
            </a>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navbar;
