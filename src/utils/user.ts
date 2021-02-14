import { useEffect } from 'react';
import { User } from 'screens/projext-list/search-panel';
import { cleanObject } from 'utils';
import { useAsync } from './hooks';
import { useHttp } from './http';

export const useUsers = (param?: Partial<User>) => {
  const client = useHttp();
  const { run, ...result } = useAsync<User[]>();

  useEffect(() => {
    run(client('users', { data: cleanObject(param || {}) }));
    // eslint-disable-next-line
  }, [param]);

  return result;
};
