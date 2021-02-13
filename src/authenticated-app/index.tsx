import styled from '@emotion/styled';
import { Row } from 'components/lib';
import { useAuth } from 'context/auth-context';
import React from 'react';
import ProjectListScreen from 'screens/projext-list';

export const AuthenticatedApp = () => {
  const { logout } = useAuth();
  return (
    <Container>
      <Header between>
        <HeaderLeft gap>
          <h3>Logo</h3>
          <h3>项目</h3>
          <h3>用户</h3>
        </HeaderLeft>
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

const Header = styled(Row)``;

const HeaderLeft = styled(Row)``;

const HeaderRight = styled.div``;

const Main = styled.main`
  grid-area: main;
  height: calc(100vh - 6rem);
`;
