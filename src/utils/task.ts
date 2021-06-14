import { useHttp } from "./http";
import { QueryKey, useMutation, useQuery } from "react-query";
import { Task } from "types/Task";
import { useAddConfig } from "./use-optimistic-options";

export const useTasks = (param?: Partial<Task>) => {
  const client = useHttp();

  return useQuery<Task[]>(["tasks", param], () =>
    client("tasks", { data: param })
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
