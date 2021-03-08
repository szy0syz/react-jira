import { useEffect } from 'react';
import { cleanObject } from 'utils';
import { Project } from '../screens/project-list/list';
import { useAsync } from './hooks';
import { useHttp } from './http';

export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();
  const { run, ...result } = useAsync<Project[]>();

  useEffect(() => {
    run(client('projects', { data: cleanObject(param || {}) }));
    // eslint-disable-next-line
  }, [param]);

  return result;
};
