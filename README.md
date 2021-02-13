# React-Jira

> 学

## Notes

```js
const useMount = (callback) => {
  useEffect(() => {
    callback();
  }, []);
};
```

- 关于什么时候定义成 `custom hook`，什么时候定义成 `function` ？如果内部没有调用其他 `hook` 则就定义成函数挺好！

- 普通 `debounce`

```js
const debounce = (func, delay = 1000) => {
  let timeout;
  return (...param) => {
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      func && func(...param);
    }, delay);
  };
};

const log = debounce(() => console.log('~~call~~'), 3000);

log();
log();
log();
log();

/**
 * 0s -----------> 1s -----------> 2s -----------> ...
 * 一定要理解：这三个函数都是同步操作，所以他们都是在 0s ~ 1s 这个时间内瞬间完成的；
 * log()#1  // timeout#1 赋值
 * log()#2  // 发现 timeout#1 有值那就取消，然后设置 timeout#2
 * log()#3  // 发现 timeout#2 有值那就取消，然后设置 timeout#3
 * log()#4  // 发现 timeout#3 有值那就取消，然后设置 timeout#4
 * 　       // 所以，log()#4 结束后，就只剩下 timeout4 在那里独自等待了...
 */
```

- 新版 `useDebounce`

```js
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 每次在value变化后，设置定时器
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    // 清理定时器
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
};
```

- `auth-context`

```ts
import React, { ReactNode, useState } from 'react';
import * as auth from '../auth-provider';
import { User } from '../screens/projext-list/search-panel';

interface AuthForm {
  username: string;
  password: string;
}

const AuthContext = React.createContext<
  | {
      user: User | null;
      login: (form: AuthForm) => Promise<void>;
      register: (form: AuthForm) => Promise<void>;
      logout: () => Promise<void>;
    }
  | undefined
>(undefined);

AuthContext.displayName = 'AuthContext';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // point free
  const login = (form: AuthForm) => auth.login(form).then(setUser);
  const register = (form: AuthForm) => auth.register(form).then(setUser);
  const logout = () => auth.logout().then(() => setUser(null));

  return (
    <AuthContext.Provider
      children={children}
      value={{ user, login, register, logout }}
    />
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth必须在AuthProvider中使用');
  }

  return context;
};
```

- 如何证明 TypeScript 里的类型是鸭子类型，且是面向接口编程，而不是面向对象编程？

```ts
interface Base {
  id: number;
}

interface Advance extends Base {
  name: string;
}

const test = (p: Base) => {};

const a = { id: 1, name: 'jerry' };

test(a); // --> ok
```

- rem

```css
html {
  /* rem 、em */
  /* em 相对于父元素的 font-size */
  /* rem 相对于根元素html的 font-size */
  /* 默认的16px *62.5% = 10px，1rem === 10px */
  font-size: 62.5%;
}
```

- grid 和 flex 各自的应用场景分析

  - 要考虑是一维布局还是二维布局。一般来说，一维布局用 flex，二维布局用 grid
  - 这个布局是从内容触发还是从布局出发？
    - 从内容触发：先有一组内容（数量一般不固定），然后希望他们均匀的分布在容器中，由内容自己的大小决定占据的空间
    - 从布局触发：先规划网格（数量一般比较固定），然后再把元素往里面填充
    - -> 从内容触发，用 flex
    - -> 从布局触发，用 grid

- 这个 `Row` 组件封装的好

```ts
import styled from '@emotion/styled';

export const Row = styled.div<{
  gap?: number | boolean;
  between?: boolean;
  marginBottom?: number;
}>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.between ? 'space-between' : undefined)};
  margin-bottom: ${(props) => props.marginBottom + 'rem'};

  > * {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    margin-right: ${(props) =>
      typeof props.gap === 'number'
        ? props.gap + 'rem'
        : props.gap
        ? '2rem'
        : undefined};
  }
`;
```
