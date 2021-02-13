import styled from '@emotion/styled';
import { useAuth } from 'context/auth-context';
import React from 'react';
import ProjectListScreen from 'screens/projext-list';

export const AuthenticatedApp = () => {
  const { logout } = useAuth();
  return (
    <Container>
      <Header>
        <HeaderLeft>Logo</HeaderLeft>
        <HeaderRight>
          <button onClick={logout}>登出</button>
        </HeaderRight>
      </Header>
      <Main>
        <ProjectListScreen />
      </Main>
    </Container>
  );
};

const Container = styled.div`
  /* display: grid; */
  /* grid-template-rows: 6rem 1fr; */
  height: 100vh;
`;

const Header = styled.header`
  grid-area: header;
  display: flex;
  height: 6rem;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
`;

const HeaderRight = styled.div``;

const Main = styled.main`
  grid-area: main;
  height: calc(100vh - 6rem);
`;
