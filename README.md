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

const log = debounce(() => console.log("~~call~~"), 3000);

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
import React, { ReactNode, useState } from "react";
import * as auth from "../auth-provider";
import { User } from "../screens/projext-list/search-panel";

interface AuthForm {
  username: string;
  password: string;
}

const AuthContext =
  React.createContext<
    | {
        user: User | null;
        login: (form: AuthForm) => Promise<void>;
        register: (form: AuthForm) => Promise<void>;
        logout: () => Promise<void>;
      }
    | undefined
  >(undefined);

AuthContext.displayName = "AuthContext";

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
    throw new Error("useAuth必须在AuthProvider中使用");
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

const a = { id: 1, name: "jerry" };

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
import styled from "@emotion/styled";

export const Row = styled.div<{
  gap?: number | boolean;
  between?: boolean;
  marginBottom?: number;
}>`
  display: flex;
  align-items: center;
  justify-content: ${(props) => (props.between ? "space-between" : undefined)};
  margin-bottom: ${(props) => props.marginBottom + "rem"};

  > * {
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    margin-right: ${(props) =>
      typeof props.gap === "number"
        ? props.gap + "rem"
        : props.gap
        ? "2rem"
        : undefined};
  }
`;
```

- 改造项目列表组件，真\*`typescript`思想体现

```ts
interface ListProps extends TableProps<Project> {
  users: User[];
}

// * 另一种写法
// type PropsType = Omit<ListProps, 'users'>

export const List = ({ users, ...props }: ListProps) => {
  return (
    <Table
      pagination={false}
      key="id"
      columns={[
        {
          title: "名称",
          dataIndex: "name",
          sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
          title: "部门",
          dataIndex: "organization",
        },
        {
          title: "负责人",
          render(_, project) {
            return (
              <span>
                {users.find((user: User) => user.id === project.personId)
                  ?.name || "未知"}
              </span>
            );
          },
        },
        {
          title: "创建时间",
          dataIndex: "created",
          render(value) {
            return (
              <span>{value ? dayjs(value).format("YYYY-MM-DD") : "无"}</span>
            );
          },
        },
      ]}
      {...props}
    />
  );
};
```

- why-did-you-render
  - `yarn add @welldone-software/why-did-you-render`

```ts
// [/src/wdyr.ts]
import React from "react";

if (process.env.NODE_ENV === "development") {
  const whyDidYouRender = require("@welldone-software/why-did-you-render");
  whyDidYouRender(React, {
    trackAllPureComponents: false,
  });
}
```

- `Object.fromEntries`

> 了解 `iterator` 迭代器

```ts
ary = [1, 2, 3];
// -> (3) [1, 2, 3]
ary[Symbol.iterator];
// -> ƒ values() { [native code] }
i = ary[Symbol.iterator]();
// -> Array Iterator {}

i.next();
// -> {value: 1, done: false}
i.next();
// -> {value: 2, done: false}
i.next();
// -> {value: 3, done: false}
i.next();
// -> {value: undefined, done: true}
```

- 封装 `Select`

```ts
type SelectProps = React.ComponentProps<typeof Select>;

interface IdSelectProps
  extends Omit<SelectProps, "value" | "onChange" | "options"> {
  value: Raw | null | undefined;
  onChange: (value?: number) => void;
  defaultOptionName?: string;
  options?: { name: string; id: number }[];
}

/**
 * value 可以传入多种类型的值
 * onChange 只会回调 number|undefined 类型
 * 当 isNaN(Number(value)) 为 true时，代表选择默认类型
 * 当选择默认类型时，onChange 会回调 undefined
 * @param props
 */
export const IdSelect = (props: IdSelectProps) => {
  const { value, onChange, options, defaultOptionName, ...restProps } = props;
  return (
    <Select
      value={toNumber(value)}
      onChange={(value) => onChange(toNumber(value) || undefined)}
      {...restProps}
    >
      {defaultOptionName ? (
        <Select.Option value={0}>{defaultOptionName}</Select.Option>
      ) : null}
      {options?.map((option) => (
        <Select.Option key={option.id} value={option.id}>
          {option.name}
        </Select.Option>
      ))}
    </Select>
  );
};
```

- **封装自己的 error-boundary**

```ts
import React from "react";

type FallbackRender = (props: { error: Error | null }) => React.ReactElement;

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{ fallbackRender: FallbackRender }>,
  { error: Error | null }
