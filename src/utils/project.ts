import { QueryKey } from "react-query";
// import { useEffect } from "react";
// import { cleanObject } from "utils";
import { useMutation, useQuery } from "react-query";
import { Project } from "../types/Project";
import { useHttp } from "./http";
import {
  useAddConfig,
  useDeleteConfig,
  useEditConfig,
} from "./use-optimistic-options";

export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();

  return useQuery<Project[]>(["projects", param], () =>
    client("projects", { data: param })
  );

  // const { run, ...result } = useAsync<Project[]>();
  // const fetchProjects = () =>
  //   client("projects", { data: cleanObject(param || {}) });
  // useEffect(() => {
  //   run(fetchProjects(), { retry: fetchProjects });
  //   eslint-disable-next-line
  // }, [param]);
  // return result;
};

export const useEditProject = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, {
        method: "PATCH",
        data: params,
      }),
    useEditConfig(queryKey)
  );

  // const { run, ...asyncResult } = useAsync();
  // const mutate = (parmas: Partial<Project>) => {
  //   return run(
  //     client(`projects/${parmas.id}`, {
  //       data: parmas,
  //       method: "PATCH",
  //     })
  //   );
  // };
  // return { mutate, ...asyncResult };
};

export const useAddProject = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    (parmas: Partial<Project>) =>
      client(`projects`, {
        data: parmas,
        method: "POST",
      }),
    useAddConfig(queryKey)
  );
};

export const useProject = (id?: number) => {
  const client = useHttp();

  return useQuery<Project>(
    ["project", { id }],
    () => client(`projects/${id}`),
    {
      // 当id有值的时候才去发请求
      enabled: Boolean(id),
    }
  );
};

export const useDeleteProject = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    ({ id }: { id: number }) =>
      client(`projects/${id}`, {
        method: "DELETE",
      }),
    useDeleteConfig(queryKey)
  );
};
