import { Input, Select } from 'antd';
import React from 'react';

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
    <form>
      <div>
        <Input
          type="text"
          value={param.name}
          onChange={(evt) =>
            setParam({
              ...param,
              name: evt.target.value,
            })
          }
        />
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
      </div>
    </form>
  );
};