> {
  state = { error: null };

  // 当子组件抛出异常，这里就会收到并赋值给state
  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    const { error } = this.state;
    const { fallbackRender, children } = this.props;

    if (error) {
      return fallbackRender({ error });
    }

    return children;
  }
}
```

```ts
// 如何使用 ErrorBoundary
<ErrorBoundary fallbackRender={FullPageError}>
  {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
</ErrorBoundary>
```

- react-router 和 react-router-dom 的关系，类似于 react 和 react-dom/react-native/react-vr

  - react 是个核心库，用于处理一些虚拟的、纯计算的逻辑，例如我们在组件中的 state 状态怎么来影响虚拟 DOM 树，还有两次虚拟 DOM 树的 diff 计算，这些逻辑都在 react 中处理
  - 那么我们经过一系列计算得到的结果就会被 react-dom 等消费，为什么一开始就不直接集成在 react 里呢？因为 react-dom 是生活在浏览器的 dom 环境中，其里面充满了 dom 操作而且这些 dom 操作只能在浏览器中操作，而 react-native 是用来在移动端原生环境中来消费 react 产生的结果

- react-router 的默认路由
  - `Navigate` 就是默认路由

```ts
<Routes>
  <Route path="/projects" element={<ProjectListScreen />}></Route>
  <Route path="/projects/:projectId/*" element={<ProjectScreen />} />
  <Navigate to="/projects" />
</Routes>
```

- 一个无限循环的小例子

```js
import { useEffect, useState } from "react";

export default function App() {
  // 当 obj 是基本类型时，就不会无限循环
  // 当 obj 是对象时，就会无限循环
  const obj = { name: "jerry" };
  // const obj = 1;
  const [num, setNum] = useState(0);

  useEffect(() => {
    setNum((prev) => prev + 1);
  }, [obj]);

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Hello CodeSandbox</h1>
      {num}
    </div>
  );
}
```

- 基本类型，可以放到依赖里；组件状态，可以放到依赖里；非组件状态的对象，绝不可以放到依赖里。
- 如何限定一个函数的返回值必须是传入的参数一模一样

```ts
export const useUrlQueryParams = <K extends string>(keys: K[]) => {
  const [searchParams, setSearchParams] = useSearchParams();

  return [
    useMemo(
      () =>
        keys.reduce((prev, key) => {
          return { ...prev, [key]: searchParams.get(key) || "" };
        }, {} as { [key in K]: string }),
      [searchParams]
    ),
    (params: Partial<{ [key in K]: unknown }>) => {
      // <--
      const o = cleanObject({
        ...Object.fromEntries(searchParams),
        ...params,
      }) as URLSearchParamsInit;
      setSearchParams(o);
    },
  ] as const; // 转成元组
};
```

- 函数式操作 -- `point free`

```ts
const { mutate } = useEditProject();
const pinProject = (id: number) => (pin: boolean) => {
  mutate({ id, pin });
  refresh();
};

<Table
  pagination={false}
  rowKey="id"
  columns={[
    {
      title: <Pin checked={true} disabled={true} />,
      render(_, project) {
        return (
          <Pin checked={project.pin} onCheckedChange={pinProject(project.id)} />
        );
      },
    },
  ]}
/>;
```

- useState 直接传入函数的含义是：惰性初始化

  - 所以要用 useState 保存函数，不能直接传入函数

- 这个 `hook` 真心有点吊

```ts
export const useUndo = <T>(initialPresent: T) => {
  const [state, setState] = useState<{
    past: T[];
    future: T[];
    present: T;
  }>({
    past: [],
    future: [],
    present: initialPresent,
  });

  const canUndo = state.past.length !== 0;
  const canRedo = state.future.length !== 0;

  const undo = useCallback(() => {
    setState((currentState) => {
      const { past, present, future } = currentState;
      if (past.length === 0) return currentState;

      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [present, ...future],
      };
    });
  }, []);

  const redo = useCallback(() => {
    setState((currentState) => {
      const { past, present, future } = currentState;
      if (future.length === 0) return currentState;

      const next = future[0];
      const newFurete = future.slice(1);

      return {
        past: [...past, present],
        present: next,
        future: newFurete,
      };
    });
  }, []);

  const set = useCallback((newPresent: T) => {
    setState((currentState) => {
      const { past, present } = currentState;
      if (newPresent === present) return currentState;

      return {
        past: [...past, present],
        present: newPresent,
        future: [],
      };
    });
  }, []);

  const reset = useCallback((newPresent: T) => {
    setState(() => {
      return {
        past: [],
        present: newPresent,
        future: [],
      };
    });
  }, []);

  return [state, { set, reset, undo, redo, canUndo, canRedo }] as const;
};
```

- 没用类型守卫之前

```ts
export const ErrorBox = ({ error }: { error?: { message: string } }) => {
  if (error?.message) {
  }
};
```

- 用了类型守卫之后

```ts
// 类型守卫：当满足某个条件时，返回的是某个类型
const isError = (value: any): value is Error => value?.message;

export const ErrorBox = ({ error }: { error: unknown }) => {
  if (isError(error)) {
    return <Typography.Text type="danger">{error.message}</Typography.Text>;
  }

  return null;
};
```

- 封装 use-optimistic-options.ts

```ts
import { QueryKey, useQueryClient } from "react-query";

export const useConfig = (
  queryKey: QueryKey,
  callback: (target: any, old?: any[]) => any[]
) => {
  const queryClient = useQueryClient();

  return {
    onSuccsee: () => queryClient.invalidateQueries(queryKey),
    onMutate(target: any) {
      const previousItems = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, (old?: any[]) =>
        callback(target, old)
      );
      return { previousItems };
    },
    onError(error: any, newItem: any, context: any) {
      // 回滚数据
      queryClient.setQueryData(
        queryKey,
        (context as { previousItems: any[] }).previousItems
      );
    },
  };
};

export const useDeleteConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, old) => old?.filter((item) => item.id !== target.id) || []
  );
export const useEditConfig = (queryKey: QueryKey) =>
  useConfig(
    queryKey,
    (target, old) =>
      old?.map((item) =>
        item.id === target.id ? { ...item, ...target } : item
      ) || []
  );
export const useAddConfig = (queryKey: QueryKey) =>
  useConfig(queryKey, (target, old) => (old ? [...old, target] : []));
```

> 真心抽得厉害！ 11-5!
>
> 12-3 0_0
