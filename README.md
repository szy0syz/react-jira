# React-Jira

> 👺 👺 👺

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

> 真心封装得厉害！ 11-5!

### 关于深度 React-Query 应用

> 真心好用 💖 💖 💖

```ts
// ---- 父组件 ----
function Parent() {
  const { data: kanbans, isLoading: kanbanIsLoading } = useKanbans(
    useKanbanSearchParams()
  );
  const { isLoading: taskIsLoading } = useTasks(useTasksSearchParams());

  const isLoading = taskIsLoading || kanbanIsLoading;

  return <div>
    {[1,2,3].map((_,idx) => <Ch id={idx}>)}
  </div>
}

function Ch({ id }) {
  const { data: allTasks } = useTasks(useTasksSearchParams());
  // ... filter ...

  return <div></div>
}
```

- 💖 首先初步来看，`useTasks` 会放四次网络请求
  - `isLoading` `一次`，子组件里 `三次`
  - 但结果，总是只发送一次
  - 因为 `query-key` 限制了只使用服务端缓存！！！
- 💖 然后这就能开发人员随意使用 `hook` 不需在意请求，这样我们在一个时间内的请求重复的都会被缓存，那么我们可以在一个大型组件内任意使用 `hook` 获取数据，由 `React-Query` 帮我们拿服务端缓存，但这样的好处在哪里？
  - 就在于上面代码里，我们可以在子组件里重复使用 hook，然后再父组件里，又想获取这个 `hook` 的一个状态 `isLoading`，如果不用现在的技术只能全局取，但现在我们可以 “自由自在”
  - 好处就是：`**更大程度的解耦代码！**`
  - 使用 `hook` 那么久，真的第一次感觉到它的 `**内涵**`
  - 用到现在，感觉 `React-Query` 比 `SWR` 用上去更简单的
- 💖 最终，所有都是函数式 `hook` 组件的项目，到底能不能达到 `React` 项目组所说的 `代数效应` ?

### drag-and-drop

> 这个封装一方库，对泛型和React源码还是有点要求。

```ts
import React from "react";
import {
  Draggable,
  Droppable,
  DraggableProps,
  DroppableProps,
  DroppableProvided,
  DroppableProvidedProps,
} from "react-beautiful-dnd";

type DropProps = Omit<DroppableProps, "children"> & {
  children: React.ReactNode;
};

export const Drop = ({ children, ...props }: DropProps) => {
  return (
    <Droppable {...props}>
      {(provided) => {
        if (React.isValidElement(children)) {
          return React.cloneElement(children, {
            ...provided.droppableProps,
            ref: provided.innerRef,
            provided,
          });
        }
        return <div />;
      }}
    </Droppable>
  );
};

type DropChildProps = Partial<
  { provided: DroppableProvided } & DroppableProvidedProps
> &
  React.HTMLAttributes<HTMLDivElement>;
export const DropChild = React.forwardRef<HTMLDivElement, DropChildProps>(
  ({ children, ...props }, ref) => (
    <div ref={ref} {...props}>
      {children}
      {props.provided?.placeholder}
    </div>
  )
);

type DragProps = Omit<DraggableProps, "children"> & {
  children: React.ReactNode;
};

export const Drag = ({ children, ...props }: DragProps) => {
  return (
    <Draggable {...props}>
      {(provided) => {
        if (React.isValidElement(children)) {
          return React.cloneElement(children, {
            ...provided.draggableProps,
            ...provided.dragHandleProps,
            ref: provided.innerRef,
          });
        }
        return <div />;
      }}
    </Draggable>
  );
};
```

- 首先是为什么要封装这个一方库？
  - 主要是为了节省后续在多个组件使用时代码量
  - 这个效果还是要从官网的案例对照看
- 那到底怎么节省的？
  - 封装 `DropChild` 等组件
  - 这样就节省了导出写 `{...provided.droppableProps}` `{...provided.draggableProps}`
  - 而 `ref` 的话在组件用 `forwardRef` 推出去
  - 最后达到如下效果

```tsx
<DragDropContext onDragEnd={() => {}}>
  <ScreenContainer>
    <h1>{currentProject?.name}看板</h1>
    <SearchPanel />
    {isLoading ? (
      <Spin size="large" />
    ) : (
      <Drop type="COLUMN" direction="horizontal" droppableId="kanban">
        {/* 这里是 styled(DropChild) */}
        <ColumnsContainer>
          {kanbans?.map((kanban, index) => (
            <Drag
              key={kanban.id}
              draggableId={`kanban-${kanban.id}`}
              index={index}
            >
              {/* KanbanColumn 要推ref出来给 Drag 用 */}
              <KanbanColumn kanban={kanban} />
            </Drag>
          ))}

          <CreateKanban />
        </ColumnsContainer>
      </Drop>
    )}
    <TaskModal />
  </ScreenContainer>
</DragDropContext>
```

- 在使用dnd时 `<Drag></Drag>` 需要 `ref`，如果该组件 `children` 只有一个元素如 `div` 时则会自动转发 `ref`

- **记住**所有hook里返回的函数都必须用 `useCallback` 包裹住！

