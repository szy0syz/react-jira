import { Table } from 'antd';
import { spawn } from 'child_process';
import { User } from './search-panel';

interface Project {
  id: string;
  name: string;
  personId: string;
  pin: string;
  organization: string;
}

interface ListProps {
  list: Project[];
  users: User[];
}

export const List = ({ users = [], list = [] }: ListProps) => {
  console.log('users', users);
  console.log('list', list);

  return (
    <Table
      pagination={false}
      columns={[
        {
          title: '名称',
          dataIndex: 'name',
          sorter: (a, b) => a.name.localeCompare(b.name),
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
      ]}
      dataSource={list}
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
