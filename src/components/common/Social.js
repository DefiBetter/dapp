import styled from "styled-components";

const Logo = styled.img`
  height: 5rem;
  width: 5rem;
`;

const Container = styled.div`
  width: 50%;
  justify-content: space-evenly;
  display: flex;
  @media (max-width: 1000px) {
    width: 100%;
  }
`;

const Social = () => {
  return (
    <Container style={{ margin: "0 auto" }}>
      <a href="https://discord.gg/DSDXSXf6Ub">
        <Logo src={require("../../static/image/discord-logo.png")} />
      </a>
      <a href="https://t.me/+2z4mDnFAnjxiMWJl">
        <Logo src={require("../../static/image/telegram-logo.png")} />
      </a>
      <a href="https://twitter.com/defi_better">
        <Logo src={require("../../static/image/twitter-logo.png")} />
      </a>
      <a href="https://medium.com/@defibetter">
        <Logo src={require("../../static/image/medium-logo.png")} />
      </a>
    </Container>
  );
};

export default Social;
