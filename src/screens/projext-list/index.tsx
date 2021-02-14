import React, { useState, useEffect } from 'react';
import qs from 'qs';
import { useAsync, useDebounce, useMount } from '../../utils/hooks';
import { List, Project } from './list';
import { SearchPanel } from './search-panel';
import { cleanObject } from '../../utils';
import { useHttp } from 'utils/http';
import styled from '@emotion/styled';
import { Typography } from 'antd';

const ProjectListScreen = () => {
  const [param, setParam] = useState({
    name: '',
    personId: '',
  });
  const [users, setUsers] = useState([]);
  const client = useHttp();
  const { run, error, data: list, isLoading } = useAsync<Project[]>();

  const debouncedParam = useDebounce(param, 500);

  useEffect(() => {
    run(client('projects', { data: cleanObject(debouncedParam) }));
    // eslint-disable-next-line
  }, [debouncedParam]);

  useMount(() => {
    client('users').then(setUsers);
  });

  return (
    <Container>
      <h1>项目列表</h1>
      <SearchPanel users={users} param={param} setParam={setParam} />
      {error ? (
        <Typography.Text type="danger">{error.message}</Typography.Text>
      ) : null}
      <List loading={isLoading} users={users} dataSource={list || []} />
    </Container>
  );
};

export default ProjectListScreen;

const Container = styled.div`
  padding: 3.2rem;
`;
