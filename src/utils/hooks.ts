import { useEffect, useState } from 'react';

export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
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
