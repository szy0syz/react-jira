import { useMemo } from 'react';
import { useUrlQueryParams } from 'utils/url';

export const useProjectSearchParams = () => {
  const [param, setParam] = useUrlQueryParams(['name', 'personId']);
  return [
    useMemo(
      () => ({ ...param, personId: Number(param.personId) || undefined }),
      [param]
    ),
    setParam,
  ] as const;
};
