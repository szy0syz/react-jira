import { logout } from './../auth-provider';
import qs from 'qs';

const ApiUrl = process.env.REACT_APP_API_URL;

interface Config extends RequestInit {
  data?: object;
  token?: string;
}

export const http = async (
  endpoint: string,
  { data, token, headers, ...customConfig }: Config
) => {
  const config = {
    method: 'GET',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Content-Type': data ? 'application/json' : '',
    },
    ...customConfig,
  };

  if (config.method.toUpperCase() === 'GET') {
    endpoint += `?${qs.stringify(data)}`;
  } else {
    config.body = JSON.stringify(data || {});
  }

  // 因为 axios 和 fetch 的表现不一样，axios遇到 2xx 以外的状态码则抛异常
  return window
    .fetch(`${ApiUrl}/${endpoint}`, config)
    .then(async (response) => {
      if (response.status === 401) {
        await logout();
        window.location.reload();
        return Promise.reject({ message: '请重选登录' });
      }
      const data = await response.json();
      if (response.ok) {
        return data;
      } else {
        return Promise.reject(data);
      }
    });
};
