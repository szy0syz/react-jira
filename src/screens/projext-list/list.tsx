import { Table, TableProps } from 'antd';
import dayjs from 'dayjs';
import { Link } from 'react-router-dom';
import { User } from './search-panel';

export interface Project {
  id: number;
  name: string;
  personId: number;
  pin: string;
  organization: string;
  created: number;
}

interface ListProps extends TableProps<Project> {
  users: User[];
}

// * 另一种写法
// type PropsType = Omit<ListProps, 'users'>

export const List = ({ users, ...props }: ListProps) => {
  return (
    <Table
      pagination={false}
      rowKey="id"
      columns={[
        {
          title: '名称',
          dataIndex: 'name',
          sorter: (a, b) => a.name.localeCompare(b.name),
          render(_, project) {
            return <Link to={String(project.id)}>{project.name}</Link>;
          },
        },
        {
          title: '部门',
          dataIndex: 'organization',
        },
        {
          title: '负责人',
          render(_, project) {
            return (
              <span>
                {users.find((user: User) => user.id === project.personId)
                  ?.name || '未知'}
              </span>
            );
          },
        },
        {
          title: '创建时间',
          dataIndex: 'created',
          render(value) {
            return (
              <span>{value ? dayjs(value).format('YYYY-MM-DD') : '无'}</span>
            );
          },
        },
      ]}
      {...props}
    />
  );
};
