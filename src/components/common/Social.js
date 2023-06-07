import styled from "styled-components";

const Logo = styled.img`
  height: 7vw;
  width: 7vw;
  max-height: 40px;
  max-width: 40px;
`;

const Container = styled.div`
  width: 70%;
  justify-content: space-evenly;
  display: flex;
`;

const Social = () => {
  return (
    <Container style={{ margin: "0 auto" }}>
      <a href="https://discord.gg/7E3kYy9rru">
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
