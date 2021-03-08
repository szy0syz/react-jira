import { useEffect } from "react";
import { cleanObject } from "utils";
import { Project } from "../screens/project-list/list";
import { useAsync } from "./hooks";
import { useHttp } from "./http";

export const useProjects = (param?: Partial<Project>) => {
  const client = useHttp();
  const { run, ...result } = useAsync<Project[]>();

  const fetchProjects = () =>
    client("projects", { data: cleanObject(param || {}) });

  useEffect(() => {
    run(fetchProjects(), { retry: fetchProjects });
    // eslint-disable-next-line
  }, [param]);

  return result;
};

export const useEditProject = () => {
  const { run, ...asyncResult } = useAsync();
  const client = useHttp();
  const mutate = (parmas: Partial<Project>) => {
    return run(
      client(`projects/${parmas.id}`, {
        data: parmas,
        method: "PATCH",
      })
    );
  };

  return { mutate, ...asyncResult };
};

export const useAddProject = () => {
  const { run, ...asyncResult } = useAsync();
  const client = useHttp();
  const mutate = (parmas: Partial<Project>) => {
    return run(
      client(`projects/${parmas.id}`, {
        data: parmas,
        method: "POST",
      })
    );
  };

  return { mutate, ...asyncResult };
};
