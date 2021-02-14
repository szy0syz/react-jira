import React from 'react';
import { useAuth } from 'context/auth-context';
import { Button, Form, Input } from 'antd';

const RegisterScreen = ({ onError }: { onError: (error: Error) => void }) => {
  const { register } = useAuth();

  const handleSubmit = async (values: { username: string; password: string }) => {
    try {
      await register(values);
    } catch (error) {
      onError(error);
    }
  };

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item
        name="username"
        rules={[{ required: true, message: '请输入用户名' }]}
      >
        <Input placeholder="用户名" type="text" id={'username'} />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: '请输入密码' }]}
      >
        <Input placeholder="密码" type="password" id={'password'} />
      </Form.Item>
      <Form.Item>
        <Button block htmlType="submit" type="primary">
          注册
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterScreen;
