export interface Task {
  id: number;
  name: string;
  typeId: number; // bug or task
  epicId: number; // 任务组
  kanbanId: number;
  projectId: number;
  processorId: number; // 经办人
  note: string;

}
