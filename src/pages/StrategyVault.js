import { Button, ButtonWithInfo } from "../components/common/Button.js";
import {
  useAccount,
  useBalance,
  useContractRead,
  useContractReads,
  useContractWrite,
  useNetwork,
} from "wagmi";
import {
  Card,
  CardBlueBg,
  CardBlueBgBlackBorder,
} from "../components/common/Card";
import Connect from "../components/common/Connect";
import {
  Container,
  InnerContainer,
} from "../components/common/container/Container";
import AppContainer from "../components/common/container/AppContainer.js";
import { Grid, GridCol, GridRow } from "../components/common/Grid";
import { Input, InputNumber } from "../components/common/Input";
import {
  CenterText,
  FancyText,
  MedText,
  NormalText,
  SmallText,
} from "../components/common/Text";
import Navbar from "../components/Navbar/Navbar";
import { contractAddresses } from "../static/contractAddresses";

// ABIs
import DeFiBetterV1ABI from "../static/ABI/DeFiBetterV1ABI.json";
import StrategyVaultABI from "../static/ABI/StrategyVaultABI.json";
import StrategyVaultManagerABI from "../static/ABI/StrategyVaultManagerABI.json";
import IERC20MetadataABI from "../static/ABI/IERC20MetadataABI.json";
import { useEffect, useState } from "react";
import Dropdown from "../components/common/Dropdown";
import {
  CountdownFormatted,
  instrumentLabel,
  timeFormat,
  trimNumber,
} from "../components/common/helper";
import { ethers } from "ethers";
import FancyTitle from "../components/common/Title";
import Countdown from "react-countdown";
import VaultCard from "../components/StrategyVault/VaultCard.js";

function StrategyVault() {
  return (
    <Container>
      <InnerContainer style={{ width: "600px" }}>
        <VaultCard />
      </InnerContainer>
    </Container>
  );
}

export default StrategyVault;
