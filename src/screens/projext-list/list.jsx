export const List = ({ users = [], list = [] }) => {
  console.log('users', users);
  console.log('list', list);

  return (
    <table>
      <thead>
        <tr>
          <th>名称</th>
          <th>负责人</th>
        </tr>
      </thead>
      <tbody>
        {list.map((project) => (
          <tr key={project.id}>
            <td>{project.name}</td>
            <td>
              {users.find((user) => user.id === project.personId)?.name ||
                '未知'}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
