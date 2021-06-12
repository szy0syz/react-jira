import { useDebounce, useDocumentTitle } from '../../utils/hooks';
import { List } from './list';
import { SearchPanel } from './search-panel';
import styled from '@emotion/styled';
import { Typography } from 'antd';
import { useProjects } from 'utils/project';
import { useUsers } from 'utils/user';
import { useProjectSearchParams } from './util';


const ProjectListScreen = () => {
  useDocumentTitle('项目列表', false);
  const { data: users } = useUsers();
  // 如果动态key
  // const [keys, setKeys] = useState<('name' | 'personId')[]>(['name', 'personId'])
  // 基本类型，可以放到依赖里；组件状态，可以放到依赖里；非组件状态的对象，绝不可以放到依赖里。
  const [param, setParam] = useProjectSearchParams()
  const { isLoading, error, data: list, retry } = useProjects(useDebounce(param, 300));

  return (
    <Container>
      <h1>项目列表</h1>
      <SearchPanel users={users || []} param={param} setParam={setParam} />
      {error ? (
        <Typography.Text type="danger">{error.message}</Typography.Text>
      ) : null}
      <List refresh={retry} loading={isLoading} users={users || []} dataSource={list || []} />
    </Container>
  );
};

ProjectListScreen.whyDidYouRender = true;

export default ProjectListScreen;

const Container = styled.div`
  padding: 3.2rem;
`;
