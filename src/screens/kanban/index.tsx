import styled from "@emotion/styled";
import { Spin } from "antd";
import { ScreenContainer } from "components/lib";
import { useDocumentTitle } from "utils/hooks";
import { useKanbans, useReorderKanban } from "utils/kanban";
import { useTasks } from "utils/task";
import { CreateKanban } from "./create-kanban";
import { KanbanColumn } from "./kanban-column";
import { SearchPanel } from "./search-panel";
import { TaskModal } from "./task-modal";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { Drop, Drag, DropChild } from "../../components/drag-and-drop";
import {
  useKanbanSearchParams,
  useProjectInUrl,
  useTasksSearchParams,
} from "./util";
import React from "react";

export const KanbanScreen = () => {
  useDocumentTitle("看板列表");
  const { data: currentProject } = useProjectInUrl();
  const { data: kanbans, isLoading: kanbanIsLoading } = useKanbans(
    useKanbanSearchParams()
  );
  const { isLoading: taskIsLoading } = useTasks(useTasksSearchParams());

  const isLoading = taskIsLoading || kanbanIsLoading;

  return (
    <DragDropContext onDragEnd={(...props) => console.log(props)}>
      <ScreenContainer>
        <h1>{currentProject?.name}看板</h1>
        <SearchPanel />
        {isLoading ? (
          <Spin size="large" />
        ) : (
          <ColumnsContainer>
            <Drop type="COLUMN" direction="horizontal" droppableId="kanban">
              <DropChild style={{ display: "flex" }}>
                {/* 这里是 styled(DropChild) */}
                {kanbans?.map((kanban, index) => (
                  <Drag
                    key={kanban.id}
                    draggableId={`kanban-${kanban.id}`}
                    index={index}
                  >
                    {/* KanbanColumn 要推ref出来给 Drag 用 */}
                    <KanbanColumn kanban={kanban} />
                  </Drag>
                ))}
              </DropChild>
            </Drop>
            <CreateKanban />
          </ColumnsContainer>
        )}
        <TaskModal />
      </ScreenContainer>
    </DragDropContext>
  );
};

export const ColumnsContainer = styled(`div`)`
  display: flex;
  overflow-x: scroll;
  flex: 1;
`;

export const useDropEnd = () => {
  const { data: kanbans } = useKanbans(useKanbanSearchParams());
  const { mutate: reorderKanban } = useReorderKanban();

  return React.useCallback(
    ({ source, destination, type }: DropResult) => {
      if (!destination) return;

      if (type === "COLUMN") {
        const fromId = kanbans?.[source.index].id;
        const toId = kanbans?.[source.index].id;

        // 如果拖拽了，但是兜圈子没改变顺序就不做啥
        if (!fromId || !toId || fromId === toId) return;

        const type = destination.index > source.index ? "after" : "before";
        reorderKanban({ type, fromId, referenceId: toId });
      }
    },
    [kanbans, reorderKanban]
  );
};