```ts
export const useDropEnd = () => {
  const { data: kanbans } = useKanbans(useKanbanSearchParams());
  const { mutate: reorderKanban } = useReorderKanban();

  return React.useCallback(
    ({ source, destination, type }: DropResult) => {
      if (!destination) return;

      if (type === "COLUMN") {
        const fromId = kanbans?.[source.index].id;
        const toId = kanbans?.[source.index].id;

        // 如果拖拽了，但是兜圈子没改变顺序就不做啥
        if (!fromId || !toId || fromId === toId) return;

        const type = destination.index > source.index ? "after" : "before";
        reorderKanban({ type, fromId, referenceId: toId });
      }
    },
    [kanbans, reorderKanban]
  );
};
```

- 为什么以上 `hook` 的 `useCallback` 依赖是 `[kanbans, reorderKanban]`
- 因为钩子到处都会用，不能在输入没变的情况下，无限制产生 “相同的” 函数！
  - 这个相同的意思就是输入到输出的关系
  - 为什么输入相同，输出缺不同呢？因为里面有 “副作用”，所以我们需要用 `useCallback` 的锁定那些会变的依赖，如果变了，那么对不起，我重新生成一套函数，里面的 “副作用” 是最新的（正确的）！

在某些 计算比较昂贵的组件 可以使用 `React.memo` 进行包裹，可以使得其依据自己本身的 直接参数来觉得渲染，不会根据父组件的与之无关的状态 `re-render` 就莫名其妙的渲染！

但他的计算还是占用资源，就是的一个 `浅比较`，需要酌情试用，不能无限制乱用！

### 性能

```ts
import React, { ProfilerOnRenderCallback, ProfilerProps } from "react";

type Props = { metadata?: any; phase?: ("mount" | "update")[] } & Omit<
  ProfilerProps,
  "onRender"
>;

let queue: unknown[] = [];

const sendProfileQueue = () => {
  if (!queue.length) return;

  const queueToSend = [...queue];
  queue = [];

  console.log(queueToSend);
};

setInterval(sendProfileQueue, 5000);

export const Profiler = ({ metadata, phase, ...props }: Props) => {
  const reportProfile: ProfilerOnRenderCallback = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime,
    interactions
  ) => {
    if (!phase || phase.includes(phase)) {
      queue.push({
        id,
        phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions,
      });
    }
  };

  return <React.Profiler onRender={reportProfile} {...props} />;
};
```

### 测试

```ts
import { render, screen } from "@testing-library/react";
import { Mark } from "components/mask";

test("Mark 组件正确高亮关键词", () => {
  const name = "物料管理";
  const keyword = "管理";

  render(<Mark name={name} keyword={keyword} />);

  expect(screen.getByText(keyword)).toBeInTheDocument();
  expect(screen.getByText(keyword)).toHaveStyle("color: #257AFD");
  expect(screen.getByText("物料")).not.toHaveStyle("color: #257AFD");
});

```

- `yarn add @testing-library/react-hooks msw -D`

----

## Summary

- 做中大型项目可以按 `screen` 分页面，或者按 `module` 来分
  - 如果是按 `module` 来分，则可以包含多个 `screen`
- 可以给每个 `individual` 模块配一个 `/hooks`文件夹，抽象一部分视图层逻辑和状态
  - re-used
- `React-Query` 真的是神器
  - 例如在一个 `screen` 里多次调用某 `Query`，可以合并成一次
  - 这样可以大大降低开发心智负担，大胆分离业务到 `hook` 里
- 借题发挥：
  - 更大型的项目应该用 `lerna` 管理模块，直接将模块分包成小的 `packages`
  - 然后 `packages` 里有 `common` : 用来分管共用资源
  - `packages` 里应该还有各个 `modules` : 其组成又是多个 `screen`
  - 每个 `modules` 有自己的状态管理，如 `redux` 或 `zustand`
  - 然后再 `packages` 上层再建一个 `frontend` 用它来驱动所有 `modules`，不能把 `frontend` 放`packages`下，已搞劈了一次
  - 我觉得更应该按本项目这样做：将 `Apps` 的状态区分为 `服务端状态` 和 `客户端状态`
    - `服务端状态` 用 `React-Query` 管理
    - `客户端状态` 用 `Url` 管理
    - 这样做的好处有一个超级利好，所谓的 `可分布式状态`，在 `a-module` 中直接通过url带状态打开另一模块，而如果用 `redux` 或 `zustand` 虽然也可以做到，但需要在 `module` 中相互发送 `action` 更新对方状态
    - `url状态管理` 虽然 `DX(开发者体验)` 略低于 `redux` 或 `zustand`，但起可扩展性实在很好
    - `url状态管理` 还要附加了一个功能：url可粘贴到其他客户端输入就能还原分享人当前的状态
    - 而且还有一个更好的好处 —— 省了绝大部分使用 keepalive 的场景
    - 例如在这样一个场景：列表页和详情页，用户在列表页点击id进入某详情页，看了3分钟回退，此时首先列表页的url带状态，恢复客户端这一侧的状态，然后 `React-Query` 上场，服务端这一侧的状态，因为默认 `cacheTime` 5分钟不会刷新页面，返回还原列表页状态
    - 而且有了 `mutation` 之后，相当于有了一个全局中心化的服务端数据状态管理，在有新增或编辑的需求是，来一套 `mutation` 和 `乐观更新`，难道它不香吗？
