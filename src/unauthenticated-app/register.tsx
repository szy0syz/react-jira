import React from 'react';
import { useAuth } from 'context/auth-context';
import { Button, Form, Input } from 'antd';
import { useAsync } from 'utils/hooks';

const RegisterScreen = ({ onError }: { onError: (error: Error) => void }) => {
  const { register } = useAuth();
  const { run, isLoading } = useAsync(undefined, { throwOnError: true });

  const handleSubmit = async ({
    cpassword,
    ...values
  }: {
    username: string;
    password: string;
    cpassword: string;
  }) => {
    if (cpassword !== values.password) {
      onError(new Error('请确认两次密码相同'));
      return;
    }

    try {
      await run(register(values));
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
      <Form.Item
        name="cpassword"
        rules={[{ required: true, message: '请确认密码' }]}
      >
        <Input placeholder="密码" type="password" id={'cpassword'} />
      </Form.Item>
      <Form.Item>
        <Button loading={isLoading} block htmlType="submit" type="primary">
          注册
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RegisterScreen;
