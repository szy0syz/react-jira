import styled from "@emotion/styled";
import { Button, Divider, List, Popover, Typography } from "antd";
import { useProjectModal } from "screens/project-list/util";
import { User } from "types/User";
import { useProjects } from "utils/project";
import { useUsers } from "utils/user";
import { ButtonNoPadding } from "./lib";

export const UserPopover = () => {
  const { data: users, refetch } = useUsers();
  const { open } = useProjectModal();

  const content = (
    <ContentContainer>
      <Typography.Text type="secondary">组员列表</Typography.Text>
      <List>
        {users?.map((user: User) => (
          <List.Item>
            <List.Item.Meta title={user.name} />
          </List.Item>
        ))}
      </List>
      <Divider />
    </ContentContainer>
  );

  return (
    <Popover onVisibleChange={() => refetch()} placement="bottom" content={content}>
      <h3>组员</h3>
    </Popover>
  );
};

const ContentContainer = styled.div`
  min-width: 24rem;
`;
