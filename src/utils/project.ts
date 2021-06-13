// import { useEffect } from "react";
// import { cleanObject } from "utils";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Project } from "../screens/project-list/list";
import { useAsync } from "./hooks";
import { useHttp } from "./http";

export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();

  return useQuery<Project[], Error>(["projects", param], () =>
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

export const useEditProject = () => {
  const client = useHttp();
  const queryClient = useQueryClient();

  return useMutation(
    (params: Partial<Project>) =>
      client(`projects/${params.id}`, {
        method: "PATCH",
        data: params,
      }),
    {
      onSuccess: () => queryClient.invalidateQueries("projects"),
    }
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

export const useAddProject = () => {
  const client = useHttp();
  const queryClient = useQueryClient();

  return useMutation(
    (parmas: Partial<Project>) =>
      client(`projects/${parmas.id}`, {
        data: parmas,
        method: "POST",
      }),
    {
      onSuccess: () => queryClient.invalidateQueries("projects"),
    }
  );

  // const { run, ...asyncResult } = useAsync();
  // const mutate = (parmas: Partial<Project>) => {
  //   return run(
  //     client(`projects/${parmas.id}`, {
  //       data: parmas,
  //       method: "POST",
  //     })
  //   );
  // };
  // return { mutate, ...asyncResult };
};
