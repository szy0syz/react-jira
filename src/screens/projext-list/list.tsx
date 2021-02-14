import { Table, TableProps } from 'antd';
import dayjs from 'dayjs';
import { User } from './search-panel';

export interface Project {
  id: string;
  name: string;
  personId: string;
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
      key="id"
      columns={[
        {
          title: '名称',
          dataIndex: 'name',
          sorter: (a, b) => a.name.localeCompare(b.name),
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

  // return (
  //   <table>
  //     <thead>
  //       <tr>
  //         <th>名称</th>
  //         <th>负责人</th>
  //       </tr>
  //     </thead>
  //     <tbody>
  //       {list.map((project: Project) => (
  //         <tr key={project.id}>
  //           <td>{project.name}</td>
  //           <td>
  //             {users.find((user: User) => user.id === project.personId)?.name ||
  //               '未知'}
  //           </td>
  //         </tr>
  //       ))}
  //     </tbody>
  //   </table>
  // );
};
