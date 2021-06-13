export interface Task {
  in: number;
  name: String;
  typeId: number; // bug or task
  epicId: number; // 任务组
  kanbanId: number;
  projectId: number;
  processorId: number; // 经办人
  note: string;

}
