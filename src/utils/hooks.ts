import { useEffect, useRef, useState } from 'react';

export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
    // eslint-disabel-next-line
  }, []);
};

export const useDebounce = <V>(value: V, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 每次在value变化后，设置定时器
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    // 清理定时器
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debouncedValue;
};

export const useArray = <V>(ary: V[]) => {
  const [value, setValue] = useState(ary);

  const clear = () => setValue([]);

  const add: (val: V) => void = (val) => [...value, val];

  const removeIndex: (index: number) => void = (index) =>
    setValue([...value.filter((_, i) => i === index)]);

  return { value, setValue, clear, add, removeIndex };
};

interface State<D> {
  error: Error | null;
  data: D | null;
  stat: 'idle' | 'loading' | 'error' | 'success';
}

const defaultInitialState: State<null> = {
  stat: 'idle',
  data: null,
  error: null,
};

const defaultConfig = {
  throwOnError: false,
};

export const useAsync = <D>(
  initialState?: State<D>,
  initialConfig?: typeof defaultConfig
) => {
  const config = {
    ...defaultConfig,
    ...initialConfig,
  };

  const [state, setState] = useState<State<D>>({
    ...defaultInitialState,
    ...initialState,
  });

  const setData = (data: D) =>
    setState({
      data,
      stat: 'success',
      error: null,
    });

  const setError = (error: Error) =>
    setState({
      data: null,
      stat: 'error',
      error,
    });

  // run 用来触发异步请求
  const run = (promise: Promise<D>) => {
    if (!promise || !promise.then) {
      throw new Error('请传入 Promise 类型的数据');
    }

    setState({ ...state, stat: 'loading' });

    return promise
      .then((data) => {
        setData(data);
        return data;
      })
      .catch((error) => {
        setError(error);
        if (config.throwOnError) return Promise.reject(error);

        return error;
      });
  };

  return {
    isIdle: state.stat === 'idle',
    isError: state.stat === 'error',
    isLoading: state.stat === 'loading',
    isSuccess: state.stat === 'success',
    run,
    setData,
    setError,
    ...state,
  };
};

export const useDocumentTitle = (title: string, keepOnUnmount = true) => {
  const oldTitle = useRef(document.title).current;
  // 页面加载时：旧title
  // 加载后：新title

  useEffect(() => {
    document.title = title;
  }, [title]);

  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        document.title = oldTitle;
      }
    };
  }, [keepOnUnmount, oldTitle]);
};
