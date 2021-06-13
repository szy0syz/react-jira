import { User } from "./types/User";

const ApiUrl = process.env.REACT_APP_API_URL;

const LocalStorageKey = '__auth_provider_token__';

export const getToken = () => window.localStorage.getItem(LocalStorageKey);

export const handleUserResponse = ({ user }: { user: User }) => {
  window.localStorage.setItem(LocalStorageKey, user.token || '');
  return user;
};

export const login = (data: { username: string; password: string }) => {
  return fetch(`${ApiUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(async (resp) => {
    if (resp.ok) {
      return handleUserResponse(await resp.json());
    } else {
      return Promise.reject(await resp.json());
    }
  });
};

export const register = (data: { username: string; password: string }) => {
  return fetch(`${ApiUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(async (resp) => {
    if (resp.ok) {
      return handleUserResponse(await resp.json());
    } else {
      return Promise.reject(await resp.json());
    }
  });
};

export const logout = async () =>
  window.localStorage.removeItem(LocalStorageKey);
