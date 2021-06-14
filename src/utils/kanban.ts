import { useHttp } from "./http";
import { QueryKey, useMutation, useQuery } from "react-query";
import { Kanban } from "types/Kanban";
import { useAddConfig } from "./use-optimistic-options";

export const useKanbans = (param?: Partial<Kanban>) => {
  const client = useHttp();

  return useQuery<Kanban[]>(["kanbans", param], () =>
    client("kanbans", { data: param })
  );
};

export const useAddKanban = (queryKey: QueryKey) => {
  const client = useHttp();

  return useMutation(
    (parmas: Partial<Kanban>) =>
      client(`kanbans`, {
        data: parmas,
        method: "POST",
      }),
    useAddConfig(queryKey)
  );
};
