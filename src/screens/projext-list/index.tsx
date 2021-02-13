import React, { useState, useEffect } from 'react';
import qs from 'qs';
import { useDebounce, useMount } from '../../utils/hooks';
import { List } from './list';
import { SearchPanel } from './search-panel';
import { cleanObject } from '../../utils';
import { useHttp } from 'utils/http';
import styled from '@emotion/styled';

const ProjectListScreen = () => {
  const [param, setParam] = useState({
    name: '',
    personId: '',
  });
  const [list, setList] = useState([]);
  const [users, setUsers] = useState([]);
  const client = useHttp();

  const debouncedParam = useDebounce(param, 500);

  useEffect(() => {
    client('projects', { data: cleanObject(debouncedParam) }).then(setList);
  }, [debouncedParam]);

  useMount(() => {
    client('users').then(setUsers);
  });

  return (
    <Container>
      <h1>项目列表</h1>
      <SearchPanel users={users} param={param} setParam={setParam} />
      <List users={users} list={list} />
    </Container>
  );
};

export default ProjectListScreen;

const Container = styled.div`
  padding: 3.2rem;
`
