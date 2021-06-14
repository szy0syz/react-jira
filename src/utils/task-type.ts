import { useHttp } from "./http";
import { useQuery } from "react-query";
import { TaskType } from "types/Task-Type";

export const useTaskTypes = () => {
  const client = useHttp();

  return useQuery<TaskType[]>(["taskTypes"], () =>
    client("taskTypes")
  );
};
