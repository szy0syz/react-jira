import { useDebounce, useDocumentTitle } from "../../utils/hooks";
import { List } from "./list";
import { SearchPanel } from "./search-panel";
import styled from "@emotion/styled";
import { Button, Typography } from "antd";
import { useProjects } from "utils/project";
import { useUsers } from "utils/user";
import { useProjectModal, useProjectSearchParams } from "./util";
import { ButtonNoPadding, Row } from "components/lib";

const ProjectListScreen = () => {
  const { open } = useProjectModal();
  useDocumentTitle("项目列表", false);
  const { data: users } = useUsers();
  // 如果动态key
  // const [keys, setKeys] = useState<('name' | 'personId')[]>(['name', 'personId'])
  // 基本类型，可以放到依赖里；组件状态，可以放到依赖里；非组件状态的对象，绝不可以放到依赖里。
  const [param, setParam] = useProjectSearchParams();
  const {
    isLoading,
    error,
    data: list,
    retry,
  } = useProjects(useDebounce(param, 300));

  return (
    <Container>
      <Row between={true}>
        <h1>项目列表</h1>
        <ButtonNoPadding type="link" onClick={open}>
          创建项目
        </ButtonNoPadding>
      </Row>
      <SearchPanel users={users || []} param={param} setParam={setParam} />
      {error ? (
        <Typography.Text type="danger">{error.message}</Typography.Text>
      ) : null}
      <List
        refresh={retry}
        loading={isLoading}
        users={users || []}
        dataSource={list || []}
      />
    </Container>
  );
};

ProjectListScreen.whyDidYouRender = true;

export default ProjectListScreen;

const Container = styled.div`
  padding: 3.2rem;
`;
