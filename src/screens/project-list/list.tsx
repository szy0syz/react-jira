import { Dropdown, Menu, Table, TableProps, Modal } from "antd";
import dayjs from "dayjs";
import { Link } from "react-router-dom";
import { User } from "./search-panel";
import { Pin } from "components/pin";
import { useDeleteProject, useEditProject } from "utils/project";
import { ButtonNoPadding } from "components/lib";
import { useProjectModal, useProjectsQueryKey } from "./util";

export interface Project {
  id: number;
  name: string;
  personId: number;
  pin: boolean;
  organization: string;
  created: number;
}

// * 另一种写法
// type PropsType = Omit<ListProps, 'users'>
interface ListProps extends TableProps<Project> {
  users: User[];
}

export const List = ({ users, ...props }: ListProps) => {
  const { mutate } = useEditProject(useProjectsQueryKey());

  const pinProject = (id: number) => (pin: boolean) => mutate({ id, pin });

  return (
    <Table
      pagination={false}
      rowKey="id"
      columns={[
        {
          title: <Pin checked={true} disabled={true} />,
          render(_, project) {
            return (
              <Pin
                checked={project.pin}
                onCheckedChange={pinProject(project.id)}
              />
            );
          },
        },
        {
          title: "名称",
          dataIndex: "name",
          sorter: (a, b) => a.name.localeCompare(b.name),
          render(_, project) {
            return <Link to={String(project.id)}>{project.name}</Link>;
          },
        },
        {
          title: "部门",
          dataIndex: "organization",
        },
        {
          title: "负责人",
          render(_, project) {
            return (
              <span>
                {users.find((user: User) => user.id === project.personId)
                  ?.name || "未知"}
              </span>
            );
          },
        },
        {
          title: "创建时间",
          dataIndex: "created",
          render(value) {
            return (
              <span>{value ? dayjs(value).format("YYYY-MM-DD") : "无"}</span>
            );
          },
        },
        {
          render(_, project) {
            return <More project={project} />;
          },
        },
      ]}
      {...props}
    />
  );
};

const More = ({ project }: { project: Project }) => {
  const { startEdit } = useProjectModal();
  const editProject = (id: number) => () => startEdit(id);
  const { mutate: deleteProject } = useDeleteProject(useProjectsQueryKey());

  const comfirmDeleteProject = (id: number) => () => {
    Modal.confirm({
      title: "确定删除这个项目吗？",
      content: "点击确定删除",
      okText: "确定",
      cancelText: "取消",
      onOk() {
        deleteProject({ id });
      },
    });
  };

  return (
    <Dropdown
      overlay={
        <Menu>
          <Menu.Item key="edit">
            <ButtonNoPadding type="link" onClick={editProject(project.id)}>
              编辑
            </ButtonNoPadding>
          </Menu.Item>
          <Menu.Item key="delete">
            <ButtonNoPadding
              type="link"
              onClick={comfirmDeleteProject(project.id)}
            >
              删除
            </ButtonNoPadding>
          </Menu.Item>
        </Menu>
      }
    >
      <ButtonNoPadding type="link">...</ButtonNoPadding>
    </Dropdown>
  );
};
