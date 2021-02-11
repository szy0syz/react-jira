# React-Jira

> 学

## Notes

```js
const useMount = (callback) => {
  useEffect(() => {
    callback();
  }, [])
}
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

`4-3`
