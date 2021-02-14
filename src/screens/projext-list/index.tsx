import React, { useState, useEffect } from 'react';
import qs from 'qs';
import { useAsync, useDebounce, useMount } from '../../utils/hooks';
import { List, Project } from './list';
import { SearchPanel } from './search-panel';
import { cleanObject } from '../../utils';
import { useHttp } from 'utils/http';
import styled from '@emotion/styled';
import { Typography } from 'antd';
import { useProjects } from 'utils/project';
import { useUsers } from 'utils/user';

const ProjectListScreen = () => {
  const [param, setParam] = useState({
    name: '',
    personId: '',
  });
  const debouncedParam = useDebounce(param, 500);
  const { data: users } = useUsers();
  const { isLoading, error, data: list } = useProjects(debouncedParam);

  return (
    <Container>
      <h1>项目列表</h1>
      <SearchPanel users={users || []} param={param} setParam={setParam} />
      {error ? (
        <Typography.Text type="danger">{error.message}</Typography.Text>
      ) : null}
      <List loading={isLoading} users={users || []} dataSource={list || []} />
    </Container>
  );
};

export default ProjectListScreen;

const Container = styled.div`
  padding: 3.2rem;
`;
