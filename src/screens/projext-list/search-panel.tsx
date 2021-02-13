import React from 'react';
// import { jsx } from '@emotion/react';
import { Input, Select, Form } from 'antd';

export interface User {
  id: string;
  name: string;
  email: string;
  title: string;
  oranization: string;
  token?: string;
}

interface SearchPanelProps {
  users: User[];
  param: {
    name: string;
    personId: string;
  };
  setParam: (param: SearchPanelProps['param']) => void;
}

export const SearchPanel = ({ users, param, setParam }: SearchPanelProps) => {
  return (
    <Form style={{ marginBottom: '2rem' }} layout="inline">
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
        <Select
          value={param.personId}
          onChange={(val) =>
            setParam({
              ...param,
              personId: val,
            })
          }
        >
          <Select.Option value={''}>负责人</Select.Option>
          {users.map((user: any) => (
            <Select.Option key={user.id} value={user.id}>
              {user.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  );
};
