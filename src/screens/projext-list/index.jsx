import React, { useState, useEffect } from 'react';
import qs from 'qs';
import { List } from './list';
import { SearchPanel } from './search-panel';
import { cleanObject } from '../../utils';

const ApiUrl = process.env.REACT_APP_API_URL;

const ProjectListScreen = () => {
  const [param, steParam] = useState({
    name: '',
    personId: '',
  });
  const [list, setList] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${ApiUrl}/projects?${qs.stringify(cleanObject(param))}`).then(
      async (resp) => {
        if (resp.ok) {
          setList(await resp.json());
        }
      }
    );
  }, [param]);

  useEffect(() => {
    fetch(`${ApiUrl}/users`).then(async (resp) => {
      if (resp.ok) {
        setUsers(await resp.json());
      }
    });
  }, []);

  return (
    <div>
      <SearchPanel users={users} param={param} steParam={steParam} />
      <List users={users} list={list} />
    </div>
  );
};

export default ProjectListScreen;
