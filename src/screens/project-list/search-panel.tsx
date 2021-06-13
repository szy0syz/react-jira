// import { jsx } from '@emotion/react';
import { Input, Form } from "antd";
import { Project } from "../../types/Project";
import { UserSelect } from "components/user-select";
import { User } from "../../types/User";

interface SearchPanelProps {
  users: User[];
  param: Partial<Pick<Project, "name" | "personId">>;
  setParam: (param: SearchPanelProps["param"]) => void;
}

export const SearchPanel = ({ users, param, setParam }: SearchPanelProps) => {
  return (
    <Form style={{ marginBottom: "2rem" }} layout="inline">
      <Form.Item>
        <Input
          placeholder="项目名"
          type="text"
          value={param.name}
          onChange={(evt) =>
            setParam({
              ...param,
              name: evt.target.value,
            })
          }
        />
      </Form.Item>
      <Form.Item>
        <UserSelect
          defaultOptionName="负责人"
          value={param.personId}
          onChange={(val) =>
            setParam({
              ...param,
              personId: val,
            })
          }
        />
      </Form.Item>
    </Form>
  );
};
