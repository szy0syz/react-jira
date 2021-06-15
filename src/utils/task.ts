import { useHttp } from "./http";
import { QueryKey, useMutation, useQuery } from "react-query";
import { Task } from "types/Task";
import { useAddConfig, useEditConfig } from "./use-optimistic-options";

export const useTasks = (param?: Partial<Task>) => {
  const client = useHttp();

  return useQuery<Task[]>(["tasks", param], () =>
    client("tasks", { data: param })
  );
};

export const useTask = (id?: number) => {
  const client = useHttp();

  return useQuery<Task>(
    ["task", { id }],
    () => client(`tasks/${id}`),
    {
      enabled: Boolean(id),
    }
  );
};

export const useAddTask = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    (parmas: Partial<Task>) =>
      client(`tasks`, {
        data: parmas,
        method: "POST",
      }),
    useAddConfig(queryKey)
  );
};


export const useEditTask = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    (params: Partial<Task>) =>
      client(`tasks/${params.id}`, {
        method: "PATCH",
        data: params,
      }),
    useEditConfig(queryKey)
  );
};
